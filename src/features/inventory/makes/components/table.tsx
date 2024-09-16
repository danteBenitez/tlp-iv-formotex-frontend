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
import { Make } from "../interfaces/make";
import {
  createMake,
  deleteMake,
  getMake,
  getMakes,
  updateMake,
} from "../services/make";

export default function MakeTable() {
  const {
    data: makes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory", "makes"],
    queryFn: getMakes,
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
          <TableCell>Descripción</TableCell>
          <TableCell>Acciones</TableCell>
        </TableHeader>
        <TableBody className="divide-y">
          {makes?.map((make) => {
            return (
              <TableRow>
                <TableCell>{make.name}</TableCell>
                <TableCell>{make.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newParams = new URLSearchParams(params);
                      newParams.set("makeId", make.makeId.toString());
                      setParams(newParams);
                      setOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <DeleteButton makeId={make.makeId.toString()} />
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

  const { data: make, isLoading } = useQuery({
    queryKey: ["inventory", "makes", params.get("makeId")],
    queryFn: () =>
      getMake({
        makeId: parseInt(params.get("makeId") ?? ""),
      }),
  });

  return (
    <>
      <Button
        onClick={() => {
          const newParams = new URLSearchParams(params);
          newParams.delete("makeId");
          setParams(newParams);
          props.setOpen(true);
        }}
      >
        Crear marca
      </Button>
      <Dialog open={props.open} modal={true} onOpenChange={props.setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar una marca</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {isLoading && <CenteredSpinner />}
          {!isLoading && (
            <AddMakeForm
              defaultValues={make ?? undefined}
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
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
});

export function AddMakeForm(props: {
  defaultValues?: Make;
  onSubmit: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  });
  const client = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (props.defaultValues?.makeId) {
        await updateMake({
          ...values,
          makeId: props.defaultValues.makeId,
        });
        toast.success("Marca actualizada correctamente");
      } else {
        await createMake(values);
        toast.success("Marca creada correctamente");
      }
      client.invalidateQueries({
        queryKey: ["inventory", "makes"],
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
                <Input placeholder="Nombre de la marca" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Breve descripción de la marca" {...field} />
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

export function DeleteButton({ makeId }: { makeId: string }) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteMake,
    mutationKey: ["inventory", "makes", "delete", makeId],
  });
  const [show, setShow] = useState(false);
  const client = useQueryClient();

  const handleDelete = async (makeId: number) => {
    try {
      await mutateAsync({ makeId: makeId });
      await client.invalidateQueries({
        queryKey: ["inventory", "makes"],
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 409) {
          toast.error("Existen equipo con esta marca. No es posible borrarla");
        }
      }
      toast.error("No se pudo borrar la marca: " + err);
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
              ¿Estás seguro de que desea eliminar la marca?
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
                handleDelete(parseInt(makeId));
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
