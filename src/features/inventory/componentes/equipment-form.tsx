import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SelectTrigger } from "@radix-ui/react-select";
import {
  usePrefetchQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  ALLOWED_EQUIPMENT_STATES,
  EQUIPMENT_STATES,
  EquipmentState,
} from "../consts/equipment-state";
import { getEquipmentTypes } from "../services/equipment-types";
import {
  createEquipmentWithUnits,
  getEquipment,
  getOrganizations,
  updateEquipmentWithUnits,
} from "../services/inventory";

// TODO: Refactorizar archivo

const formSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(9999),
  make: z.string().min(1).max(255),
  typeId: z.number(),
  units: z
    .object({
      equipmentUnitId: z.number().optional(),
      serialNumber: z
        .number({
          coerce: true,
          message: "Número de serie requerido",
        })
        .int({
          message: "El número de serie debe ser un entero",
        }),
      state: z.enum(ALLOWED_EQUIPMENT_STATES, { message: "Estado incorrecto" }),
      acquiredAt: z.date({ coerce: true }),
      organizationId: z.number({ message: "Organización requerida" }),
      location: z.string().min(1, { message: "Requerido" }),
      deleted: z.optional(z.boolean().default(false)),
    })
    .array(),
});

export default function EquipmentForm() {
  const { equipmentId } = useParams();
  const isEditting = equipmentId !== undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: async (...args) => {
      const values = await zodResolver(formSchema)(...args);
      console.log(values);
      return values;
    },
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: isEditting
      ? () => getEquipment({ equipmentId: parseInt(equipmentId) })
      : {
          name: "",
          description: "",
          make: "",
          units: [],
        },
  });
  const { data: types, isLoading } = useQuery({
    queryKey: ["inventory", "equipment", "types"],
    queryFn: getEquipmentTypes,
  });
  const client = useQueryClient();
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    try {
      if (isEditting) {
        await updateEquipmentWithUnits({
          ...values,
          equipmentId: parseInt(equipmentId ?? "1"),
          units: values.units.map((v) => ({
            ...v,
            deleted: v.deleted ?? false,
          })),
        });
      } else {
        await createEquipmentWithUnits({
          ...values,
          units: values.units.map((v) => ({
            ...v,
            deleted: v.deleted ?? false,
          })),
        });
      }
      await client.invalidateQueries({
        queryKey: ["inventory", "equipment"],
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Ha ocurrido un error" + err);
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del equipo</FormLabel>
              <FormControl>
                <Input placeholder="Notebook Dell" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Características del equipo"
                  onChange={(e) => field.onChange(e)}
                  value={field.value}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-4 w-full md:items-center justify-stretch">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Dell" {...field} />
                </FormControl>
                <FormDescription>La marca del equipo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-1/2 justify-stretch">
                <FormLabel>Tipo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && types
                          ? types.find(
                              (item) => item.equipmentTypeId === field.value
                            )?.name
                          : "Select item"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full">
                    <Command className="w-full min-w-[40vw]">
                      <CommandInput placeholder="Search ..." />
                      <CommandEmpty>No found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {!isLoading &&
                            types &&
                            types.map((item) => (
                              <CommandItem
                                value={item.name}
                                key={item.equipmentTypeId}
                                onSelect={() => {
                                  form.setValue("typeId", item.equipmentTypeId);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2",
                                    item.equipmentTypeId === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {item.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  El tipo del equipo. Elige y busca un tipo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full mt-12">
          <div className="flex gap-2 flex-col">
            <h3 className="text-xl font-bold">Lista de unidades del equipo</h3>
            <p className="p-2">Agrega las unidades</p>
          </div>
          <div className="flex w-full">
            <EquipmentUnitList />
          </div>
        </div>
        <Button type="submit">{isEditting ? "Guardar" : "Enviar"}</Button>
      </form>
    </Form>
  );
}

const DISPLAY_STATES: Record<EquipmentState, string> = {
  [EQUIPMENT_STATES.OK]: "Funcionando",
  [EQUIPMENT_STATES.DELIVERED]: "Entregado",
  [EQUIPMENT_STATES.IN_MAINTENANCE]: "En mantenimiento",
  [EQUIPMENT_STATES.NEEDS_REPAIR]: "Necesita reparación",
};

function EquipmentUnitList() {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const units = useFieldArray<z.infer<typeof formSchema>>({
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

export function EquipmentUnitFormRow({
  form,
  i,
  units,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  i: number;
  units: UseFieldArrayReturn<z.infer<typeof formSchema>>;
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ALLOWED_EQUIPMENT_STATES.map((state) => {
                return (
                  <SelectItem value={state}>{DISPLAY_STATES[state]}</SelectItem>
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
        {!isLoading && organizations && (
          <Select
            value={form.getValues(`units.${i}.organizationId`).toString()}
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

export function AddUnitForm(props: {
  units: UseFieldArrayReturn<z.infer<typeof formSchema>>;
}) {
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
  return (
    <div>
      <Button
        type="button"
        className=""
        variant="secondary"
        onClick={() => {
          props.units.append({
            acquiredAt: new Date(),
            location: "",
            state: "ok",
            serialNumber: 0,
            organizationId: parseInt(organizations?.[0].organizationId ?? "1"),
          });
        }}
      >
        <PlusIcon />
        <span className="sr-only">Agregar unidad</span>
      </Button>
    </div>
  );
}
