import { Component, OnInit } from '@angular/core';
import { PizzaService } from './../pizza/services/pizza.service';
import { Router,ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor( private pizzaService : PizzaService) { 
   
  }
  product :any
  ngOnInit() {
    this.product = this.pizzaService.getProductDetails();  
    //this.data.currentMessage.subscribe(message => this.message = message)
  }

}
