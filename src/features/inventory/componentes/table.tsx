import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
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
        <Spinner />
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
