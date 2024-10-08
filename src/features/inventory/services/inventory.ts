import { api } from "@/features/common/api";
import { Equipment } from "../interface/equipment";
import { EquipmentUnit } from "../interface/equipment-unit";
import { Organization } from "../interface/organization";

export async function getAllEquipment(params?: URLSearchParams) {
    try {
        const urlParams = new URLSearchParams(params);
        const response = await api.get<{ data: Equipment[], total: number }>(`/equipment?${urlParams.toString()}`);
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

export async function deleteEquipment(params: { equipmentId: number }) {
    try {
        const response = await api.delete(`/equipment/${params.equipmentId}`);
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

export async function getEquipmentUnits(params: URLSearchParams) {
    try {
        const response = await api.get<EquipmentUnit[]>(`/equipment/units/?${params.toString()}`);
        return response.data;
    } catch (err) {
        console.error(`Error al registrar mantenimiento con cuerpo: ${params}`, err);
        throw err;
    }
}

export type RegisterMaintenanceForUnitParams = {
    equipmentUnitId: number,
    startDate: Date,
    endDate: Date
}

export async function registerMaintenanceForUnit(params: RegisterMaintenanceForUnitParams) {
    try {
        const response = await api.post(`/equipment/units/${params.equipmentUnitId}/maintenance`, params);
        return response.data;
    } catch (err) {
        console.error(`Error al registrar mantenimiento con cuerpo: ${params}`, err);
        throw err;
    }
}

export type RegisterDeliveryForUnitParams = {
    equipmentUnitId: string
}

export async function registerDeliveryForUnit(params: RegisterDeliveryForUnitParams) {
    try {
        const response = await api.post(`/equipment/units/${params.equipmentUnitId}/deliver`, params);
        return response.data;
    } catch (err) {
        console.error(`Error al registrar entrega con cuerpo: ${params}`, err);
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