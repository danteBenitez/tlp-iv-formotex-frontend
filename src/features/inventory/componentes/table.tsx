import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/features/common/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllEquipment } from "../services/inventory";

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
