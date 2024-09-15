import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";
import { CheckCircle, PackageCheck, ServerCrash, Wrench } from "lucide-react";
import { ReactNode } from "react";
import {
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
  ALLOWED_EQUIPMENT_STATES,
  EQUIPMENT_STATES,
  EquipmentState,
} from "../consts/equipment-state";
import { equipmentWithUnitsSchema } from "../schema/equipment-with-units";
import { getOrganizations } from "../services/inventory";
import { AddUnitForm } from "./add-unit-form";
import DatePicker from "./date-picker";

const DISPLAY_STATES: Record<EquipmentState, string> = {
  [EQUIPMENT_STATES.OK]: "Funcionando",
  [EQUIPMENT_STATES.DELIVERED]: "Entregado",
  [EQUIPMENT_STATES.IN_MAINTENANCE]: "En mantenimiento",
  [EQUIPMENT_STATES.NEEDS_REPAIR]: "Necesita reparación",
};

export function EquipmentUnitList() {
  const form = useFormContext<z.infer<typeof equipmentWithUnitsSchema>>();
  const units = useFieldArray<z.infer<typeof equipmentWithUnitsSchema>>({
    name: "units",
    control: form.control,
  });
  usePrefetchQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  return (
    <div className="flex flex-col w-full mt-4">
      {units.fields.length === 0 && (
        <div className="flex gap-2 w-full justify-between">
          <p>No hay unidades para este equipo.</p>
          <AddUnitForm units={units} />
        </div>
      )}
      <div className="flex justify-between w-full items-center">
        {units.fields.length !== 0 && (
          <Table>
            <TableHeader>
              <TableCell>
                <span className="sr-only">Eliminar</span>
              </TableCell>
              <TableCell>Número de serie</TableCell>
              <TableCell>Locación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de adquisición</TableCell>
              <TableCell>Organización</TableCell>
              <TableCell>
                <span className="sr-only">Acciones</span>
              </TableCell>
            </TableHeader>
            {units.fields.map((_, i) => {
              return <EquipmentUnitFormRow form={form} i={i} units={units} />;
            })}
          </Table>
        )}
      </div>
    </div>
  );
}

const STATE_TO_CLASSNAME: Record<EquipmentState, string> = {
  [EQUIPMENT_STATES.DELIVERED]: "border-blue-400",
  [EQUIPMENT_STATES.IN_MAINTENANCE]: "border-yellow-400",
  [EQUIPMENT_STATES.NEEDS_REPAIR]: "border-red-500",
  [EQUIPMENT_STATES.OK]: "border-green-400",
};
const STATE_TO_ICON: Record<EquipmentState, ReactNode> = {
  [EQUIPMENT_STATES.DELIVERED]: <PackageCheck className="size-4" />,
  [EQUIPMENT_STATES.IN_MAINTENANCE]: <Wrench className="size-4" />,
  [EQUIPMENT_STATES.NEEDS_REPAIR]: <ServerCrash className="size-4" />,
  [EQUIPMENT_STATES.OK]: <CheckCircle className="size-4" />,
};

export function EquipmentUnitFormRow({
  form,
  i,
  units,
}: {
  form: UseFormReturn<z.infer<typeof equipmentWithUnitsSchema>>;
  i: number;
  units: UseFieldArrayReturn<z.infer<typeof equipmentWithUnitsSchema>>;
}) {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  return (
    <TableRow
      className={cn(
        form.watch(`units.${i}.deleted`) && "bg-red-200 hover:bg-red-300"
      )}
    >
      <Input type="hidden" value={`units.${i}.equipmentUnitId`} />
      <TableCell>
        <Checkbox
          checked={form.watch(`units.${i}.deleted`) ?? false}
          onCheckedChange={(checked) => {
            form.setValue(`units.${i}.deleted`, checked as boolean);
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder={"0000"}
          {...form.register(`units.${i}.serialNumber`)}
        />
        <FormMessage>
          {form.formState.errors.units?.[i]?.serialNumber?.message ?? ""}
        </FormMessage>
      </TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder={"Depósito 5"}
          {...form.register(`units.${i}.location`)}
        />
        <FormMessage>
          {form.formState.errors.units?.[i]?.location?.message ?? ""}
        </FormMessage>
      </TableCell>
      <TableCell>
        <Select
          value={form.watch(`units.${i}.state`)}
          onValueChange={(value) =>
            form.setValue(`units.${i}.state`, value as EquipmentState)
          }
        >
          <SelectTrigger
            className={cn(
              "w-[180px] border-2",
              STATE_TO_CLASSNAME[form.watch(`units.${i}.state`)]
            )}
          >
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ALLOWED_EQUIPMENT_STATES.map((state) => {
                return (
                  <SelectItem value={state}>
                    <div className="flex gap-2 items-center">
                      <div>{STATE_TO_ICON[state as EquipmentState]}</div>
                      <p className="text-nowrap">{DISPLAY_STATES[state]}</p>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage>
          {form.formState.errors.units?.[i]?.state?.message ?? ""}
        </FormMessage>
      </TableCell>
      <TableCell>
        <DatePicker
          date={form.watch(`units.${i}.acquiredAt`)}
          onChange={(d) => form.setValue(`units.${i}.acquiredAt`, d)}
        />
      </TableCell>
      <TableCell>
        {!isLoading && organizations && (
          <Select
            value={form.watch(`units.${i}.organizationId`).toString()}
            onValueChange={(v) => {
              console.log({ v, i });
              form.setValue(`units.${i}.organizationId`, parseInt(v));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccione una organización" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {organizations.map((org) => {
                  return (
                    <SelectItem value={org.organizationId.toString()}>
                      {org.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <FormMessage>
          {form.formState.errors.units?.[i]?.state?.message ?? ""}
        </FormMessage>
      </TableCell>
      <TableCell>
        {i == units.fields.length - 1 && <AddUnitForm units={units} />}
      </TableCell>
    </TableRow>
  );
}
