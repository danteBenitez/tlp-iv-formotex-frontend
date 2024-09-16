import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/features/common/components/delete-button";
import Spinner from "@/features/common/components/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Search, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { deleteEquipment, getAllEquipment } from "../services/inventory";

export default function InventoryTable() {
  const [params] = useSearchParams();
  const {
    data: equipments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory", "equipment", params.toString()],
    queryFn: () => getAllEquipment(params),
  });
  const client = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="size-42" />
      </div>
    );
  }

  if (error) {
    return <p>Ha ocurrido un error: {error.message}</p>;
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      <EquipmentAdvancedFilter />
      <Table>
        <TableHeader>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Marca</TableCell>
          <TableCell>Tipo</TableCell>
          <TableCell>Acciones</TableCell>
        </TableHeader>
        <TableBody className="divide-y">
          {equipments?.map((equipment) => {
            return (
              <TableRow>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.description}</TableCell>
                <TableCell>{equipment.make?.name}</TableCell>
                <TableCell>{equipment.type?.name ?? ""}</TableCell>
                <TableCell>
                  <DeleteButton
                    id={parseInt(equipment.equipmentId)}
                    mutationKey={[
                      "inventory",
                      "equipment",
                      "delete",
                      equipment.equipmentId,
                    ]}
                    onDelete={async (id) => {
                      await deleteEquipment({ equipmentId: id });
                      await client.invalidateQueries({
                        queryKey: ["inventory", "equipment"],
                      });
                      toast.success("Equipo eliminado correctamente.");
                    }}
                    dialogText={{
                      title: "¿Estás seguro de que desea eliminar el equipo?",
                      description:
                        "Todas las unidades se borrarán automáticamente",
                    }}
                  />
                  <Link to={`/dashboard/form/${equipment.equipmentId}`}>
                    <Button variant="ghost">Editar</Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const filterFormSchema = z.object({
  query: z.string().optional(),
  make: z.string().optional(),
  type: z.string().optional(),
});

export function EquipmentAdvancedFilter() {
  const [params, setParams] = useSearchParams();
  const form = useForm<z.infer<typeof filterFormSchema>>({
    defaultValues: {
      query: params.get("query") ?? "",
      type: params.get("type") ?? "",
      make: params.get("make") ?? "",
    },
    resolver: zodResolver(filterFormSchema),
  });

  const handleSubmit = (values: { query?: string }) => {
    console.log(values);
    const newParams = new URLSearchParams(values);
    for (const [k, v] of Object.entries(values)) {
      if (v === "") {
        newParams.delete(k);
        continue;
      }
      newParams.set(k, v);
    }

    setParams(newParams);
  };

  return (
    <div className="w-full flex items-center mb-5">
      <Form {...form}>
        <form
          className="flex flex-col w-full gap-4"
          onSubmit={form.handleSubmit(handleSubmit, (e) => console.error(e))}
        >
          <div className="flex w-full">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Búsqueda..."
                      {...field}
                      required={false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button>
              <Search />
            </Button>
          </div>
          <Collapsible>
            <CollapsibleTrigger className="flex gap-2">
              <Button variant={"outline"}>
                <Filter />
                <span>Más filtros</span>
              </Button>
              <Button
                variant={"ghost"}
                onClick={() =>
                  form.reset({
                    make: "",
                    query: "",
                    type: "",
                  })
                }
              >
                <Trash />
                <span>Limpiar filtros</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-5">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Marca: </FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa una marca..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Tipo: </FormLabel>
                      <FormControl>
                        <Input placeholder="Tipo de equipamiento" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </form>
      </Form>
    </div>
  );
}
