import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRequestCustomTypes } from '../../config/api-routes';


/**
 * Interceptor HTTP che aggiunge automaticamente il campo `customType` nel body delle richieste POST.
 *
 * Questo campo è utilizzato dal backend (es. Spring Boot) per distinguere tra diversi tipi di DTO
 * quando il payload della richiesta ha la stessa struttura o lo stesso endpoint.
 *
 * La mappatura tra URL e `customType` è definita all'interno della costante `ApiRequestCustomTypes`.
 */
@Injectable()
export class CustomTypeInterceptor implements HttpInterceptor {

    /**
     * Intercetta ogni richiesta HTTP e, se il metodo è POST e l'URL è presente in `ApiRequestCustomTypes`,
     * aggiunge il campo `customType` al corpo della richiesta.
     *
     * @param req La richiesta HTTP originale
     * @param next Il gestore successivo della catena degli interceptor
     * @returns Un Observable con la richiesta modificata (se necessario)
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const customType = ApiRequestCustomTypes[req.url];

        const isAllowedMethod = req.method === 'POST' || req.method === 'PUT';
        const isBodyObject = req.body && typeof req.body === 'object';

        if (customType && isAllowedMethod && isBodyObject) {
            const modifiedReq = req.clone({
                body: {
                    ...req.body,
                    CustomType: customType
                }
            });

            return next.handle(modifiedReq);
        }

        return next.handle(req);
    }

}
