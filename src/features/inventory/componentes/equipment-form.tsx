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
  ControllerRenderProps,
  FieldValues,
  useForm,
  useFormContext,
} from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { equipmentWithUnitsSchema } from "../schema/equipment-with-units";
import { getEquipmentTypes } from "../services/equipment-types";
import {
  createEquipmentWithUnits,
  getEquipment,
  updateEquipmentWithUnits,
} from "../services/inventory";
import { EquipmentUnitList } from "./equipment-with-units";

export default function EquipmentForm() {
  const { equipmentId } = useParams();
  const isEditting = equipmentId !== undefined;

  const form = useForm<z.infer<typeof equipmentWithUnitsSchema>>({
    resolver: zodResolver(equipmentWithUnitsSchema),
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

  async function onSubmit(values: z.infer<typeof equipmentWithUnitsSchema>) {
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
                {!isLoading && types && (
                  <Combobox
                    options={types}
                    field={field}
                    idFieldName="equipmentTypeId"
                    formField="typeId"
                    labelFieldName="name"
                  />
                )}
                <FormDescription>
                  El tipo del equipo. Elige y busca un tipo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="makeId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-1/2 justify-stretch">
                <FormLabel>Marca</FormLabel>
                {!makesLoading && makes && (
                  <Combobox
                    options={makes}
                    field={field}
                    idFieldName="equipmentTypeId"
                    formField="typeId"
                    labelFieldName="name"
                  />
                )}
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

function Combobox<
  TFields extends FieldValues,
  K extends string,
  T extends { [k in K]: string | number }
>({
  field,
  options,
  idFieldName,
  labelFieldName,
  formField,
}: {
  field: ControllerRenderProps<TFields>;
  options: T[];
  idFieldName: K;
  formField: keyof TFields;
  labelFieldName: K;
}) {
  const form = useFormContext();
  return (
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
            {field.value && options
              ? options.find((opt) => opt[idFieldName] === field.value)?.[
                  labelFieldName
                ]
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
              {options &&
                options.map((item) => (
                  <CommandItem
                    value={item[idFieldName].toString()}
                    key={item[idFieldName]}
                    onSelect={() => {
                      form.setValue(formField.toString(), item[idFieldName]);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2",
                        item[idFieldName] === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item[labelFieldName]}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
