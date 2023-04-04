import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private readonly BASE_URL = 'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals';
  private readonly ACCESS_TOKEN = JSON.parse(sessionStorage.getItem('auth-user')!).accessToken;


  constructor(private http: HttpClient) { }
  generateSignUpLink(sellerNonce: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.ACCESS_TOKEN}`
      })
    };
    const requestBody = {
      operations: [
        {
          operation: 'API_INTEGRATION',
          api_integration_preference: {
            rest_api_integration: {
              integration_method: 'PAYPAL',
              integration_type: 'FIRST_PARTY',
              first_party_details: {
                features: [
                  'PAYMENT',
                  'REFUND'
                ],
                seller_nonce: sellerNonce
              }
            }
          }
        }
      ],
      products: [
        'EXPRESS_CHECKOUT'
      ],
      legal_consents: [
        {
          type: 'SHARE_DATA_CONSENT',
          granted: true
        }
      ]
    };
    return this.http.post<any>(this.BASE_URL, requestBody, httpOptions);
  }

}
