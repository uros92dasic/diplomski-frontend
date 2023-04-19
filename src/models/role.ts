import { RolePermission } from "./rolePermission";

export class Role {
    constructor(
        public id: number = 0,
        public name: string = "",
        public rolePermissions: RolePermission[] = []
    ) { }
}
