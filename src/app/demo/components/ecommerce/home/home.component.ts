import { Component } from '@angular/core';

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent {
    color1: string = 'Bluegray';

    products = [
        {
            price: '$140.00',
            image: 'assets/demo/images/ecommerce/home/home-4-1.png',
        },
        {
            price: '$82.00',
            image: 'assets/demo/images/ecommerce/home/home-4-2.png',
        },
        {
            price: '$54.00',
            image: 'assets/demo/images/ecommerce/home/home-4-3.png',
        },
        {
            price: '$72.00',
            image: 'assets/demo/images/ecommerce/home/home-4-4.png',
        },
        {
            price: '$99.00',
            image: 'assets/demo/images/ecommerce/home/home-4-5.png',
        },
        {
            price: '$89.00',
            image: 'assets/demo/images/ecommerce/home/home-4-6.png',
        },
    ];

    products2 = [
        {
            color: 'Bluegray',
            image: 'assets/demo/images/ecommerce/home/home-2-1.png',
        },
        {
            color: 'Indigo',
            image: 'assets/demo/images/ecommerce/home/home-2-2.png',
        },
        {
            color: 'Purple',
            image: 'assets/demo/images/ecommerce/home/home-2-3.png',
        },
        {
            color: 'Cyan',
            image: 'assets/demo/images/ecommerce/home/home-2-4.png',
        },
    ];
}
