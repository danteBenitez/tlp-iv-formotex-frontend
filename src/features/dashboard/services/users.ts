import { RoleName } from "@/features/auth/const/roles";
import { User } from "@/features/auth/interfaces/user";
import { SignUpParams } from "@/features/auth/services/auth";
import { api } from "@/features/common/api";

export async function getUsers() {
    try {
        const response = await api.get<{ users: User[] }>(`/users/`);
        return response.data.users;
    } catch (err) {
        console.error(`Error al encontrar usuariso`, err);
        throw err;
    }
}

export async function getUser(params: { userId: number }) {
    try {
        const response = await api.get<{ user: User }>(`/users/${params.userId}`);
        return response.data.user;
    } catch (err) {
        console.error(`Error al encontrar usuario`, err);
        throw err;
    }
}

export async function updateUser(params: { userId: number, roles: RoleName[] }) {
    try {
        const response = await api.patch<{ user: User }>(`/users/${params.userId}`, params);
        return response.data.user;
    } catch (err) {
        console.error(`Error al actualizar usuario`, err);
        throw err;
    }
}

export async function createUser(params: SignUpParams) {
    try {
        const response = await api.post<User>(`/users/`, params);
        return response.data;
    } catch (err) {
        console.error(`Error al crear usuario`, err);
        throw err;
    }
}