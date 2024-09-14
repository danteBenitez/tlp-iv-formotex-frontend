import { api } from "@/features/common/api";
import { RoleName } from "../const/roles";
import { User } from "../interfaces/user";

export type SignInParams = {
    name: string;
    password: string;
}
export type SignInResponse = {
    token: string;
    user: User;
}

export async function signIn(params: SignInParams) {
    const response = await api.post<SignInResponse>("/auth/login", {
        username: params.name,
        password: params.password
    });

    return response;
}

export type SignUpParams = {
    username: string
    email: string,
    roles: RoleName[],
    password: string
}

export type SignUpResponse = {
    token: string,
    user: User,
    message: string
}

export async function signUp(params: SignUpParams) {
    try {
        const response = await api.post<SignUpResponse>("/auth/register", params);
        return response.data;
    } catch (err) {
        console.error("Error al registrarse " + err);
        throw err;
    }
}