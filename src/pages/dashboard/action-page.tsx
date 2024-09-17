import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHeader } from "@/components/ui/table";
import DashboardPage from "@/features/common/components/dasboard-page";
import { CenteredSpinner } from "@/features/common/components/spinner";
import ActivitiesTable from "@/features/inventory/activities/componentes/table";
import DatePicker from "@/features/inventory/componentes/date-picker";
import EquipmentUnitRow from "@/features/inventory/componentes/equipment-unit-row";
import {
  getEquipmentUnits,
  registerDeliveryForUnit,
  registerMaintenanceForUnit,
} from "@/features/inventory/services/inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useForm, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { z, ZodSchema } from "zod";

export default function ActivityPage() {
  return (
    <DashboardPage
      title="Registro de actividad"
      description="Aquí puede registrar acciones que ocurren con los equipos informáticos. Como actividades de mantenimiento o transporte"
    >
      <div className="mt-3 flex gap-2">
        <RegisterMaintenance />
        <RegisterDelivery />
      </div>
      <ActivitiesTable />
    </DashboardPage>
  );
}

const equipmentUnitIdSchema = z.object({
  equipmentUnitId: z
    .number({
      message: "Es necesario que escoja una unidad",
    })
    .or(z.literal(null)),
});

export function RegisterDelivery() {
  const form = useForm({
    resolver: zodResolver(equipmentUnitIdSchema),
  });
  const client = useQueryClient();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex gap-2 items-center">
            <PlusIcon className="text-sm" />
            <div className="text-sm">Registrar entrega de equipos</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10 min-w-[80%]">
        <Form {...form}>
          <SelectUnit
            onSubmit={async (data) => {
              await registerDeliveryForUnit({
                equipmentUnitId: data.equipmentUnitId.toString(),
              });
              toast.success("Registrada entrega correctamente");
              await client.invalidateQueries({
                queryKey: ["inventory", "activities"],
              });
            }}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const maintenanceFormSchema = z
  .object({
    startDate: z.date({
      coerce: true,
      message: "Fecha inválida",
    }),
    endDate: z.date({
      coerce: true,
      message: "Fecha inválida",
    }),
    maintenanceLocation: z.string().min(1, {
      message: "La locación es requerida",
    }),
  })
  .and(equipmentUnitIdSchema);

export function RegisterMaintenance() {
  const form = useForm<z.infer<typeof maintenanceFormSchema>>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
    resolver: zodResolver(maintenanceFormSchema),
  });
  const client = useQueryClient();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex gap-2 items-center">
            <PlusIcon className="text-sm" />
            <div className="text-sm">Registrar mantenimiento</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10 min-w-[80%]">
        <Form {...form}>
          <DialogTitle className="mb-5 text-xl">
            Registra una actividad de mantenimiento
          </DialogTitle>
          <FormField
            control={form.control}
            name="maintenanceLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación de mantenimiento: </FormLabel>
                <FormControl>
                  <Input placeholder="Empresa de reparaciones" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3">
            <DatePicker
              date={form.watch("startDate")}
              onChange={(d) => d && form.setValue("startDate", d)}
              label="Fecha de inicio de mantenimiento"
            />
            <DatePicker
              date={form.watch("endDate")}
              onChange={(d) => d && form.setValue("endDate", d)}
              label="Fecha de fin de mantenimiento"
              disableFuture={false}
            />
          </div>

          <SelectUnit
            onSubmit={async (data) => {
              if (data.equipmentUnitId) {
                await registerMaintenanceForUnit(data);
                toast.success("Registrado envío a mantenimiento correctamente");
                await client.invalidateQueries({
                  queryKey: ["inventory", "activities"],
                });
              } else {
                toast.error("Por favor, seleccione una unidad");
              }
            }}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function SelectUnit<TSchema extends ZodSchema>(props: {
  onSubmit: (data: TSchema["_output"]) => void;
}) {
  const [params, setParams] = useSearchParams();
  const { data: units, isLoading } = useQuery({
    queryKey: ["inventory", "units", params.toString()],
    queryFn: () => getEquipmentUnits(params),
  });
  const form = useFormContext<z.infer<typeof equipmentUnitIdSchema>>();

  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <>
      <Input
        placeholder="Busca una unidad por número de serie"
        onKeyDownCapture={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key == "Enter") {
            const newParams = new URLSearchParams(params);
            // @ts-expect-error Sabemos que un <input /> tiene un atributo value
            newParams.set("serialNumber", e.target.value);
            setParams(newParams);
          }
        }}
      />
      <Table className="max-h-[50%]">
        <TableHeader>
          <TableCell>
            <span className="sr-only">Seleccionado</span>
          </TableCell>
          <TableCell>Equipamiento</TableCell>
          <TableCell>Número de serie</TableCell>
          <TableCell>Ubicación</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Adquirido en</TableCell>
        </TableHeader>
        {units &&
          units.map((u) => (
            <EquipmentUnitRow
              {...u}
              selected={form.watch("equipmentUnitId") == u.equipmentUnitId}
              onChange={(id) => form.setValue("equipmentUnitId", id)}
            />
          ))}
      </Table>
      <Button
        disabled={!form.watch("equipmentUnitId")}
        className="justify-self-end"
        onClick={form.handleSubmit(props.onSubmit)}
      >
        Enviar
      </Button>
    </>
  );
}
