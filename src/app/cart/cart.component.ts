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
  subTotal:any
  finalPrice:any
  taxes:any
  selectedItem:any
  modalRef:any
  qty:any = []
  constructor(
    private pizzaService : PizzaService,
    private modalService: NgbModal,
    private router : Router
  ) { }

  ngOnInit() {
  this.getCartItems();

  
  }
  getCartItems(){
     
    this.pizzaService.getTaxes().subscribe((result) => {
      let taxValue = result.taxRate
      this.cartItems = this.pizzaService.getCartData();
      this.subTotal = this.pizzaService.getTotalPrice(this.cartItems)
      this.taxes = (this.subTotal * taxValue/100)
      this.finalPrice =  this.subTotal + this.taxes;
      if(this.cartItems){
        for(var i=0; i<this.cartItems.length; i++){
          this.qty[i] = this.cartItems[i].quantity
        }
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
    this.modalRef.close();
    this.getCartItems();
  }

  changeItemCount(item){
 
    this.pizzaService.saveCartData(item)
    this.getCartItems()
  }
  removeItem(item,i){

    this.pizzaService.quantityChanged(item);
    this.getCartItems();
   
   // this.pizzaService.quantityChanged(item);
    //this.getCartItems();
  }
  addItems(){
    this.router.navigateByUrl('/')
  }
  clearAll(){
    this.pizzaService.emptyCart()
    this.getCartItems();
  }
  checkout(){
    this.router.navigateByUrl('/checkout')
  }


}
