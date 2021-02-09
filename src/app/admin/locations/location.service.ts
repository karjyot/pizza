import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { map,tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  cartItems:any = []
  client:any
  constructor(private http: HttpClient,private fns: AngularFireFunctions,private firestore: AngularFirestore) { 
   
  }

  getLocations(): Observable<any> {
    let query =  this.firestore.collection('locations');
  return query.get()
    .pipe(
        map(snapshot => {
            let items = [];
            snapshot.docs.map(a => {
                const data = a.data();
                const id = a.id;
                items.push({ id, ...data })
            })
            return items
        }),)
  }

 
}
