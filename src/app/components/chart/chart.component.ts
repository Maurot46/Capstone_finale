import { Component, Input } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ExtendedMenuItem } from 'src/app/_services/menu-item3';
import { OrderService } from 'src/app/_services/order.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() isLoggedIn!: boolean;
  cartItems$: Observable<any[]> | undefined;
  cartItems: any[] = [];
  orderProcessing = false;
  user: any;

  constructor(private storageService: StorageService, private orderService: OrderService) {
    this.user = JSON.parse(sessionStorage.getItem('auth-user') || '{}');
    this.cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
  }

  ngOnInit(): void {
    this.cartItems$ = this.storageService.getCart();

  }

  getTotal(cartItems: any[]): number {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  updateCart(item: any) {
    const cart = JSON.parse(sessionStorage.getItem('cart') ?? '[]');
    const index = cart.findIndex((cartItem: any) => cartItem.name === item.name);
    if (index > -1) {
      cart[index].quantity = item.quantity;
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  confirmOrder() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const userId = JSON.parse(sessionStorage.getItem('auth-user') || '{}').id;
    const restaurateurId = cart[0].restaurateurId;

    if (!userId || !restaurateurId) {
      console.log('Missing user ID or restaurateur ID');
      return;
    }

    const orderRequest = {
      userId: JSON.parse(sessionStorage.getItem('auth-user')!).id,
      restaurateurId: cart[0].restaurateurId,
      orderItems: cart.map((cartItem: { id: number, quantity: number }) => ({
        menuItemId: cartItem.id,
        quantity: cartItem.quantity
      }))
    };

    console.log(orderRequest);

    this.orderService.createOrder(orderRequest).subscribe(
      data => {
        console.log(data);
        sessionStorage.removeItem('cart');
        // TODO: navigate to order confirmation page
      },
      error => {
        console.log(error);
        // TODO: display error message
      }
    );
  }


}
