import DashboardPage from "@/features/common/components/dasboard-page";
import EquipmentForm from "@/features/inventory/components/equipment-form";

export default function EquipmentFormPage() {
  return (
    <DashboardPage
      title="Formulario de equipos"
      description="Gestiona la información de un equipo y las unidades en el inventario"
    >
      <EquipmentForm />
    </DashboardPage>
  );
}
