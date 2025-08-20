import {AbstractRestService} from "./abstract-rest.service";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractRestService<UserDto> {
  constructor(http: HttpClient, private auth: AuthService) {
    super(http, '/api/users');
  }

  getCurrentUser(): Observable<UserDto> {
    const id = this.auth.userId$.value;
    return id ? this.getOne(id) : throwError(() => new Error('No user logged in'));
  }
}
