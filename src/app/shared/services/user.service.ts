import {AbstractRestService} from "./abstract-rest.service";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model";
import {getClaimsFromToken} from "../utils/auth.utils";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {ApiRoutes} from "../../config/api-routes";
import {map} from "rxjs/operators";
import {UpdateUserDto, UpdateUserPasswordDto} from "../dto/request/user-request.dto";


@Injectable({
    providedIn: 'root'
})
export class UserService extends AbstractRestService<User, UpdateUserDto | UpdateUserPasswordDto> {

    private _token: string | null;

    private readonly _userCacheSubject: BehaviorSubject<User | null>;
    public readonly userCache$: Observable<User | null>;

    constructor(private http: HttpClient,
                private authService: AuthService) {
        super(http);

        this._token = null;
        this._userCacheSubject = new BehaviorSubject<User | null>(null);

        this.userCache$ = this._userCacheSubject.asObservable();

        this.initSubscriptions();
    }

    private initSubscriptions() {
        this.authService.token$.subscribe(token => {
            this._token = token;
            this.retrieveUserInfo();
        })
    }

    private getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(ApiRoutes.users.getByUsername(username)).pipe(
            map(data => new User(
                data.username,
                data.email,
                data.firstName,
                data.lastName,
                data.role
            ))
        );
    }

    retrieveUserInfo() {
        if (this._token) {
            const username = getClaimsFromToken(this._token)?.['sub'];
            if (username) {
                this.getUserByUsername(username).subscribe(user => {
                    this._userCacheSubject.next(user);
                });
            }
        }
    }

    updateUserInfo(username: string, dto: UpdateUserDto) {
        return this.http.put<User>(ApiRoutes.users.update(username), dto, {observe: 'response'}).pipe(
            map(res => {
                if (this._userCacheSubject.getValue()?.username === username) {
                    this.getUserByUsername(username).subscribe(user => {
                        this._userCacheSubject.next(user);
                    });
                }
            })
        );
    }

    updatePassword(username: string, dto: UpdateUserPasswordDto) {
        return this.http.put<User>(ApiRoutes.users.updatePassword(username), dto, {observe: 'response'});
    }

}
