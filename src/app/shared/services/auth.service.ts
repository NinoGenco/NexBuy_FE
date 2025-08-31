import {BehaviorSubject, Observable, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthResponseDto} from "../dto/response/auth/auth-response.dto";
import {ApiRoutes} from "../../config/api-routes";
import {NgxPermissionsService} from "ngx-permissions";
import {LoginRequestDto, RegisterRequestDto} from "../dto/request/auth-request.dto";


/**
 * Servizio di autenticazione dell'applicazione.
 * Gestisce login, logout, stato di autenticazione e accesso al token.
 */
@Injectable({providedIn: 'root'})
export class AuthService {

    /** Chiave con cui il token JWT viene salvato nel localStorage */
    private readonly tokenKey = 'AUTH_TOKEN';

    /**
     * Subject interno che rappresenta l'utente autenticato nell'app,
     * se non è stato ancora effettuato l'accesso sarà null
     */
    private readonly _tokenSubject: BehaviorSubject<string | null>;
    /** Observable pubblico per monitorare l'utente autenticato */
    public readonly token$: Observable<string | null>;

    /** Restituisce il token JWT corrente salvato nel localStorage. */
    get token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    constructor(
        private http: HttpClient,
        private router: Router,
        private permissionsService: NgxPermissionsService
    ) {
        this._tokenSubject = new BehaviorSubject<string | null>(null)

        this.token$ = this._tokenSubject.asObservable()

        const token = this.token;
        if (token) {
            this._tokenSubject.next(token);
            this.permissionsService.loadPermissions(['LOGGED_IN']);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Registra un nuovo utente inviando i dati all'endpoint di registrazione.
     * In caso di successo, l'utente viene creato nel sistema (ma non viene effettuato il login automatico).
     *
     * @param dto - Dto per la richiesta di registrazione contenente username, email, nome, cognome e password
     * @returns Observable<void> - Completa senza restituire dati in caso di successo
     */
    register(dto: RegisterRequestDto): Observable<void> {
        return this.http.post<void>(ApiRoutes.auth.register(), dto);
    }

    /**
     * Esegue il login inviando email e password all'endpoint di autenticazione.
     * In caso di successo, salva il token e aggiorna lo stato di login.
     *
     * @param dto - Dto per la richiesta di login contenente username e password
     */
    login(dto: LoginRequestDto): Observable<AuthResponseDto> {
        return this.http.post<AuthResponseDto>(ApiRoutes.auth.login(), dto).pipe(
            tap(res => {
                localStorage.setItem(this.tokenKey, res.token);
                this._tokenSubject.next(res.token);
                this.permissionsService.loadPermissions(['LOGGED_IN']);
            })
        );
    }

    /**
     * Esegue il logout chiamando l'endpoint backend e, in caso di successo,
     * rimuove il token, aggiorna lo stato e reindirizza alla pagina di login.
     */
    logout(): void {
        const token = this.token;
        if (!token) {
            this._forceLocalLogout();
            return;
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        this.http.post<void>(ApiRoutes.auth.logout(), {}, {headers}).subscribe({
            next: () => this._forceLocalLogout(),
            error: (err) => {
                console.error('Errore durante il logout:', err);
                this._forceLocalLogout(); // fallback locale
            }
        });
    }

    // -------------------------------------------------------------------------------------------------------------------

    /**
     * Esegue un logout locale forzato dell'utente.
     *
     * Rimuove il token dal localStorage, aggiorna lo stato interno di login,
     * svuota i permessi definiti tramite ngx-permissions e reindirizza
     * l'utente alla home page ('/').
     *
     * Usato in caso di scadenza token, logout automatico o azioni di logout interne.
     */
    private _forceLocalLogout(): void {
        localStorage.removeItem(this.tokenKey);
        this._tokenSubject.next(null);
        this.permissionsService.flushPermissions(); // <-- rimuove tutti i permessi ngx-permissions
        void this.router.navigate(['/']);
    }

}
