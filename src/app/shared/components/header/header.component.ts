import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AppConfig, LayoutService} from "../../../layout/service/app.layout.service";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {Router} from "@angular/router";


@Component({
    selector: 'app-topbar',
    templateUrl: './header.component.html',
})
export class AppHeaderComponent implements OnDestroy {

    @ViewChild('menuButton') menuButton!: ElementRef;
    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

    private config!: AppConfig;
    private subscription: Subscription;

    protected readonly userCache$: Observable<User | null>;

    constructor(protected layoutService: LayoutService,
                private authService: AuthService,
                private userService: UserService,
                private router: Router,
                private el: ElementRef) {
        this.userCache$ = this.userService.userCache$;

        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
    }

    protected onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    protected onLogoutButtonClicked() {
        this.authService.logout();
    }

    protected onAccountSettingsButtonClicked() {
        this.userService.retrieveUserInfo();
        void this.router.navigate(['profile/settings']);
    }

    protected onProductManagementButtonClicked() {
        void this.router.navigate(['ecommerce/product-list']);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
