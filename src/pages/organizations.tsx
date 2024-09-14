import OrganizationTable from "@/features/inventory/organizations/components/table";

export default function OrganizationsPage() {
  return (
    <main className="p-5 w-full mt-5">
      <div className="flex gap-2 flex-col">
        <h2 className="text-4xl font-bold">Organizaciones</h2>
        <p className="p-2">
          Las organizaciones con las que trabaja Formotex. Registrarlas aquí
          permite asignarles equipamiento que luego puede ser entregado a las
          organizaciones correspondientes o retirarlas para su mantenimiento.
        </p>
      </div>
      <OrganizationTable />
    </main>
  );
}
