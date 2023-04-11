import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any>([]);
  currentCartItems = this.cartItems.asObservable();
  constructor() { }
  updateCartItems(cartItems: any): void {
    this.cartItems.next(cartItems);
  }
}
