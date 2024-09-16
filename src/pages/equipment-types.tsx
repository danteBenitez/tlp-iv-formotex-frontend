import DashboardPage from "@/features/common/components/dasboard-page";
import EquipmentTypesTable from "@/features/inventory/equipment-types/components/table";

export default function EquipmentTypesPage() {
  return (
    <DashboardPage
      title="Tipos de equipo"
      description="Las distintas categorías de equipos informáticos reconocidas por Formotex"
    >
      <EquipmentTypesTable />
    </DashboardPage>
  );
}
