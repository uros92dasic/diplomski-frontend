// models/orderItem.ts
import { Product } from "./product";

export interface OrderItem {
    id: number;
    productId: number;
    product: Product;
    quantity: number;
}
