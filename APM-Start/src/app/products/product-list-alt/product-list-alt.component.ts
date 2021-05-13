import {ChangeDetectionStrategy, Component} from '@angular/core';

import {combineLatest, EMPTY, of, Subject} from 'rxjs';
import {ProductService} from '../product.service';
import {catchError, map} from "rxjs/operators";

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  pageTitle$ = of('Products');

  products$ = this.productService.productsWithCategory$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  vm$ = combineLatest([
    this.pageTitle$,
    this.products$
  ])
    .pipe(
      map(([pageTitle, products]) => ({pageTitle, products}))
    );

  selectedproduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
