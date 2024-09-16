import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CenteredSpinner } from "@/features/common/components/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Organization } from "../../interface/organization";
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
} from "../services/organizations";

export default function OrganizationTable() {
  const {
    data: organizations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory", "organizations"],
    queryFn: getOrganizations,
  });

  const [open, setOpen] = useState(false);
  const [params, setParams] = useSearchParams();

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <p>Ha ocurrido un error: {error.message}</p>;
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      <AddOrgButton open={open} setOpen={setOpen} />
      <Table>
        <TableHeader>
          <TableCell>Nombre</TableCell>
          <TableCell>Ubicación</TableCell>
          <TableCell>Acciones</TableCell>
        </TableHeader>
        <TableBody className="divide-y">
          {organizations?.map((org) => {
            return (
              <TableRow>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.location}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newParams = new URLSearchParams(params);
                      newParams.set(
                        "organizationId",
                        org.organizationId.toString()
                      );
                      setParams(newParams);
                      setOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <DeleteButton organizationId={org.organizationId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function AddOrgButton(props: { open: boolean; setOpen: (v: boolean) => void }) {
  const [params, setParams] = useSearchParams();

  const { data: organization, isLoading } = useQuery({
    queryKey: ["inventory", "organizations", params.get("organizationId")],
    queryFn: () =>
      getOrganization({
        organizationId: parseInt(params.get("organizationId") ?? ""),
      }),
  });

  return (
    <>
      <Button
        onClick={() => {
          const newParams = new URLSearchParams(params);
          newParams.delete("organizationId");
          setParams(newParams);
          props.setOpen(true);
        }}
      >
        Crear organización
      </Button>
      <Dialog open={props.open} modal={true} onOpenChange={props.setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar una organización</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {isLoading && <CenteredSpinner />}
          {!isLoading && (
            <AddOrgForm
              defaultValues={organization ?? undefined}
              onSubmit={() => props.setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  location: z.string().min(1, {
    message: "La ubicación es requerida",
  }),
});

export function AddOrgForm(props: {
  defaultValues?: Organization;
  onSubmit: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  });
  const client = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (props.defaultValues?.organizationId) {
        await updateOrganization({
          ...values,
          organizationId: props.defaultValues.organizationId,
        });
        toast.success("Organización actualizada correctamente");
      } else {
        await createOrganization(values);
        toast.success("Organización creada correctamente");
      }
      client.invalidateQueries({
        queryKey: ["inventory", "organizations"],
      });
      props.onSubmit();
    } catch (err) {
      toast.error("Ha ocurrido un error: " + err);
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la organización" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input
                  placeholder="Breve descripción de la ubicación"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

export function DeleteButton({ organizationId }: { organizationId: string }) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteOrganization,
    mutationKey: ["inventory", "organizations", "delete", organizationId],
  });
  const [show, setShow] = useState(false);
  const client = useQueryClient();

  const handleDelete = async (equipmentTypeId: number) => {
    try {
      await mutateAsync({ organizationId: equipmentTypeId });
      await client.invalidateQueries({
        queryKey: ["inventory", "organizations"],
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 409) {
          toast.error(err.response.data.message);
        }
        return;
      }
      toast.error("No se pudo borrar la organización: " + err);
    }
  };
  return (
    <>
      <Dialog open={show} modal={true} onOpenChange={(open) => setShow(open)}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            onClick={() => setShow(true)}
            disabled={isPending}
          >
            Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-col gap-5">
            <DialogTitle>
              ¿Estás seguro de que desea eliminar la organización?
            </DialogTitle>
            <DialogDescription>Esta acción es irreversible</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setShow(false);
                }}
                variant="secondary"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              type="submit"
              variant="destructive"
              onClick={() => {
                handleDelete(parseInt(organizationId));
                setShow(false);
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
