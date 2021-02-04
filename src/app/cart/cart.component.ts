import { Component, OnInit } from '@angular/core';
import { PizzaService } from './../pizza/services/pizza.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router,ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems:any
  coupanError:any
  subTotal:any
  coupanCode:any
  finalPrice:any
  taxes:any
  totalCount:any
  selectedItem:any
  modalRef:any
  coupanResponse:any
  coupanApplied = false
  pizzaProducts:any
  freeProduct:any
  isFreePizza = false
  selectedFreePizza:any
  qty:any = []
  constructor(
    private pizzaService : PizzaService,
    private modalService: NgbModal,
    private router : Router
  ) {this.freeProduct = "" }

  ngOnInit() {
  this.getCartItems();

  
  }
  getCartItems(){
     
    this.pizzaService.getTaxes().subscribe((result) => {
      this.coupanResponse = this.pizzaService.getCoupanInfo();
      let taxValue = result.taxRate
      this.cartItems = this.pizzaService.getCartData();
      console.log(this.cartItems[0])
      this.subTotal = this.pizzaService.getTotalPrice(this.cartItems)
      this.taxes = (this.subTotal * taxValue/100)
      this.finalPrice =  this.subTotal + this.taxes;
      if(this.cartItems){
        for(var i=0; i<this.cartItems.length; i++){
          this.qty[i] = this.cartItems[i].quantity
        }
      }
      this.totalCount = this.pizzaService.getTotalCount();
      if(this.coupanResponse){
        this.coupanApplied = true
        this.calculateCoupanPrice(this.coupanResponse)
      }
    }, (err) => {
       
      });
  }
  openRemovePizza(content,currentItem){
    this.selectedItem = currentItem
   this.modalRef =  this.modalService.open(content, {backdropClass: 'light-blue-backdrop'})
  }
  removePizza(){
    this.pizzaService.clearCart(this.selectedItem);
    this.totalCount = this.pizzaService.getTotalCount();
    this.modalRef.close();
    this.getCartItems();
  }

  changeItemCount(item){
 
    this.pizzaService.saveCartData(item);
    this.totalCount = this.pizzaService.getTotalCount();
    this.getCartItems();
  }
  removeItem(item){

    this.pizzaService.quantityChanged(item);
    this.totalCount = this.pizzaService.getTotalCount();
    this.getCartItems();
  }
  addItems(){
    this.router.navigateByUrl('/')
  }
  clearAll(){
    this.pizzaService.emptyCart()
    this.pizzaService.clearCoupan()
    this.getCartItems();
  }
  checkout(){
    let finalObj = {
      "totalPrice":this.finalPrice,
      "totalItems":[]
    };
    this.cartItems.forEach(element => {
      element.name = element.itemName + (element.itemCrust)
      element.quantity =  element.quantity
      element.toppings = [];
      element.itemDescription.forEach(element1 => {
        element.toppings.push({toppingName:element1.name+"(" +element1.toppingType+")"})
      })
      finalObj.totalItems.push({
        "pizzaName":element.itemName + "(" + element.itemCrust +")",
        "quantity":element.quantity,
        "toppings":element.toppings,
        "productDescription":element.productDescription
      })
    });
    if(this.isFreePizza){
      finalObj['freePizza'] = this.selectedFreePizza
    }
    this.pizzaService.saveOrderDetails(finalObj)
    this.router.navigateByUrl('/checkout')
  }

  applyCoupan(){

    if(!this.coupanCode){
      return;
    }
    this.coupanError = "";
    this.pizzaService.validateCoupan(this.coupanCode).subscribe(response => {
      if(response){
        this.coupanResponse = response;
       this.pizzaService.saveCoupanInfo( this.coupanResponse)
        this.coupanApplied = true
        this.calculateCoupanPrice(response)
      }else{
        this.coupanApplied = false
        this.coupanError = "Coupan code is invalid."
      }
      
      })
    
  }
  calculateCoupanPrice(response){

    let currentDate =  new Date().getTime() / 1000;
    let startDate = response.start_date.seconds;
    let endDate = response.end_date.seconds;

    if(currentDate<=endDate && currentDate>= startDate){
     
      if(response.type == 'percentage'){
        this.finalPrice =  (this.finalPrice) - (this.finalPrice * response.value)/100
      }
      else if(response.type == 'amount'){
        this.finalPrice =  (this.finalPrice) - (response.value)
      }
      else{
        this.pizzaService.getListofProducts().subscribe(response => {
          this.pizzaProducts = response
         
        })
      }
    }else{
      this.coupanApplied = false
      this.coupanError = "Coupan code expired."
    }
    
  }
  applyFreeItem(){
    if(!this.freeProduct){
      return
    }
  this.isFreePizza = true
  this.selectedFreePizza =  this.pizzaProducts.filter((item) => item.productId == this.freeProduct)[0];
  }
  changeFreePizza(){
    this.isFreePizza = false
  }
  cancelCoupan(){
    this.coupanApplied = false
    this.isFreePizza = false
    this.pizzaService.clearCoupan()
    this.getCartItems();
  }


}
