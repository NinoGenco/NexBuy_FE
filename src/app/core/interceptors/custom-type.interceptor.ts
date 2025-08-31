import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiRequestCustomTypes, customTypeFromUrl} from '../../config/api-routes';


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
        const isJson = req.headers.get('Content-Type')?.includes('application/json') ?? true;
        if (req.method === 'GET' || !isJson) return next.handle(req);

        const type = customTypeFromUrl(req.url);
        if (!type) return next.handle(req);

        const body = (req.body && typeof req.body === 'object')
            ? { ...req.body, CustomType: type }
            : req.body;

        return next.handle(req.clone({ body }));
    }

}
