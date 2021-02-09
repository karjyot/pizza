import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

import { PizzaComponent } from './pizza/pizza.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { LocationsComponent } from './admin/locations/locations.component';
import { AddLocationComponent } from './admin/locations/add-location/add-location.component';
const routes: Routes = [
  { path: 'custom',  component: PizzaComponent},
  { path: 'cart',  component: CartComponent},
  { path: 'checkout',  component: CheckoutComponent},
  { path: '',  component: ProductsComponent},
  { path: 'details',  component: ProductDetailsComponent},
  {
    path: 'admin',
    component: LayoutComponent,
    children: [{
      path: 'orders',
      component: OrdersComponent
     },{
      path: 'locations',
      component: LocationsComponent
     },{
      path: 'add-location',
      component: AddLocationComponent
     }]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
