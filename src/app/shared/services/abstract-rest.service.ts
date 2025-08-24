import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export abstract class AbstractRestService<T> {

  protected constructor(
    protected _http: HttpClient,
    protected actionUrl: string
  ) {
  }

  /** GET all items */
  getAll(): Observable<T[]> {
    return this._http.get<T[]>(this.actionUrl);
  }

  /** GET one item by ID */
  getOne(id: number | string): Observable<T> {
    return this._http.get<T>(`${this.actionUrl}/${id}`);
  }

  /** POST a new item */
  create(item: T): Observable<T> {
    return this._http.post<T>(this.actionUrl, item);
  }

  /** PUT to update an existing item */
  update(id: number | string, item: T): Observable<T> {
    return this._http.put<T>(`${this.actionUrl}/${id}`, item);
  }

  /** DELETE an item by ID */
  delete(id: number | string): Observable<void> {
    return this._http.delete<void>(`${this.actionUrl}/${id}`);
  }

}
