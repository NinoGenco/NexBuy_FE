import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private messageService: MessageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = 'Errore generico';
                if (error.status === 0) {
                    message = 'Server non raggiungibile.';
                } else if (error.status === 401) {
                    message = 'Non autorizzato. Effettua nuovamente il login.';
                } else if (error.status === 403) {
                    message = 'Accesso negato.';
                } else if (error.error?.message) {
                    message = error.error.message;
                }

                // Mostra toast
                this.messageService.add({
                    severity: 'error',
                    summary: 'Errore',
                    detail: message,
                    life: 5000
                });

                return throwError(() => error);
            })
        );
    }

}
