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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleName, ROLES } from "@/features/auth/const/roles";
import { User } from "@/features/auth/interfaces/user";
import { CenteredSpinner } from "@/features/common/components/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { getUser, getUsers, updateUser } from "../services/users";

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

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <p>Ha ocurrido un error: {error.message}</p>;
  }

  return (
    <div className="overflow-x-auto w-full p-4">
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
                    <EditUserButton userId={user.userId} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

export function EditUserButton(props: { userId: number }) {
  const [params, setParams] = useSearchParams();

  const handleClick = () => {
    const newParams = new URLSearchParams(params);
    newParams.set("userId", props.userId.toString());
    setParams(newParams);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="outline" onClick={handleClick}>
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Cambia los roles asignados a un usuario</DialogTitle>
          <DialogHeader>
            <Alert variant={"destructive"}>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <AlertTitle>
                  Verifica el usuario al que estás asignando el rol.
                </AlertTitle>
                <DialogDescription>
                  Esta acción se puede revertir, pero el ususario podría
                  adquirir privilegios que no debería.
                </DialogDescription>
              </AlertDescription>
            </Alert>
          </DialogHeader>
          <EditUserForm onSubmit={() => {}} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function EditUserForm(props: { onSubmit: () => void }) {
  const [params] = useSearchParams();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", params.get("userId")],
    queryFn: () => getUser({ userId: parseInt(params.get("userId") ?? "") }),
  });

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <p>No se puedo recuperar el usuario</p>;
  }

  return user && <UserForm defaultValues={user} onSubmit={props.onSubmit} />;
}

const formSchema = z.object({
  userId: z.number(),
  roles: z.object({
    employee: z.boolean().default(false).optional(),
    admin: z.boolean().default(false).optional(),
  }),
});

export function UserForm(props: { defaultValues: User; onSubmit: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: props.defaultValues.userId,
      roles: {
        employee: !!props.defaultValues.roles.find(
          (r) => r.name == ROLES.EMPLOYEE
        ),
        admin: !!props.defaultValues.roles.find((r) => r.name == ROLES.ADMIN),
      },
    },
  });
  const client = useQueryClient();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateUser({
        userId: data.userId,
        roles: Object.keys(data.roles).filter(
          (r) => data.roles[r as keyof typeof data.roles]
        ) as RoleName[],
      });

      client.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Usuario actualizado correctamente");
    } catch (err) {
      toast.error("Ha ocurrido un error: " + err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
