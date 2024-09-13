import { api } from "@/features/common/api";
import { Equipment } from "../interface/equipment";
import { EquipmentUnit } from "../interface/equipment-unit";
import { Organization } from "../interface/organization";

export async function getAllEquipment() {
    try {
        const response = await api.get<Equipment[]>('/equipment');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar equipamiento", err);
    }
}

type GetEquipmentResponse = Equipment & {
    units: EquipmentUnit[]
};

export async function getEquipment(params: { equipmentId: number }): Promise<GetEquipmentResponse> {
    try {
        const equipment = (await api.get<GetEquipmentResponse>(`/equipment/${params.equipmentId}`)).data;

        return {
            ...equipment,
            units: equipment.equipmentUnits
        };
    } catch (err) {
        console.error(`Error al recuperar equipamiento con ID: ${params.equipmentId}`, err);
        throw err;
    }
}

export type CreateEquipmentWithUnits = Omit<Equipment, "equipmentUnits" | "equipmentId"> & {
    units: Omit<EquipmentUnit, "equipmentUnitId" | "equipmentId">[]
}

export async function createEquipmentWithUnits(params: CreateEquipmentWithUnits) {
    try {
        const response = await api.post<GetEquipmentResponse>(`/equipment/`, params);
        return response.data;
    } catch (err) {
        console.error(`Error al crear equipamiento con cuerpo: ${params}`, err);
        throw err;
    }
}

export async function updateEquipmentWithUnits(params: { equipmentId: number } & CreateEquipmentWithUnits) {
    try {
        const response = await api.patch<GetEquipmentResponse>(`/equipment/${params.equipmentId}`, params);
        return response.data;
    } catch (err) {
        console.error(`Error al actualizar equipamiento con cuerpo: ${params}`, err);
        throw err;
    }
}

export async function getOrganizations(): Promise<Organization[]> {
    try {
        const response = await api.get<Organization[]>('/organizations');
        return response.data;
    } catch (err) {
        console.error(`Error al recuperar organizaciones`, err);
        throw err;
    }
}