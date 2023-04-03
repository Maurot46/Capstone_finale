export interface OrderItem {
  id: number;
  menuItem: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}
