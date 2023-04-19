import { Role } from "./role";
import { Permission } from "./permission";

export class RolePermission {
    constructor(
        public id: number = 0,
        public role: Role = new Role(),
        public permission: Permission = new Permission()
    ) { }
}
