import { z } from "zod";

export const passwordSchema = z
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

export const createUserSchema = z.object({
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
});

export const rolesSchema = z.object({
    userId: z.number().optional(),
    roles: z.object({
        employee: z.boolean().default(false).optional(),
        admin: z.boolean().default(false).optional(),
    }),
});


export const creationForm = createUserSchema.and(rolesSchema).refine(
    (data) => {
        return data.password == data.repeatPassword;
    },
    {
        message: "Las contraseñas deben coincidir",
        path: ["password"],
    }
);

export const updateForm = createUserSchema
    .omit({
        repeatPassword: true,
        password: true,
    })
    .and(rolesSchema);