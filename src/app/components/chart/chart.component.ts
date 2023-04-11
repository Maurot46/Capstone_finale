import { Component, Input, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { Observable, map } from 'rxjs';
import { OrderService } from 'src/app/_services/order.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  //@Input() isLoggedIn!: boolean;
  isLoggedIn = false;
  cartItems$: Observable<any[]> | undefined;
  cartItems: any[] = [];
  orderProcessing = false;
  user: any;
  public payPalConfig?: IPayPalConfig;
  showSuccess!: boolean;
  showCancel!: boolean;
  showError!: boolean;

  constructor(private storageService: StorageService, private orderService: OrderService) {
    this.user = JSON.parse(sessionStorage.getItem('auth-user') || '{}');
    this.cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
  }

  ngOnInit(): void {
    this.cartItems$ = this.storageService.getCart();
    this.initConfig();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
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
  private initConfig(): void {
    const cartItemsJSON = sessionStorage.getItem('cart');
    const cartItems: any[] = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
    // Calculate cart total
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'Abnn9CDcHrKlUcdL31gq_4DUSQR435NbP840oOrC6uEUUAqnBmkp_MWa51r7k9VMwp5-CizUsYaoT-Y2',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: cartTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: cartTotal.toFixed(2)
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: cartTotal.toFixed(2),
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

}
