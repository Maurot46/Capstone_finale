import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Menu } from './menu';
import { Observable } from 'rxjs';
import { MenuItem } from './menu-item';
import { MenuItem2 } from './menu-item2';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:8080/api/menus';
  constructor(private http: HttpClient) { }
  //ADD A MENU
  addMenu(payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.post<any>(`${this.apiUrl}/add`, payload, {headers});
  }
  //RETRIEVE ALL MENUS FROM ID
  getMenuByRestaurateurId(id: number): Observable<Menu[]> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.get<Menu[]>(`${this.apiUrl}/restaurateur/${id}`, {headers});
  }
  // ADD A MENU ITEM TO A MENU
  addMenuItemToMenu(menuId: number, menuItem: MenuItem): Observable<MenuItem> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    const url = `${this.apiUrl}/${menuId}/items`;
    return this.http.post<MenuItem>(url, menuItem, { headers });
  }
  deleteMenu(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }
  getMenuItem(id: number): Observable<MenuItem[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.get<MenuItem[]>(`${this.apiUrl}/${id}/menu-items`, { headers })
  }
  updateMenuItem(item: MenuItem2): Observable<MenuItem> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' +
        JSON.parse(sessionStorage.getItem('auth-user')!).accessToken
    );
    return this.http.put<MenuItem>(`${this.apiUrl}/${item.id}`, item, {
      headers,
    });
  }

}
