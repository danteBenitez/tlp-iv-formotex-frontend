import EquipmentTypesTable from "@/features/inventory/equipment-types/components/table";

export default function EquipmentTypesPage() {
  return (
    <main className="w-full p-8">
      <div className="flex gap-2 flex-col">
        <h2 className="text-4xl font-bold">Tipos de equipos</h2>
        <p className="p-2"></p>
      </div>
      
      <div className="p-2 px-4">
        <EquipmentTypesTable />
      </div>
    </main>
  );
}
