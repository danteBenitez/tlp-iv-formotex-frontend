import { useQuery } from "@tanstack/react-query";
import { Spinner, Table } from "flowbite-react";
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
        <Table.Head>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>Descripción</Table.HeadCell>
          <Table.HeadCell>Marca</Table.HeadCell>
          <Table.HeadCell>Tipo</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {equipments?.map((equipment) => {
            return (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{equipment.name}</Table.Cell>
                <Table.Cell>{equipment.description}</Table.Cell>
                <Table.Cell>{equipment.make}</Table.Cell>
                <Table.Cell>{equipment.type?.name ?? ""}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
