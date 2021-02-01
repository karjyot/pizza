import { Component, OnInit } from '@angular/core';
import { PizzaService } from './services/pizza.service';
import { forkJoin, of  } from 'rxjs';
import {  map, catchError } from 'rxjs/operators';
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
  pizzaModel = {selectedSize : '',selectedCrust:'',selectedToppings:[]}
  constructor(
    private pizzaService : PizzaService
  ) { }

  ngOnInit() {

    this.getPizzaData()
  }
  getPizzaData(){
    forkJoin([
      this.pizzaService.getPizzaSizes().pipe(map((res) => res), catchError(e => of([]))),
      this.pizzaService.getCrustTpes().pipe(map((res) => res), catchError(e => of([]))),
      this.pizzaService.getToppings().pipe(map((res) => res), catchError(e => of([])))]).subscribe(response => {
         this.pizzaSizes = response[0];
         this.pizzaCrusts = response[1];
         this.pizzaToppings = response[2];

      })
  }
  OnCheckboxSelect(name, event) {
    if (event.target.checked === true) {
      this.pizzaModel.selectedToppings.push(name);
    }
    if (event.target.checked === false) {
      this.pizzaModel.selectedToppings = this.pizzaModel.selectedToppings.filter((item) => item !== name);
    }
  }
  changePage(delta: number): void {
    // some checks
    this.currentPage += delta;
    console.log(this.currentPage)
}
cart(){
 let response = {
   "itemName":this.pizzaModel.selectedSize,
   "itemDescription":this.pizzaModel.selectedToppings,
   "itemCrust":this.pizzaModel.selectedCrust
 }
 console.log(response)
}
}
