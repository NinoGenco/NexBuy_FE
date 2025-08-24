import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {UserService} from "../../../../shared/services/user.service";
import {User} from "../../../../shared/models/user.model";

@Component({
    templateUrl: './profile-settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {

    protected userCache$: Observable<User | null>;

    constructor(private userService: UserService) {
        this.userCache$ = this.userService.userCache$;
    }

    ngOnInit() {
    }

}
