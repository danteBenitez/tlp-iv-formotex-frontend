import UsersTable from "@/features/dashboard/componentes/users-table";

export default function UsersTablePage() {
  return (
    <main className="p-5 w-full mt-5">
      <div className="flex gap-2 flex-col">
        <h2 className="text-4xl font-bold">Usuarios de aplicación</h2>
        <p className="p-2">
          Gestiona la creación y asignación de roles de la aplicación de
          Formotex
        </p>
      </div>
      <UsersTable />
    </main>
  );
}
