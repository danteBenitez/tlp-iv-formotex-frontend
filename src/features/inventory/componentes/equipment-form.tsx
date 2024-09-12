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
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

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
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { ALLOWED_EQUIPMENT_STATES } from "../consts/equipment-state";
import { getEquipmentTypes } from "../services/inventory";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(9999),
  make: z.string().min(1).max(255),
  typeId: z.string(),
  units: z.array(
    z.object({
      equipmentUnitId: z.number(),
      serialNumber: z.number(),
      state: z.enum(ALLOWED_EQUIPMENT_STATES, { message: "Estado incorrecto" }),
      acquiredAt: z.date({ coerce: true }),
      organizationId: z.number({ message: "Organización requerida" }),
      location: z.string({ message: "Requerido" }),
    })
  ),
});

export default function EquipmentForm() {
  const { equipmentId } = useParams();
  const isEditting = equipmentId !== undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
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
                              (item) =>
                                item.equipmentTypeId.toString() === field.value
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
                                  form.setValue(
                                    "typeId",
                                    item.equipmentTypeId.toString()
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2",
                                    item.equipmentTypeId.toString() ===
                                      field.value
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
        <div className="flex w-full">
          <EquipmentUnitList />
        </div>
        <Button type="submit">{isEditting ? "Guardar" : "Enviar"}</Button>
      </form>
    </Form>
  );
}

function EquipmentUnitList() {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const units = useFieldArray<z.infer<typeof formSchema>>({
    name: "units",
    control: form.control,
  });

  if (units.fields.length === 0) {
    return <p>No hay unidades para este equipo.</p>;
  }

  return units.fields.map((field, i) => {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="number"
            placeholder={"0000"}
            {...form.register(`units.${i}.serialNumber`)}
          />
          {field.serialNumber}
        </TableCell>
        <TableCell>
          <Input
            type="number"
            placeholder={"0000"}
            {...form.register(`units.${i}.location`)}
          />
          {field.location}
        </TableCell>
        <TableCell>
          <Input
            type="text"
            placeholder={"0000"}
            {...form.register(`units.${i}.state`)}
          />
          {field.state}
        </TableCell>
        <TableCell>{unit.organizationId}</TableCell>
      </TableRow>
    );
  });
}
