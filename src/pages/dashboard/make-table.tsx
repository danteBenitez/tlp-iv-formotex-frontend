import MakeTable from "@/features/inventory/makes/components/table";

export default function MakeTablePage() {
  return (
    <main className="p-5 w-full mt-5">
      <div className="flex gap-2 flex-col">
        <h2 className="text-4xl font-bold">Marcas</h2>
        <p className="p-2">Gestión de las marcas de equipos informáticos</p>
      </div>
      <MakeTable />
    </main>
  );
}
