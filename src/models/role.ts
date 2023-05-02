import { RolePermission } from "./rolePermission";

export interface Role {
    id: number;
    name: string;
    rolePermissions: RolePermission[];
}
