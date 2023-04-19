import { OrderItem } from "./orderItem";
import { User } from "./user";

export class Order {
    constructor(
        public id: number = 0,
        public userId: number = 0,
        public user: User = new User(),
        public total: number = 0,
        public orderItems: OrderItem[] = []
    ) { }
}
