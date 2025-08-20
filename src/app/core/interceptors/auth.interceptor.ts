import {Injectable, Injector} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../../shared/services/auth.service";
import {ApiRoutes} from "../../config/api-routes";


/**
 * Interceptor HTTP che aggiunge automaticamente il token di autenticazione (Bearer token)
 * all'intestazione delle richieste in uscita.
 *
 * Esclude automaticamente le richieste verso determinati endpoint (es. login) che non richiedono autenticazione.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Elenco degli endpoint che non richiedono il token di autenticazione.
   * Le richieste verso questi URL saranno lasciate inalterate.
   */
  private readonly excludedUrls: string[] = [
    ApiRoutes.auth.login(),
  ];

  constructor(private injector: Injector) {
  }

  /**
   * Intercetta ogni richiesta HTTP e, se non esclusa, aggiunge l'header Authorization con il token JWT.
   * @param req La richiesta HTTP originale
   * @param next Il gestore della catena di middleware
   * @returns La richiesta eventualmente modificata
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    const token = authService.token;

    const shouldExclude = this.excludedUrls.some(url => req.url.includes(url));

    if (!token || shouldExclude) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    });

    return next.handle(authReq);
  }

}
