import DashboardPage from "@/features/common/components/dasboard-page";
import OrganizationTable from "@/features/inventory/organizations/components/table";

export default function OrganizationsPage() {
  return (
    <DashboardPage
      title="Organizaciones"
      description="Las organizaciones con las que trabaja Formotex. Registrarlas aquí permite asignarles equipamiento que luego puede ser entregado a las organizaciones correspondientes o retirarlas para su mantenimiento."
    >
      <OrganizationTable />
    </DashboardPage>
  );
}
