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
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/features/common/components/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteEquipment, getAllEquipment } from "../services/inventory";

export default function InventoryTable() {
  const {
    data: equipments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory", "equipment"],
    queryFn: getAllEquipment,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="size-42" />
      </div>
    );
  }

  if (error) {
    return <p>Ha ocurrido un error: {error.message}</p>;
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      <Table>
        <TableHeader>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Marca</TableCell>
          <TableCell>Tipo</TableCell>
          <TableCell>Acciones</TableCell>
        </TableHeader>
        <TableBody className="divide-y">
          {equipments?.map((equipment) => {
            return (
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.description}</TableCell>
                <TableCell>{equipment.make}</TableCell>
                <TableCell>{equipment.type?.name ?? ""}</TableCell>
                <TableCell>
                  <DeleteButton equipmentId={parseInt(equipment.equipmentId)} />
                  <Link to={`/inventory/form/${equipment.equipmentId}`}>
                    <Button variant="ghost">Editar</Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function DeleteButton({ equipmentId }: { equipmentId: number }) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteEquipment,
    mutationKey: ["inventory", "equipment", "delete", equipmentId],
  });
  const [show, setShow] = useState(false);
  const client = useQueryClient();

  const handleDelete = async (equipmentId: number) => {
    await mutateAsync({ equipmentId: equipmentId });
    await client.invalidateQueries({
      queryKey: ["inventory", "equipment"],
    });
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col gap-5">
            <DialogTitle>
              ¿Estás seguro de que desea eliminar el equipo?
            </DialogTitle>
            <DialogDescription>
              Todas las unidades se borrarán automáticamente
            </DialogDescription>
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
                handleDelete(equipmentId);
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
