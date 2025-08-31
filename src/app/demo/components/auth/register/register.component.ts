import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {RegisterRequestDto} from "../../../../shared/dto/request/auth-request.dto";


@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

    protected dto: RegisterRequestDto = {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    };

    constructor(private layoutService: LayoutService,
                private authService: AuthService,
                private router: Router,
                private messageService: MessageService) {
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    protected onSubmit(): void {
        if (!this.dto.firstName || !this.dto.lastName || !this.dto.email || !this.dto.username || !this.dto.password) {
            return;
        }

        this.authService.register(this.dto).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Ben fatto!',
                    detail: 'Registrazione effettuata con successo.',
                    life: 2000
                })
                void this.router.navigate(['/']);
            },
        });
    }

    protected goToLogin(): void {
        void this.router.navigate(['/auth/login']);
    }

}
