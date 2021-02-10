import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

import { PizzaComponent } from './pizza/pizza.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: 'custom',  component: PizzaComponent},
  { path: 'cart',  component: CartComponent},
  { path: 'checkout',  component: CheckoutComponent},
  { path: '',  component: ProductsComponent},
  { path: 'details',  component: ProductDetailsComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
