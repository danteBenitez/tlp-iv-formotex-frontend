import { api } from "@/features/common/api";
import { Make } from "../interfaces/make";

export async function getMakes() {
    try {
        const response = await api.get<Make[]>('/makes');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar marcas", err);
        throw err;
    }
}

export async function getMake(params: Pick<Make, "makeId">) {
    try {
        if (!params.makeId) {
            return null;
        }
        const response = await api.get<Make>(`/makes/${params.makeId}`);
        return response.data;
    } catch (err) {
        console.error("Error al recuperar marca", err);
        throw err;
    }
}

export type CreateMake = Omit<Make, "makeId">;

export async function createMake(params: CreateMake) {
    try {
        const response = await api.post<null>('/makes', params);
        return response.data;
    } catch (err) {
        console.error("Error al crear tipos marca", err);
        throw err;
    }
}

export async function updateMake(params: Make) {
    try {
        const response = await api.patch<null>(`/makes/${params.makeId}`, params);
        return response.data;
    } catch (err) {
        console.error("Error al actualizar marca", err);
        throw err;
    }
}

export async function deleteMake(params: { makeId: number }) {
    try {
        const response = await api.delete<null>(`/makes/${params.makeId}`);
        return response.data;
    } catch (err) {
        console.error("Error al eliminar marca", err);
        throw err;
    }
}