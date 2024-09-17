import { api } from "@/features/common/api";
import { Movement } from "../../interface/movement";

export async function getAllActivities() {
    try {
        const response = await api.get<Movement[]>('/movements/');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar actividades: ", err);
        throw err;
    }
}