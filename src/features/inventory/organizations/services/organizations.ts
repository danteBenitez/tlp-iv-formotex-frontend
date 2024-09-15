import { api } from "@/features/common/api";
import { Organization } from "../../interface/organization";

export async function getOrganizations() {
    try {
        const response = await api.get<Organization[]>('/organizations');
        return response.data;
    } catch (err) {
        console.error("Error al recuperar organizaciones", err);
        throw err;
    }
}

export async function getOrganization(params: { organizationId?: number }) {
    try {
        if (!params.organizationId) {
            return null;
        }
        const response = await api.get<Organization>(`/organizations/${params.organizationId}`);
        return response.data;
    } catch (err) {
        console.error("Error al recuperar una organización", err);
        throw err;
    }
}

type CreateOrganizationParams = Omit<Organization, "organizationId">;

export async function createOrganization(params: CreateOrganizationParams) {
    try {
        const response = await api.post<Organization>(`/organizations`, params);
        return response.data;
    } catch (err) {
        console.error("Error al crear una organización", err);
        throw err;
    }
}

export async function updateOrganization(params: Organization) {
    try {
        const response = await api.patch<Organization>(`/organizations/${params.organizationId}`, params);
        return response.data;
    } catch (err) {
        console.error("Error al actualizar una organización", err);
        throw err;
    }
}

export async function deleteOrganization(params: { organizationId: number }) {
    try {
        const response = await api.delete<Organization>(`/organizations/${params.organizationId}`);
        return response.data;
    } catch (err) {
        console.error("Error al actualizar una organización", err);
        throw err;
    }
}