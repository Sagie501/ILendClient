import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ile-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.less']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  navigateToProductPage() {
    this.router.navigate([this.product.id], { relativeTo: this.activatedRoute });
  }
}
