import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any>([]);
  currentCartItems = this.cartItems.asObservable();
  constructor() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.cartItems.next(cart);
  }
  updateCartItems(cartItems: any): void {
    this.cartItems.next(cartItems);
  }
}
