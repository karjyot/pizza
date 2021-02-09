import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  pizzaOrders:any
  constructor( private orderService : OrderService,) { }

  ngOnInit() {
    this.getAllOrders()
  }
  getAllOrders(){
    this.orderService.getOrders().subscribe((result) => {
      this.pizzaOrders = result;
      console.log(this.pizzaOrders)
    }, (err) => {
       
      });

  }
}
