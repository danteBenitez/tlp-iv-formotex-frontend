import { RoleName } from "../const/roles";

export type User = {
    userId: number;
    email: string;
    roles: {
        roleId: number,
        name: RoleName
    }[],
    username: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}