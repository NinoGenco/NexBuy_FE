import {BehaviorSubject, Observable, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthResponseDto} from "../dto/response/auth-response.dto";
import {ApiRoutes} from "../../config/api-routes";


/**
 * Servizio di autenticazione dell'applicazione.
 * Gestisce login, logout, stato di autenticazione e accesso al token.
 */
@Injectable({providedIn: 'root'})
export class AuthService {

  /** Chiave con cui il token JWT viene salvato nel localStorage */
  private readonly tokenKey = 'AUTH_TOKEN';

  /** Subject interno che rappresenta lo stato di autenticazione dell'utente */
  private readonly _isLoggedInSubject = new BehaviorSubject<boolean>(false);
  /** Observable pubblico per monitorare se l'utente è autenticato */
  public readonly isLoggedIn$ = this._isLoggedInSubject.asObservable();


  constructor(private http: HttpClient, private router: Router) {
  }

  /**
   * Esegue il login inviando email e password all'endpoint di autenticazione.
   * In caso di successo, salva il token e aggiorna lo stato di login.
   * @param email Email dell'utente
   * @param password Password dell'utente
   */
  login(email: string, password: string): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(ApiRoutes.auth.login(), {email, password}).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this._isLoggedInSubject.next(true);
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

    this.http.post<void>(ApiRoutes.auth.logout(), {}, { headers }).subscribe({
      next: () => this._forceLocalLogout(),
      error: (err) => {
        console.error('Errore durante il logout:', err);
        this._forceLocalLogout(); // fallback: comunque logout locale
      }
    });
  }


  /**
   * Restituisce il token JWT corrente salvato nel localStorage.
   */
  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // -------------------------------------------------------------------------------------------------------------------

  private _forceLocalLogout(): void {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

}
