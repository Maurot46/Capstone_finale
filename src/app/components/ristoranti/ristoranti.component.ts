import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
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

  eventBusSub?: Subscription;
  menuItems!: any[];
  menu: any = {};
  selectedMenu!: Menu;
  menus: Menu[] = [];

  constructor(
    private restaurateurService: RestaurateurService,
    private menuService: MenuService
  ) {}

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
    this.loadMenuItems(menu);
  }

  loadMenuItems(menu: Menu) {
    this.selectedMenu = menu;
    this.menuService.getMenuItem(menu.id).subscribe(
      (items: MenuItem[]) => {
        this.menuItems = items;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  addToCart(item: any, quantity: number) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += quantity; // increase quantity of existing item
    } else {
      cart.push({...item, quantity}); // add selected item to cart with given quantity
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
  }


}
