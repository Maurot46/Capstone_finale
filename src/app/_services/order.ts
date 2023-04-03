import { OrderItem } from "./order-item";

export interface Order {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  restaurateur: {
    id: number;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  totalPrice: number;
  creationDateTime: string;
  status: string;
}
