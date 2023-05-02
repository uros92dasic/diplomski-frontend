import { OrderItem } from "./orderItem";
import { User } from "./user";

export interface Order {
    id: number;
    userId: number;
    user: User;
    total: number;
    orderItems: OrderItem[];
}
