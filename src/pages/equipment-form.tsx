import EquipmentForm from "@/features/inventory/componentes/equipment-form";

export default function EquipmentFormPage() {
  return (
    <main className="w-full p-8">
      <div className="flex gap-2 flex-col">
        <h2 className="text-4xl font-bold">Formulario para equipos</h2>
        <p className="p-2">Crea un equipo</p>
      </div>
      <div className="p-2 px-4">
        <EquipmentForm />
      </div>
    </main>
  );
}
