import { Product } from "./product";

export class OrderItem {
    constructor(
        public id: number = 0,
        public productId: number = 0,
        public product: Product = new Product(),
        public quantity: number = 0
    ) { }
}
