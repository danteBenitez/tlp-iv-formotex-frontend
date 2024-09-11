import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, TextInput } from "flowbite-react";
import { Form, useForm } from "react-hook-form";
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
      console.error("Error al iniciar sesión.", err);
    }
  };

  return (
    <div className="flex gap-2 flex-col border border-1 rounded-md p-8 w-full mx-2 md:w-[500px]">
      <h2 className="text-xl px-5 text-center my-4">
        <span>Inicia sesión en</span>
        <div className="d-block text-5xl font-bold">Formotex</div>
      </h2>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 text-xl"
          onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Tu nombre de usuario" />
            </div>
            <TextInput
              id="email1"
              type="text"
              placeholder="my-username"
              {...form.register("username")}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1" value="Tu contraseña" />
            </div>
            <TextInput
              id="password1"
              type="password"
              required
              placeholder="******"
              {...form.register("password")}
            />
          </div>
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Iniciar sesión
          </Button>
        </form>
      </Form>
    </div>
  );
}
