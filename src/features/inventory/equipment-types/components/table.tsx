import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { ApiError } from "@/features/common/api";
import DeleteButton from "@/features/common/components/delete-button";
import Spinner from "@/features/common/components/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { EquipmentType } from "../../interface/equipment-type";
import {
  createEquipmentType,
  deleteEquipmentType,
  getEquipmentType,
  getEquipmentTypes,
  updateEquipmentType,
} from "../../services/equipment-types";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export default function EquipmentTypesTable() {
  const { data: types, isLoading } = useQuery({
    queryKey: ["inventory", "equipment", "types"],
    queryFn: getEquipmentTypes,
  });
  const [open, setOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const client = useQueryClient();

  const handleDelete = async (id: number) => {
    try {
      await deleteEquipmentType({ equipmentTypeId: id });
      await client.invalidateQueries({
        queryKey: ["inventory", "equipment", "types"],
      });
      toast.success("Tipo de equipamiento borrado correctamente");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.response?.status == 409) {
          toast.error("Existen equipo con este tipo. No es posible borrarlo");
        }
      }
    }
  };

  if (isLoading) {
    return <Spinner className="size-24" />;
  }

  return (
    <div>
      <AddTypeDialog open={open} setOpen={setOpen} />
      <Table>
        <TableHeader>
          <TableCell>Tipo</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Acciones</TableCell>
        </TableHeader>

        <TableBody className="divide-y">
          {types?.map((type) => {
            return (
              <TableRow>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newParams = new URLSearchParams(params);
                      newParams.set(
                        "equipmentTypeId",
                        type.equipmentTypeId.toString()
                      );
                      setParams(newParams);
                      setOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <DeleteButton
                    id={type.equipmentTypeId}
                    mutationKey={[
                      "inventory",
                      "equipment",
                      "types",
                      "delete",
                      type.equipmentTypeId.toString(),
                    ]}
                    onDelete={handleDelete}
                    dialogText={{
                      title:
                        "¿Está seguro de que desea eliminar este tipo de equipamiento?",
                      description:
                        "No podrá eliminar tipos con equipos asociados",
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function AddTypeDialog(props: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [params, setParams] = useSearchParams();

  const { data: equipmentType, isLoading } = useQuery({
    queryKey: [
      "inventory",
      "equipment",
      "types",
      params.get("equipmentTypeId"),
    ],
    queryFn: () =>
      getEquipmentType({
        equipmentTypeId: parseInt(params.get("equipmentTypeId") ?? ""),
      }),
  });

  return (
    <>
      <Button
        onClick={() => {
          const newParams = new URLSearchParams(params);
          newParams.delete("equipmentTypeId");
          setParams(newParams);
          props.setOpen(true);
        }}
      >
        Crear tipo
      </Button>
      <Dialog open={props.open} modal={true} onOpenChange={props.setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar un tipo de equipo</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {!isLoading && (
            <AddTypeForm
              defaultValues={equipmentType ?? undefined}
              onSubmit={() => props.setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AddTypeForm(props: {
  defaultValues?: EquipmentType;
  onSubmit: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  });
  const client = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (props.defaultValues?.equipmentTypeId) {
        await updateEquipmentType({
          ...values,
          equipmentTypeId: props.defaultValues.equipmentTypeId,
        });
        toast.success("Tipo actualizado correctamente");
      } else {
        await createEquipmentType(values);
        toast.success("Tipo creado correctamente");
      }
      client.invalidateQueries({
        queryKey: ["inventory", "equipment", "types"],
      });
      props.onSubmit();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.response?.status == 409) {
          toast.error("Ya existe un tipo con ese nombre");
          return;
        }
      }
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
                <Input placeholder="Nombre de tipo" {...field} />
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
                <Input placeholder="Una descripción" {...field} />
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
