import {AbstractRestService} from "./abstract-rest.service";
import {Product} from "../../demo/api/product";
import {CreateProductRequestDto, UpdateProductRequestDto} from "../dto/request/product-request.dto";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiRoutes} from "../../config/api-routes";

export class ProductService extends AbstractRestService<Product, CreateProductRequestDto | UpdateProductRequestDto> {

    constructor(protected http: HttpClient) {
        super(http);
    }

    list(): Observable<Product[]> {
        return this.getAll(ApiRoutes.products.all());
    }

}
