import { Role } from "./role";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}

export const getUserName = (user: User): string => {
    return `${user.firstName} ${user.lastName}`;
};
