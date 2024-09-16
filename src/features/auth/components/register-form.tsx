import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/features/common/components/form/input";
import BrandText from "@/features/inventory/componentes/brand-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ROLES } from "../const/roles";
import useAuth from "../hooks/use-auth";

const passwordSchema = z
  .string()
  .refine((password) => /[A-Z]/.test(password), {
    message: "La contraseña debe tener al menos una mayúscula",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "La contraseña debe tener al menos una minúscula",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "La contraseña debe tener al menos un número",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "La contraseña debe tener al menos un caracter especial",
  });

const signUpSchema = z
  .object({
    username: z.string().min(1, {
      message: "El nombre de usuario es requerido",
    }),
    email: z
      .string()
      .min(1, {
        message: "El correo electrónico es requerido",
      })
      .email({
        message: "El correo electrónico es inválido",
      }),
    password: passwordSchema,
    repeatPassword: passwordSchema,
  })
  .refine(
    (data) => {
      return data.password == data.repeatPassword;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["password"],
    }
  );

export default function RegisterForm() {
  const { signUp } = useAuth();
  const form = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      await signUp({ ...values, roles: [ROLES.EMPLOYEE] });
      toast.success("Registrado correctamente");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 400) {
          toast.error(err.response?.data.message);
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 text-xl"
        onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
      >
        <Card className="w-full md:min-w-[450px] shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              <h2 className="text-xl px-5 text-center my-4">
                <span>Regístrate en</span>
                <div className="flex justify-center">
                  <BrandText />
                </div>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
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
          </CardContent>
          <CardFooter>
            <Button className="w-full">Registrarse</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
