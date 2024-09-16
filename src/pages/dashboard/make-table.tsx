import DashboardPage from "@/features/common/components/dasboard-page";
import MakeTable from "@/features/inventory/makes/components/table";

export default function MakeTablePage() {
  return (
    <DashboardPage
      title="Marcas"
      description="Aquí puede gestionar las marcas que Formotex reconoce"
    >
      <MakeTable />
      <MakeTable />
    </DashboardPage>
  );
}
