import { Button } from "@/components/ui/button";
import InventoryTable from "@/features/inventory/components/table";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const navigate = useNavigate();

  return (
    <main className="p-5 w-full mt-5">
      <div className="flex gap-2 flex-col">
        <h2 className="text-5xl font-bold font-sans-accent">
          Inventario de equipos registrados
        </h2>
        <p className="p-2 text-xl">
          Aquí puede ver las características de los equipos en el inventario.
          Para ver las unidades disponibles, seleccione un equipo.
        </p>
      </div>
      <div className="my-5">
        <Button onClick={() => navigate("/dashboard/form")}>
          <div className="flex gap-2 items-center">
            <PlusIcon className="text-sm" />
            <div className="text-sm">Crear equipo</div>
          </div>
        </Button>
      </div>
      <InventoryTable />
    </main>
  );
}
