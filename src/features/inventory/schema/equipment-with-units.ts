import { z } from "zod";
import { ALLOWED_EQUIPMENT_STATES } from "../consts/equipment-state";

export const equipmentWithUnitsSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(9999),
    makeId: z.number({
        message: "La marca es requerida"
    }).int({
        message: "El ID de marca debe ser un entero"
    }),
    typeId: z.number(),
    units: z
        .object({
            equipmentUnitId: z.number().optional(),
            serialNumber: z
                .number({
                    coerce: true,
                    message: "Número de serie requerido",
                })
                .int({
                    message: "El número de serie debe ser un entero",
                }),
            state: z.enum(ALLOWED_EQUIPMENT_STATES, { message: "Estado incorrecto" }),
            acquiredAt: z.date({ coerce: true }),
            organizationId: z.number({ message: "Organización requerida" }),
            location: z.string().min(1, { message: "Requerido" }),
            deleted: z.optional(z.boolean().default(false)),
        })
        .array(),
});