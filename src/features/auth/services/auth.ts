import { api } from "@/features/common/api";
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