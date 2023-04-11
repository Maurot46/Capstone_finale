import { Component, OnInit} from '@angular/core';
import { MenuService } from 'src/app/_services/menu.service';
import { Menu } from 'src/app/_services/menu';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem2 } from 'src/app/_services/menu-item2';
import { OrderService } from 'src/app/_services/order.service';
import { Order } from 'src/app/_services/order';


@Component({
  selector: 'app-ristoratore-board',
  templateUrl: './ristoratore-board.component.html',
  styleUrls: ['./ristoratore-board.component.scss']
})
export class RistoratoreBoardComponent implements OnInit{
  menu: any = {};
  addMenuError = '';
  addMenuSuccess = '';
  addMenuItemSuccess= '';
  addMenuItemError = '';
  menus: Menu[] = [];
  menuItemForm: FormGroup;
  menuItems!: any[];
  selectedMenu!: Menu;
  ingredientsString: string = '';
  orders!: any[];
  p: number = 1;
  constructor(
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private orderService: OrderService
  ) {
    this.menuItemForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      ingredients: this.formBuilder.array([
        this.formBuilder.control('', Validators.required)
      ])
    });
  }

  ngOnInit(): void {
    const userId = JSON.parse(sessionStorage.getItem('auth-user')!).id;
    this.getMenusByRestaurateurId(userId);
    this.getOrdersByRestaurateurId(userId);
  }

  getMenusByRestaurateurId(id: number) {
    this.menuService.getMenuByRestaurateurId(id).subscribe(
      (menus: Menu[]) => {
        this.menus = menus;
      },
      (error) => console.log(error)
    );
  }
  getOrdersByRestaurateurId(id: number) {
    this.orderService.getAllOrdersByRestaurateurId(id).subscribe(
      (orders: Order[]) => {
        this.orders = orders;
      },
      (error) => console.log(error)
    );
  }

  addMenu(): void {
    const loggedInUser = JSON.parse(sessionStorage.getItem('auth-user')!);
    if (!loggedInUser || !loggedInUser.id) {
      console.error('Error: Invalid user');
      this.addMenuSuccess = '';
      this.addMenuError = 'Error adding menu.';
      return;
    }
    const payload = {
      name: this.menu.name,
      tipologia: this.menu.tipologia,
      restaurateur: {
        id: loggedInUser.id
      }
    };
    this.menuService.addMenu(payload).subscribe(
      response => {
        console.log('Restaurateur ID:', loggedInUser.id);
        console.log('Menu added:', response);
        console.log('Payload:', payload);
        this.addMenuSuccess = 'Menu added successfully.';
        this.addMenuError = '';
        this.menu = {}; // clear the form
      },
      error => {
        console.error('Error adding menu:', error);
        this.addMenuSuccess = '';
        this.addMenuError = 'Error adding menu.';
      }
    );
  }

  menuItemSelected(menu: any) {
    this.menu = menu;
    this.loadMenuItems;
  }

  get ingredients() {
    return this.menuItemForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.formBuilder.control('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addMenuItem() {
    const menuId = this.menu.id;
    const payload = {
      name: this.menuItemForm.value.name,
      ingredients: this.menuItemForm.value.ingredients,
      price: this.menuItemForm.value.price
    };
    this.menuService.addMenuItemToMenu(menuId, payload).subscribe(
      response => {
        console.log('Menu item added:', response);
        this.addMenuItemSuccess = 'Menu item added successfully.';
        this.addMenuItemError = '';
        this.menuItemForm.reset({
          name: '',
          price: '',
          ingredients: ['']
        }); // reset the form
      },
      error => {
        console.error('Error adding menu item:', error);
        this.addMenuItemSuccess = '';
        this.addMenuItemError = 'Error adding menu item.';
      }
    );
  }
  deleteMenu(menu: any) {
    if (confirm(`Are you sure you want to delete the menu "${menu.name}"?`)) {
      this.menuService.deleteMenu(menu.id).subscribe(() => {
        // Remove the menu from the local array
        const index = this.menus.indexOf(menu);
        if (index !== -1) {
          this.menus.splice(index, 1);
        }
      }, error => {
        console.error(`Failed to delete the menu "${menu.name}"`, error);
        alert(`Failed to delete the menu "${menu.name}". Please try again later.`);
      });
    }
  }
  loadMenuItems(menu: Menu): void {
    this.menuService.getMenuItem(menu.id).subscribe((data) => {
      this.menuItems = data;
      this.selectedMenu = menu; // set the selected menu for use in the modal title
    });
  }
  saveMenuItem(item: MenuItem2): void {
    this.menuService.updateMenuItem(item).subscribe((updatedItem) => {
      item.editing = false;
    });
  }

  updateIngredients(item: MenuItem2, ingredientsString: string): void {
    item.ingredients = ingredientsString.split(',').map((ingredient) => ingredient.trim());
  }
  editMenuItem(item: MenuItem2): void {
    this.ingredientsString = item.ingredients.join(', ');
    item.editing = true;
  }
}


