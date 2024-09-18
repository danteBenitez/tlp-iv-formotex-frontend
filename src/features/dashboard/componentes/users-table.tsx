import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleName, ROLES } from "@/features/auth/const/roles";
import { CenteredSpinner } from "@/features/common/components/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Info, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { creationForm, updateForm } from "../schema/user";
import { createUser, getUser, getUsers, updateUser } from "../services/users";

const ROLES_TO_DISPLAY: Record<RoleName, string> = {
  [ROLES.EMPLOYEE]: "Empleado",
  [ROLES.ADMIN]: "Administrador",
};

export default function UsersTable() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const [open, setOpen] = useState(false);
  const [params, setParams] = useSearchParams();

  const handleClick = (id: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set("userId", id);
    setParams(newParams);
    setOpen(true);
  };

  const isEditting = params.has("userId");

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <p>Ha ocurrido un error: {error.message}</p>;
  }

  return (
    <div className="overflow-x-auto w-full p-4">
      <Button
        className="flex items-center"
        onClick={() => {
          const newParams = new URLSearchParams(params);
          newParams.delete("userId");
          setParams(newParams);
          setOpen(true);
        }}
      >
        <PlusIcon className="size-4" />
        Crear usuario
      </Button>
      <Table>
        <TableHeader>
          <TableCell>
            <span className="sr-only">Avatar</span>
          </TableCell>
          <TableCell>Nombre de usuario</TableCell>
          <TableCell>Correo electrónico</TableCell>
          <TableCell>Roles</TableCell>
          <TableCell>
            <span className="sr-only">Acciones</span>
          </TableCell>
        </TableHeader>
        <TableBody className="divide-y">
          {users &&
            users.map((user) => {
              return (
                <TableRow>
                  <TableCell>
                    <Avatar>
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-7">
                      {user.roles.map((role) => (
                        <Badge>{ROLES_TO_DISPLAY[role.name]}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleClick(user.userId.toString())}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger></DialogTrigger>
          <DialogContent className="min-w-[40rem] m-4 overflow-y-scroll">
            <DialogTitle>{isEditting ? "Editar" : "Crear"}</DialogTitle>
            <DialogHeader></DialogHeader>
            <UserForm onSubmit={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function AssignRoleWarning() {
  return (
    <Alert variant={"destructive"}>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <AlertTitle className="text-xl">
          Verifica el usuario al que estás asignando el rol.
        </AlertTitle>
        <DialogDescription>
          Esta acción se puede revertir, pero el ususario podría adquirir
          privilegios que no debería.
        </DialogDescription>
      </AlertDescription>
    </Alert>
  );
}

function UserForm(props: { onSubmit: () => void }) {
  const [params] = useSearchParams();
  const isEditting = params.has("userId");

  const getDefaultValues = async () => {
    const user = await getUser({
      userId: parseInt(params.get("userId") ?? "1"),
    });
    return {
      ...user,
      password: "",
      repeatPassword: "",
      roles: {
        employee: !!user.roles.find((r) => r.name == ROLES.EMPLOYEE),
        admin: !!user.roles.find((r) => r.name == ROLES.ADMIN),
      },
    };
  };
  const form = useForm<z.infer<typeof creationForm>>({
    resolver: zodResolver(isEditting ? updateForm : creationForm),
    defaultValues: isEditting
      ? getDefaultValues
      : {
          userId: undefined,
          username: "",
          email: "",
          password: "",
          repeatPassword: "",
          roles: {
            employee: false,
            admin: false,
          },
        },
  });
  const client = useQueryClient();

  async function onSubmit(data: z.infer<typeof creationForm>) {
    try {
      const roles = Object.keys(data.roles).filter(
        (r) => data.roles[r as keyof typeof data.roles]
      ) as RoleName[];
      if (data.userId) {
        await updateUser({
          ...data,
          password: data.password == "" ? undefined : data.password,
          userId: data.userId,
          roles,
        });
        toast.success("Usuario actualizado correctamente");
      } else {
        await createUser({
          ...data,
          roles,
        });
        toast.success("Usuario creado correctamente");
      }

      await client.invalidateQueries({
        queryKey: ["users"],
      });
      props.onSubmit();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 409) {
          toast.error("Nombre de usuario o correo electrónico en uso");
          return;
        }
      }
      toast.error("Ha ocurrido un error: " + err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditting && (
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetir contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="roles.admin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Administrador</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles.employee"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Empleado</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <AssignRoleWarning />
        <Button type="submit">{isEditting ? "Guardar" : "Crear"}</Button>
      </form>
    </Form>
  );
}
