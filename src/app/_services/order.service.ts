import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';
  constructor(private http: HttpClient) { }
  //Creazione dell'ordine
  createOrder(orderRequest: any): Observable<Order> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.post<Order>(`${this.baseUrl}/create`, orderRequest,{headers});
  }
  getAllOrdersByRestaurateurId(id:number): Observable<Order[]> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.get<any>(`${this.baseUrl}/restaurateur/${id}`, {headers})
      .pipe(map(response => response.content));
  }
  approveOrder(orderId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.put<any>(`${this.baseUrl}/${orderId}/approve`, null, { headers });
  }
  completeOrder(orderId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.put<any>(`${this.baseUrl}/${orderId}/complete`, null, { headers });
  }
  cancelledOrder(orderId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem('auth-user')!).accessToken);
    return this.http.put<any>(`${this.baseUrl}/${orderId}/cancelled`, null, { headers });
  }

}
