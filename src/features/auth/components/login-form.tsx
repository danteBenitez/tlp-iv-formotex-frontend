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
import BrandText from "@/features/inventory/components/brand-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { z } from "zod";
import useAuth from "../hooks/use-auth";

const signInSchema = z.object({
  username: z.string().min(1, {
    message: "El nombre de usuario es requerido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
});

export default function LoginForm() {
  const { signIn } = useAuth();
  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const body = await signIn({
        name: values.username,
        password: values.password,
      });
      return body;
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
      console.error("Error al iniciar sesión.", err);
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
                <span>Inicia sesión en</span>
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
          </CardContent>
          <CardFooter className="flex flex-col w-full items-start gap-2">
            <div className="text-sm">
              ¿Aún no tienes una cuenta?
              <Button variant="link">
                <Link to="/auth/register">Regístrate</Link>
              </Button>
            </div>
            <Button className="w-full">Iniciar sesión</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
