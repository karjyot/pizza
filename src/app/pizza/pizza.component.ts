import { Component, OnInit } from '@angular/core';
import { PizzaService } from './services/pizza.service';
import { forkJoin, of  } from 'rxjs';
import {  map, catchError } from 'rxjs/operators';
import { Router,ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {
  pizzaSizes : any;
  pizzaCrusts : any;
  pizzaToppings : any;
  currentPage = 0;
  nextButtonDisabled = true
  isCartValid:boolean = true
  cartItems = [];
  currentPrice = 0;
  pizzaModel = {selectedSize : '',selectedCrust:'',selectedToppings:[]}
  constructor(
    private pizzaService : PizzaService,
    private router : Router
  ) { }

  ngOnInit() {
    this.getPizzaData();
  }
  /*==Get list of pizza sizes, crust types and topping==*/
  getPizzaData(){
    forkJoin([
      this.pizzaService.getPizzaSizes().pipe(map((res) => res), catchError(e => of([]))),
      // this.pizzaService.getCrustTpes().pipe(map((res) => res), catchError(e => of([]))),
      ]).subscribe(response => {
      this.pizzaSizes = response[0];
      //this.pizzaCrusts = response[1];
     // this.pizzaToppings = response[2];
     
      })
  }

/*==Function while user hit next and previous button==*/
  changePage(delta: number): void {
    this.isCartValid = true
    this.currentPage += delta;
   
    this.isNextButtonDisabled();
}

/*==Function for validate user select size and crust==*/
isNextButtonDisabled(){
  this.runningTotalPrice();
  if(this.currentPage == 0 && this.pizzaModel.selectedSize){
    this.nextButtonDisabled = false
  }else if(this.currentPage == 1 && this.pizzaModel.selectedCrust){
    this.nextButtonDisabled = false
  }else{
    this.nextButtonDisabled = true
  }
}

/*==Function for cart==*/
cart(){
let selectedToppings =  this.pizzaToppings.filter((item) => item.checked == true);
let finalPrice = this.calcuateFinalPrice(selectedToppings);
console.log(finalPrice)

 let response = {
   "id":this.findPizzaID(),
   "itemName":this.pizzaModel.selectedSize,
   "itemPrice":'',
   "itemDescription":selectedToppings,
   "itemCrust":this.pizzaModel.selectedCrust,
   "price":finalPrice,
   "quantity":1
 }

 this.pizzaService.saveCartData( response)
 this.router.navigateByUrl('cart')
}

/*==Function for calcute the price while basis on user selection==*/
calcuateFinalPrice(selectedToppings){
   let selectedSize = this.pizzaSizes.filter((item) => item.name == this.pizzaModel.selectedSize);
   let selectedCrust = this.pizzaCrusts.filter((item) => item.name == this.pizzaModel.selectedCrust);
   let sizePrice = selectedSize[0]['price'];
   let crustPrice = selectedCrust[0]['price']
  let toppingPrice = 0;
  let setTopping = 0
  selectedToppings.forEach(element => {
   
    if(element.toppingType == 'FULL'){
      setTopping = element.price //set price for full topping
    }else{
      setTopping = (element.price/2) //set price for half topping
    }
    toppingPrice = Number(toppingPrice) + Number(setTopping)
  });
  return Number(toppingPrice) + Number(sizePrice) + Number(crustPrice)
}

/*==Function for validate the topping limits==*/
validateToppingLimit(){

  let selectedToppings =  this.pizzaToppings.filter((item) => item.checked == true);
  let selectedSize = this.pizzaSizes.filter((item) => item.name == this.pizzaModel.selectedSize);
  let limit = selectedSize[0]['limit']
  let fullToppings = selectedToppings.filter((item) => item.toppingType == "FULL").length;
  let halfToppings = selectedToppings.filter((item) => item.toppingType == "LH" || item.toppingType=="RH").length;
  let totalToppings = fullToppings + (halfToppings/2)
  if(totalToppings >  limit){
    this.isCartValid =  false
  }else{
    this.isCartValid = true
    this.runningTotalPrice()
  }
}
/*==Check the selcted pizza id==*/
findPizzaID(){
  let pizzaSize =  this.pizzaSizes.filter((item) => item.name == this.pizzaModel.selectedSize);
  return pizzaSize[0]['id'];
}

/*==Filter toppings based on selected size==*/
getToppingsAndCrust(){
  let toppings =  this.pizzaSizes.filter((item) => item.name == this.pizzaModel.selectedSize);
  this.pizzaToppings  = toppings[0].toppings;
  this.pizzaCrusts  = toppings[0].crust;
 
  for(var i=0; i< this.pizzaToppings.length; i++){
    this.pizzaToppings[i].toppingType = 'FULL';
    this.pizzaToppings[i].checked = false
  }

}


/*==Find total price of selected items==*/
runningTotalPrice(){
  let pizzaSize =  this.pizzaSizes.filter((item) => item.name == this.pizzaModel.selectedSize)[0];
  let crustPrice = 0
  let toppingPrice = 0;
  let setTopping = 0;
  if(this.pizzaCrusts && this.pizzaModel.selectedCrust){

    crustPrice = this.pizzaCrusts.filter((item) => item.name == this.pizzaModel.selectedCrust)[0].price;
  }
  if(this.pizzaToppings){
    let selectedToppings =  this.pizzaToppings.filter((item) => item.checked == true);
   
    selectedToppings.forEach(element => {
   
    if(element.toppingType == 'FULL'){
      setTopping = element.price //set price for full topping
    }else{
      setTopping = (element.price/2) //set price for half topping
    }
    toppingPrice = Number(toppingPrice) + Number(setTopping)
    console.log(toppingPrice)
  });
  }

  
  let total  = Number(pizzaSize?pizzaSize.price:0) + Number(crustPrice) + Number(toppingPrice)
  this.currentPrice = total

}
}
