import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  
  constructor(private http: HttpClient) { }

  getPizzaSizes(): Observable<any> {
    return this.http.get('./assets/sizes.json');
  }

  getToppings(): Observable<any> {
    return this.http.get('./assets/toppings.json');
  }

  getCrustTpes(): Observable<any> {
    return this.http.get('./assets/crust.json');
    
  }
  
}
