import {Component} from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {LayoutService} from "../../../../layout/service/app.layout.service";
import {LoginRequestDto} from "../../../../shared/dto/request/auth-request.dto";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

    protected dto: LoginRequestDto = {
        username: '',
        password: '',
        rememberMe: false
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
        if (!this.dto.username || !this.dto.password) {
            return;
        }

        this.authService.login(this.dto).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Bentornato!',
                    detail: 'Login effettuato con successo',
                    life: 2000
                })
                void this.router.navigate(['/']);
            },
        });
    }

    protected goToRegister(): void {
        void this.router.navigate(['/auth/register']);
    }

}
