import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/features/common/components/delete-button";
import Spinner from "@/features/common/components/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
  const client = useQueryClient();

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
              <TableRow>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.description}</TableCell>
                <TableCell>{equipment.make?.name}</TableCell>
                <TableCell>{equipment.type?.name ?? ""}</TableCell>
                <TableCell>
                  <DeleteButton
                    id={parseInt(equipment.equipmentId)}
                    mutationKey={[
                      "inventory",
                      "equipment",
                      "delete",
                      equipment.equipmentId,
                    ]}
                    onDelete={async (id) => {
                      await deleteEquipment({ equipmentId: id });
                      await client.invalidateQueries({
                        queryKey: ["inventory", "equipment"],
                      });
                      toast.success("Equipo eliminado correctamente.");
                    }}
                    dialogText={{
                      title: "¿Estás seguro de que desea eliminar el equipo?",
                      description:
                        "Todas las unidades se borrarán automáticamente",
                    }}
                  />
                  <Link to={`/dashboard/form/${equipment.equipmentId}`}>
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
