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
import { useFieldArray, useFormContext, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  ALLOWED_EQUIPMENT_STATES,
  EquipmentState,
  STATE_TO_CLASSNAME,
} from "../consts/equipment-state";
import { equipmentWithUnitsSchema } from "../schema/equipment-with-units";
import { getOrganizations } from "../services/inventory";
import { AddUnitForm } from "./add-unit-form";
import DatePicker from "./date-picker";
import EquipmentStateBadge from "./equipment-state-badge";

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
      {units.fields.length !== 0 && <AddUnitForm units={units} />}
      <div className="flex justify-between w-full items-center">
        {units.fields.length !== 0 && (
          <Table>
            <TableHeader>
              <TableCell>
                <span>¿Eliminar?</span>
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
              return <EquipmentUnitFormRow form={form} i={i} />;
            })}
          </Table>
        )}
      </div>
    </div>
  );
}

export function EquipmentUnitFormRow({
  form,
  i,
}: {
  form: UseFormReturn<z.infer<typeof equipmentWithUnitsSchema>>;
  i: number;
}) {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  return (
    <TableRow
      className={cn(
        form.watch(`units.${i}.deleted`) &&
          "bg-red-200 hover:bg-red-300 dark:bg-red-900 hover:dark:bg-red-800"
      )}
    >
      <Input type="hidden" value={`units.${i}.equipmentUnitId`} />
      <TableCell>
        {form.watch(`units.${i}.equipmentUnitId`) && (
          <Checkbox
            checked={form.watch(`units.${i}.deleted`) ?? false}
            onCheckedChange={(checked) => {
              form.setValue(`units.${i}.deleted`, checked as boolean);
            }}
          />
        )}
      </TableCell>
      <TableCell>
        <Input
          disabled={!form}
          type="number"
          placeholder={"0000"}
          {...form?.register(`units.${i}.serialNumber`)}
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
                    <EquipmentStateBadge state={state} />
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
    </TableRow>
  );
}
