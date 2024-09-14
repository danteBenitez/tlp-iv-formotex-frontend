import EquipmentTypesTable from "@/features/inventory/equipment-types/components/table";

export default function EquipmentTypesPage() {
  return (
    <main className="p-5 w-full mt-5">
      <div className="flex gap-2 flex-col">
        <h2 className="text-4xl font-bold">Tipos de equipos</h2>
        <p className="p-2">
          Las distintas categorías de equipos informáticos reconocidas por
          Formotex.
        </p>
      </div>
      <EquipmentTypesTable />
    </main>
  );
}
