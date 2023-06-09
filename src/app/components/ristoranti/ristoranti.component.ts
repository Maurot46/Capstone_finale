import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/_services/cart.service';
import { Menu } from 'src/app/_services/menu';
import { MenuItem } from 'src/app/_services/menu-item';
import { MenuService } from 'src/app/_services/menu.service';
import { Restaurateur } from 'src/app/_services/restaurateur';
import { RestaurateurService } from 'src/app/_services/restaurateur.service';

@Component({
  selector: 'app-ristoranti',
  templateUrl: './ristoranti.component.html',
  styleUrls: ['./ristoranti.component.scss']
})
export class RistorantiComponent {
  restaurateurs!: Restaurateur[];
  //emetto il cambiamento del numero del carrello
  @Output() cartUpdated = new EventEmitter<number>();

  eventBusSub?: Subscription;
  menuItems!: any[];
  menu: any = {};
  selectedMenu!: Menu;
  menus: Menu[] = [];

  constructor(
    private restaurateurService: RestaurateurService,
    private menuService: MenuService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.restaurateurService.getAllRestaurateurs().subscribe(
      restaurateurs => {
        this.restaurateurs = restaurateurs;
      },
      error => {
        console.log(error);
      }
    );
  }

  menuItemSelected(menu: Menu) {
    this.selectedMenu = menu;
    this.selectedMenu.restaurateur.id = menu.restaurateur.id;
    console.log("Restaurateur ID: ", this.selectedMenu.restaurateur.id); // add this line
    this.loadMenuItems(menu);
  }

  loadMenuItems(menu: Menu) {
    this.selectedMenu = menu;
    this.menuItems = []; // reset

    this.menuService.getMenuItem(menu.id).subscribe(
      (items: MenuItem[]) => {
        this.menuItems = items;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }



  addToCart(item: any, quantity: number, restaurateurId: number) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((cartItem: any) => cartItem.id === item.id && cartItem.restaurateurId === restaurateurId);
    console.log(restaurateurId);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity; // increase quantity of existing item
    } else {
      cart.push({ ...item, quantity, restaurateurId }); // add selected item to cart with given quantity and restaurateur id
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    //Numero del carrello update
    this.cartService.updateCartItems(cart);
    this.cartUpdated.emit(cart.length);
  }

}
