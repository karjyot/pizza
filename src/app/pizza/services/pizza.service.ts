import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { map,tap } from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
 //const functions = require('firebase-functions');
 //import { Client, Environment } from 'square'
 //const crypto = require('crypto');
 //const SquareConnect = require('square');
@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  cartItems:any = []
  client:any
  constructor(private http: HttpClient,private fns: AngularFireFunctions,private firestore: AngularFirestore) { 
   
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
clearCoupan(){
  let emptyArr:any = []
  localStorage.removeItem('coupan-details');
}

  createPayment(){
  //   const callable = this.fns.httpsCallable('my-fn-name');
  //   console.log(SquareConnect)
  //  //AngularFireFunctionsModule.call(async (data, context) => {
  //       /* testing url for sandbox */
  //       //defaultClient.basePath = process.env.TESTING_SQUARE_CONNECT_URL;
    
  //       const defaultClient = SquareConnect.ApiClient.instance;
  //       defaultClient.basePath = process.env.PRODUCTION_SQUARE_CONNECT_URL;
  //       const oauth2 = defaultClient.authentications["oauth2"];
  //       oauth2.accessToken = process.env.PRODUCTION_APPLICATION_ACCESS_TOKEN;
  //       const idempotency_key = crypto.randomBytes(16).toString("hex");
  //       const payments_api = new SquareConnect.PaymentsApi() ;
    
  //       /* value of ammount is in cents as of 11/29/2019
  //           , 1 is equal to 1 cent, 100 is equal to 100 cents */
  //       const request_body = {
  //           "idempotency_key": idempotency_key,
  //          // "source_id": data.source_id,
  //           "amount_money": {
  //               "amount": 100,
  //               "currency": "USD"
  //           },
  //       };
    
  //       try{
  //         let  response =  payments_api.createPayment(request_body)
  //           .then( 
  //               r=> {
  //                   if(r.ok) { return Promise.resolve(r); }
  //                   return Promise.reject(Error("TRY ERROR_ON_RESPONSE: " + JSON.stringify(r)))
  //           })
  //           .catch( 
  //               e=> {
  //                   return Promise.reject(Error("TRY ERROR_ON_EXCEPTION: " + JSON.stringify(e)))
  //           });
  //           return "TRY OKAY: " + JSON.stringify(response);
  //       } catch(error){
  //           return "CATCH ERROR: " + JSON.stringify(error);
  //       }
    //});
//     const paymentsApi = this.client.paymentsApi;
//     const bodyAmountMoney = {};
// bodyAmountMoney["amount"] = 200;
// bodyAmountMoney["currency"] = 'USD';
//     const bodyTipMoney = {};
//     bodyTipMoney["amount"] = 198;
//     bodyTipMoney["currency"] = 'CHF';
    
//     const bodyAppFeeMoney = {};
//     bodyAppFeeMoney["amount"] = 10;
//     bodyAppFeeMoney["currency"] = 'USD';
    
//     const body = {
//       sourceId: 'ccof:uIbfJXhXETSP197M3GB',
//       idempotencyKey: '4935a656-a929-4792-b97c-8848be85c27c',
//       amountMoney: bodyAmountMoney,
//     };
//     body["tipMoney"] = bodyTipMoney;
//     body["appFeeMoney"] = bodyAppFeeMoney;
//     body["delayDuration"] = 'delay_duration6';
//     body["autocomplete"] = true;
//     body["orderId"] = 'order_id0';
//     body["customerId"] = 'VDKXEEKPJN48QDG3BGGFAK05P8';
//     body["locationId"] = 'XK3DBG77NJBFX';
//     body["referenceId"] = '123456';
//     body["note"] = 'Brief description';
//     try {
//       const { result, ...httpResponse } =  paymentsApi.createPayment(body);
//       // Get more response info...
//       // const { statusCode, headers } = httpResponse;
//     } catch(error) {
//       if (error) {
//         const errors = error.result;
//         console.log(errors)
//         // const { statusCode, headers } = error;
//       }
//     }
  //   functions.https.onCall(async (data, context) => {
  //     /* testing url for sandbox */
  //     //defaultClient.basePath = process.env.TESTING_SQUARE_CONNECT_URL;
  
  //     const defaultClient = SquareConnect.ApiClient.instance;
  //     defaultClient.basePath = process.env.PRODUCTION_SQUARE_CONNECT_URL;
  //     const oauth2 = defaultClient.authentications["oauth2"];
  //     oauth2.accessToken = process.env.PRODUCTION_APPLICATION_ACCESS_TOKEN;
  //     const idempotency_key = crypto.randomBytes(16).toString("hex");
  //     const payments_api = new SquareConnect.PaymentsApi() ;
  
  //     /* value of ammount is in cents as of 11/29/2019
  //         , 1 is equal to 1 cent, 100 is equal to 100 cents */
  //     const request_body = {
  //         "idempotency_key": idempotency_key,
  //         "source_id": data.source_id,
  //         "amount_money": {
  //             "amount": 100,
  //             "currency": "USD"
  //         },
  //     };
  
  //     try{
  //       let  response = await payments_api.createPayment(request_body)
  //         .then( 
  //             r=> {
  //                 if(r.ok) { return Promise.resolve(r); }
  //                 return Promise.reject(Error("TRY ERROR_ON_RESPONSE: " + JSON.stringify(r)))
  //         })
  //         .catch( 
  //             e=> {
  //                 return Promise.reject(Error("TRY ERROR_ON_EXCEPTION: " + JSON.stringify(e)))
  //         });
  //         return "TRY OKAY: " + JSON.stringify(response);
  //     } catch(error){
  //         return "CATCH ERROR: " + JSON.stringify(error);
  //     }
  // });
  }
  
}
