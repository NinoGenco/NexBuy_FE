export class Category {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public subCategories: SubCategory[]
    ) {}

}

export class SubCategory {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public category: Category,
    ) {}

}
