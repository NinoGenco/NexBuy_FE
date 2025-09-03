import {SubCategory} from "./category.model";
import {User} from "./user.model";
import {Image} from "./image.model";
import {Review} from "./review.model";

export class Product {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public manufacturer: string,
        public price: number,
        public quantity: number,
        public subCategory: SubCategory,
        public selle: User,
        public reviews: Review[],
        public images: Image[],
    ) {}

}
