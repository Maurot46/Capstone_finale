import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Observable, map } from 'rxjs';
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
  user: any; // this shou

  constructor(private storageService: StorageService, private http: HttpClient) {}

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

}
