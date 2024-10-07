import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import useAuth from "@/features/auth/hooks/use-auth";
import { ApiError } from "@/features/common/api";
import { CenteredSpinner } from "@/features/common/components/spinner";
import UserForm from "@/features/dashboard/components/user-form";
import { passwordSchema } from "@/features/dashboard/schema/user";
import { updateUserProfile } from "@/features/dashboard/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const editProfileSchema = z
  .object({
    username: z.string().min(1, {
      message: "El nombre de usuario es requerido",
    }),
    email: z.string().min(1, {
      message: "El correo electrónico es requerido",
    }),
    password: passwordSchema.or(z.literal("")).optional(),
    repeatPassword: passwordSchema.or(z.literal("")).optional(),
  })
  .refine((data) => data.password == data.repeatPassword, {
    message: "Las contraseñas deben coincidir",
  });

export default function UserProfileButton() {
  const { user, refetch } = useAuth();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    defaultValues: async () => ({
      ...user!,
      password: "",
      repeatPassword: "",
    }),
    resolver: zodResolver(editProfileSchema),
  });

  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    try {
      await updateUserProfile({
        ...data,
        password: data.password == "" ? undefined : data.password,
      });
      refetch();
      toast.success("Perfil actualizado");
      setOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.response?.status == 409) {
          toast.error("Nombre de usuario o correo electrónico en uso");
          return;
        }
      }

      toast.error("No se pudo actualizar tu perfil");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex gap-2 items-center py-5 p-2">
          <Avatar>
            <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{user?.username}</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        {form.formState.isLoading ? (
          <CenteredSpinner />
        ) : (
          <>
            <DialogTitle>Edita tu perfil</DialogTitle>
            <Form {...form}>
              <UserForm
                onSubmit={handleSubmit}
                showPasswordInput={true}
                footer={<Button>Guardar</Button>}
              />
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
