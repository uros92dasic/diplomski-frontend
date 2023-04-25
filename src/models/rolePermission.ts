// models/rolePermission.ts
import { Role } from "./role";
import { Permission } from "./permission";

export interface RolePermission {
    id: number;
    role: Role;
    permission: Permission;
}
