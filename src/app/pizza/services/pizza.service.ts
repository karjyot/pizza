import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { map,tap } from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import { GoogleMapsAPIWrapper,MapsAPILoader } from '@agm/core';
declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  cartItems:any = []
  client:any
  constructor(private http: HttpClient,private fns: AngularFireFunctions,private firestore: AngularFirestore,private mapsAPI : MapsAPILoader) { 
   
  }

  getPizzaSizes(): Observable<any> {
    return this.http.get('./assets/sizes.json');
  }

  getToppings(): Observable<any> {
    return this.http.get('./assets/toppings.json');
  }

  getCrustTpes(): Observable<any> {
    return this.http.get('./assets/crust.json');
  }
  getTaxes(): Observable<any> {
    return this.http.get('./assets/taxes.json');
  }

  addCartItems(response){
    this.cartItems.push(response);
  }
  getTotalPrice(totalItems){
        var total = 0;
        if(totalItems){
          for (var i = 0; i < totalItems.length; i++) {
            var item = totalItems[i];
            total += item.price*item.quantity;
          }
        }
        return total;
  }

  saveCartData(response){
    let cartItems = this.getCartData();
    if(cartItems){
      let isExists = this.checkItemExist(response);
      if(!isExists){
       cartItems.push(response)
       localStorage.setItem('cartItems',  JSON.stringify(cartItems));
    }
    }else{
      let arr = []
      arr.push(response)
      localStorage.setItem('cartItems',  JSON.stringify(arr));
    }
    
  }
  getCartData(){
    let details = localStorage.getItem('cartItems');
    return JSON.parse(details);
  }
  clearCart(currentItem){
    let totalItems = this.getCartData();
    totalItems.forEach(function(item, index) {
      if(item.id == currentItem.id){
        totalItems.splice(index,1)
      }
    });
    localStorage.setItem('cartItems',  JSON.stringify(totalItems));
  }

  checkItemExist(item){
    let totalItems = this.getCartData();
    let isFound = false
    for(var i=0; i<totalItems.length; i++){
      if((totalItems[i].id ==  item.id) && JSON.stringify(totalItems[i].itemDescription) == JSON.stringify(item.itemDescription) ){
        isFound = true
        totalItems[i].quantity = totalItems[i].quantity + 1;
      }
    }
    localStorage.setItem('cartItems',  JSON.stringify(totalItems));
    return isFound;
  }
  quantityChanged(item){
    let totalItems = this.getCartData();
    for(var i=0; i<totalItems.length; i++){
      if( JSON.stringify(totalItems[i]) ==  JSON.stringify(item)){
        totalItems[i].quantity = totalItems[i].quantity - 1;
        break;
      }
    }
    localStorage.setItem('cartItems',  JSON.stringify(totalItems));
  }

  emptyCart(){
    let emptyArr:any = []
    localStorage.setItem('cartItems', JSON.stringify(emptyArr) );
  }
  getTotalCount() {
    let cartItems = this.getCartData();
    var count = 0;
    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
            count += Number(item.quantity);
    }
    return count;
}

validateCoupan(code){
  return this.firestore.collection<any>('coupans', ref => ref.where('code', '==', code))
  .valueChanges()
  .pipe(map(val => val.length > 0 ? val[0] : null));

 
}
getListofProducts(){
  return this.http.get('./assets/products.json');
  //  let query =  this.firestore.collection('products');
  // return query.get()
  //   .pipe(
  //       map(snapshot => {
  //           let items = [];
  //           snapshot.docs.map(a => {
  //               const data = a.data();
  //               const id = a.id;
  //               items.push({ id, ...data })
  //           })
  //           return items
  //       }),)
}
getListofLocations(){
    let query =  this.firestore.collection('events');
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


setProductDetails(product){
  localStorage.setItem('product-details',  JSON.stringify(product));
}
getProductDetails(){
  let details = localStorage.getItem('product-details');
  return JSON.parse(details);
}
saveCoupanInfo(coupanInfo){
  localStorage.setItem('coupan-details',  JSON.stringify(coupanInfo));
}
getCoupanInfo(){
  let details = localStorage.getItem('coupan-details');
  return JSON.parse(details);
}
deleteCoupan(){
  localStorage.removeItem('coupan-details');
}
saveOrderDetails(order){
  localStorage.setItem('order-details',  JSON.stringify(order));
}

getOrderDetails(){
  let details = localStorage.getItem('order-details');
  return JSON.parse(details);
}
clearCoupan(){
  let emptyArr:any = []
  localStorage.removeItem('coupan-details');
}

deleteOrderDetails(){
  localStorage.removeItem('order-details');
}
createProfile(data) {
  return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("profiles")
          .add(data)
          .then(res => resolve(res), err => reject(err));
  });
}
getGeoLocation(address: string){
  return new Promise<any>((resolve, reject) =>{
    this.mapsAPI.load().then(() => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
          'address': address
        }, (results:any, status:any) => {
          let latLong = {
            lat : results[0].geometry.location.lat(),
            long : results[0].geometry.location.lng(),
          }
         resolve(latLong)
       })
    })
  })

}
  
}
