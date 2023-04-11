import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() isLoggedIn!: boolean;
  @Input() username!: string;
  cartItems: any;
  cartLength = 0; // add this

  constructor
  (
    private storageService: StorageService,
    private authService: AuthService
    )
    {
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      this.cartItems = cart;
      this.cartLength = cart.length; // add this
    }

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.username = user.username;
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
