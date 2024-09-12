import { api } from "@/features/common/api";
import { Equipment } from "../interface/equipment";

export async function getAllEquipment() {
    try {
        const response = await api.get<Equipment[]>('/equipment');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar equipamiento");
    }
}