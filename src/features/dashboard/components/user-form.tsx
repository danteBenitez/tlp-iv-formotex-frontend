import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/features/auth/interfaces/user";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

export type UserFormType = Omit<User, "userId" | "roles"> & {
  password?: string;
  repeatPassword?: string;
  roles?: {
    admin?: boolean;
    employee?: boolean;
  };
};

type UserFormProps =
  | {
      onSubmit: (data: UserFormType) => void;
      showPasswordInput: true;
      footer: ReactNode;
    }
  | {
      onSubmit: (
        data: Omit<UserFormType, "password" | "repeatPassword">
      ) => void;
      showPasswordInput: false;
      footer: ReactNode;
    };

export default function UserForm(props: UserFormProps) {
  const form = useFormContext<UserFormType>();
  return (
    <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-6">
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
      {props.showPasswordInput && (
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
      )}

      {props.showPasswordInput && (
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
      {props.footer}
    </form>
  );
}
