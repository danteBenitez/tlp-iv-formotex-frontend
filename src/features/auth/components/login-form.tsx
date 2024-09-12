import Input from "@/features/common/components/form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
    <div className="flex gap-2 flex-col border border-1 rounded-md p-8 w-full mx-2 md:w-[500px]">
      <h2 className="text-xl px-5 text-center my-4">
        <span>Inicia sesión en</span>
        <div className="d-block text-5xl font-bold">Formotex</div>
      </h2>
      <form
        className="flex flex-col gap-4 text-xl"
        onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Tu nombre de usuario" />
          </div>
          <Input
            type="text"
            placeholder="my-username"
            error={form.formState.errors.username?.message}
            {...form.register("username")}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Tu contraseña" />
          </div>
          <Input
            id="password1"
            type="password"
            required
            placeholder="******"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
        </div>
        <Button type="button" onClick={form.handleSubmit(onSubmit)}>
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
