import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  //{} süslü parantez obje demek
  products: Product[] = [];
  dataLoaded = false;
  filterText="";

  // productResponseModel:ProductResponseModel={
  //   data:this.products,
  //   message:"",
  //   success:true
  // }; response.data yazdığımız için buna gerek kalmadı ProductResponseModel'e maplemek için

  constructor(private productService:ProductService, private activatedRoute:ActivatedRoute, private toastrService:ToastrService,private cartService:CartService) {} 
  //productcomponent product service'i kullanabilir demek
  //constructor içine girilen değişken this ile bu class da ulaşılabilir, fakat c# ta bu mümkün değil
  // activatedRoute aktifleştirilmiş mevcut route -> http://localhost:4200/cars/brand/1 gibi 
  ngOnInit(): void {
    //console.log('init çalıştı');
    //bir fonksiyonun dışındaki bir şeye ulaşmak istediğinde this kulanıyoruz
    this.activatedRoute.params.subscribe(params=>{
      if(params["categoryId"]){
        this.getProductsByCategory(params["categoryId"])
      }else{
        this.getProducts();
      }
    })
  }

  //public void NgOnInit(){}
  getProducts() {
    //console.log("Api request başladı");
    this.productService.getProducts().subscribe(response=>{
      this.products = response.data
      this.dataLoaded = true;
      //console.log("Api request bitti");
      //asenkron çalışır: aşağıdaki metod biti, bunun bitmesini beklemiyor
    })
    //console.log("Metod bitti");
  }

  getProductsByCategory(categoryId:number) {
    this.productService.getProductsByCategory(categoryId).subscribe(response=>{
      this.products = response.data
      this.dataLoaded = true;

    })
  }

  addToCart(product: Product){
    if(product.productId===1){
      this.toastrService.error("Hata","Bu ürün sepete eklenemez")
    }else{
      this.toastrService.success("Sepete eklendi",product.productName);
      this.cartService.addToCart(product);
    }
    
  }
}
