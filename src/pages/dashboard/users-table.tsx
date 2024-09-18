import DashboardPage from "@/features/common/components/dasboard-page";
import UsersTable from "@/features/dashboard/components/users-table";

export default function UsersTablePage() {
  return (
    <DashboardPage
      title="Usuarios de la aplicación"
      description="Gestiona la creación y asignación de roles de la aplicación de Formotex"
    >
      <UsersTable />
    </DashboardPage>
  );
}
