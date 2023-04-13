import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { CartService } from '../_services/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() isLoggedIn!: boolean;
  @Input() username!: string;
  cartItems: any;
  cartLength = 0;
  showGestisciLink = false;


  constructor
    (
      private storageService: StorageService,
      private authService: AuthService,
      private cartService: CartService
    ) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.cartItems = cart;
    this.cartLength = cart.length;

    this.cartService.currentCartItems.subscribe(cartItems => {
      this.cartLength = cartItems.length;
    });
  }

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.username = user.username;
    if (user.roles.includes('ROLE_RISTORATORE')) {
      this.showGestisciLink = true;
    }
  }

  async logout(): Promise<void> {
    this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
