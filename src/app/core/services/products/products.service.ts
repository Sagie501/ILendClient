import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
  addProductMutation,
  addToWishlistMutation,
  getProductByIdQuery, getProductsByUserIdQuery,
  getProductsQuery,
  getUserWishlistQuery,
  removeFromWishlistMutation
} from '../../graphql/product.graphql';
import { CommentsService } from '../comments/comments.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  constructor(private apollo: Apollo, private commentsService: CommentsService, private userService: UserService) {
  }

  getProducts(): Observable<Array<Product>> {
    return this.apollo.watchQuery<any>({
      query: getProductsQuery
    }).valueChanges.pipe<Array<Product>>(
      map(({ data }) => {
        let products = data.getProducts;
        products = products.map((product) => {
          return this.mapProductForClient(product);
        });
        return products as Array<Product>;
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.apollo.watchQuery<any>({
      query: getProductByIdQuery,
      variables: {
        productId: id
      }
    }).valueChanges.pipe<Product>(
      map(({ data }) => {
        return this.mapProductForClient(data.getProductById);
      })
    );
  }

  getProductsByUserId(userId: string): Observable<Array<Product>> {
    return this.apollo.query<any>({
      query: getProductsByUserIdQuery,
      variables: {
        userId
      }
    }).pipe(
      map(({ data, errors }) => {
        let products = data.getProductsByUserId;
        products = products.map((product) => {
          return this.mapProductForClient(product);
        });
        return products as Array<Product>;
      })
    );
  }

  addProduct(ownerId: string, categoryId: string, product): Observable<Product> {
    return this.apollo.mutate<any>({
      mutation: addProductMutation,
      variables: {
        ownerId,
        categoryId,
        product
      }
    }).pipe(
      map(({ data, errors }) => {
        return this.mapProductForClient(data.addProduct) as Product;
      })
    );
  }

  getUserWishlist(userId: string): Observable<Array<Product>> {
    return this.apollo.query<any>({
      query: getUserWishlistQuery,
      variables: {
        userId
      }
    }).pipe(
      map(({ data, errors }) => {
        let products = data.getUserWishList;
        products = products.map((product) => {
          return this.mapProductForClient(product);
        });
        return products as Array<Product>;
      })
    );
  }

  addProductToWishlist(userId: string, productId: string): Observable<Array<Product>> {
    return this.apollo.mutate<any>({
      mutation: addToWishlistMutation,
      variables: {
        userId,
        productId
      }
    }).pipe(
      map(({ data, errors }) => {
        let products = data.addToWishList.wishList;
        products = products.map((product) => {
          return this.mapProductForClient(product);
        });
        return products as Array<Product>;
      })
    );
  }

  removeProductFromWishlist(userId: string, productId: string): Observable<Array<Product>> {
    return this.apollo.mutate<any>({
      mutation: removeFromWishlistMutation,
      variables: {
        userId,
        productId
      }
    }).pipe(
      map(({ data, errors }) => {
        let products = data.removeFromWishList.wishList;
        products = products.map((product) => {
          return this.mapProductForClient(product);
        });
        return products as Array<Product>;
      })
    );
  }

  mapProductForClient(serverProduct): Product {
    return {
      ...serverProduct,
      owner: this.userService.mapUserForClient(serverProduct.owner),
      pictureLinks: JSON.parse(serverProduct.pictureLinks),
      comments: serverProduct.comments.map(this.commentsService.mapCommentForClient)
    };
  }
}
