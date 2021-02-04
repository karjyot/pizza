import { Component, OnInit } from '@angular/core';
import { PizzaService } from './../pizza/services/pizza.service';
import { Router,ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any;

  constructor(private pizzaService: PizzaService, 
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.loadProdcts();
  }

  loadProdcts() {
   this.pizzaService.getListofProducts().subscribe(products => {
     this.products = products;
   })
   
  }

  // detailClick(product: Product){
  //   this.productService.selectedProduct = product;
  //   this.router.navigate(['/product-details']);
  // }

  addToCart(product) {
    let response = {
      "id":product.productId,
      "itemName":product.itemName,
      "itemPrice":'',
      "productDescription":product.itemFullDescription,
      "description":product.itemFullDescription,
      "itemDescription":[],
      "itemCrust":'',
      "price":product.itemPrice,
      "quantity":1
    }
    this.pizzaService.saveCartData( response)
    this.router.navigateByUrl('cart')
  }

  customize(product) {
   
   // this.productService.selectedProduct = product;
    this.router.navigate(['/custom']);
  }
  detailClick(product){
    this.pizzaService.setProductDetails(product)
    this.router.navigate(['/details']);
  }

}
