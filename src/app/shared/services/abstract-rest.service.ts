import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";


/**
 * Service REST astratto e generico per operazioni CRUD di base.
 *
 * @typeParam TModel - Il tipo dell'oggetto <b>ritornato</b> dal server (lettura).
 * @typeParam TDto - Il tipo dell'oggetto <b>inviato</b> al server (scrittura).
 *                    Può essere un'unione (es. CreateDto | UpdateDto).
 */
export abstract class AbstractRestService<TModel, TDto> {

    /**
     * @param _http   - Istanza di HttpClient di Angular.
     */
    protected constructor(
        protected _http: HttpClient
    ) {
    }

    /**
     * <b>Recupera tutti</b> gli elementi da un endpoint specifico.
     *
     * Esegue una GET sull’<code>url</code> indicato e applica il mapping verso `TModel`.
     *
     * @param url - Endpoint completo da interrogare (inclusi eventuali query params).
     * @returns Uno stream {@link Observable} con l'array di {@link Array Array<TModel>}.
     */
    getAll(url: string): Observable<TModel[]> {
        return this._http.get<any[]>(url).pipe(
            map(raw => this.mapInMany(raw))
        );
    }

    /**
     * <b>Recupera</b> un singolo elemento da un endpoint specifico.
     *
     * Esegue una GET sull’<code>url</code> indicato e applica il mapping verso `TModel`.
     *
     * @param url - Endpoint completo dell'elemento.
     * @returns Uno stream {@link Observable} con `TModel`.
     */
    getOne(url: string): Observable<TModel> {
        return this._http.get<any>(url).pipe(
            map(raw => this.mapIn(raw))
        );
    }

    /**
     * <b>Crea</b> una risorsa su un endpoint specifico.
     *
     * Esegue una POST sull’<code>url</code> indicato inviando il payload prodotto da {@link mapOut}.
     * Applica poi {@link mapIn} alla risposta.
     *
     * @param url - Endpoint di creazione.
     * @param dto - Dati in ingresso (es. <code>CreateDto</code>).
     * @returns Uno stream {@link Observable} con il `TModel` creato.
     */
    create(url: string, dto: TDto): Observable<TModel> {
        return this._http.post<any>(url, this.mapOut(dto)).pipe(
            map(raw => this.mapIn(raw))
        );
    }

    /**
     * <b>Aggiorna</b> una risorsa su un endpoint specifico.
     *
     * Esegue una PUT sull’<code>url</code> indicato inviando il payload prodotto da {@link mapOut}.
     * Applica poi {@link mapIn} alla risposta.
     *
     * @param url - Endpoint dell'elemento da aggiornare (tipicamente include l'id).
     * @param dto - Dati in ingresso (es. <code>UpdateDto</code>).
     * @returns Uno stream {@link Observable} con il `TModel` aggiornato.
     */
    update(url: string, dto: TDto): Observable<TModel> {
        return this._http.put<any>(url, this.mapOut(dto)).pipe(
            map(raw => this.mapIn(raw))
        );
    }

    /**
     * <b>Elimina</b> una risorsa su un endpoint specifico.
     *
     * Esegue una DELETE sull’<code>url</code> indicato.
     *
     * @param url - Endpoint dell'elemento da eliminare.
     * @returns Uno stream {@link Observable Observable<void>} che completa al termine dell’operazione.
     */
    delete(url: string): Observable<void> {
        return this._http.delete<void>(url);
    }


    // --------------------------
    // Hook di mapping (override)
    // --------------------------

    /**
     * Trasforma la risposta grezza (POJO) dell'API in `TModel`.
     *
     * Hook per istanziare le tue <i>classi di dominio</i> (es. <code>new Product(...)</code>)
     * o per normalizzare i dati (default, conversioni, ecc.). Da mantenere senza side-effect e
     * gestisci valori null/undefined.
     *
     * @param raw - Oggetto grezzo ricevuto dal server.
     * @returns Istanza di `TModel`.
     */
    protected mapIn(raw: any): TModel {
        return raw as TModel;
    }

    /**
     * Applicata {@link mapIn} a ogni elemento dell'array grezzo.
     *
     * Utile per liste; fornisce un fallback sicuro quando il server restituisce valori non-array.
     *
     * @param raw - Array grezzo ricevuto dal server.
     * @returns Un array di {@link Array Array<TModel>} mappati.
     */
    protected mapInMany(raw: any[]): TModel[] {
        return Array.isArray(raw) ? raw.map(r => this.mapIn(r)) : [];
    }

    /**
     * Prepara il payload da inviare al server a partire da `TDto`.
     *
     * Hook utilizzato per convertire <i>classi</i> o shape client in DTO accettati dall'API
     * (es. da <code>subCategory.id</code> a <code>subCategoryId</code>, rimozione di campi di sola lettura).
     *
     * @param dto - Dati in uscita (create/update).
     * @returns Il payload serializzabile da inviare nel body della richiesta.
     */
    protected mapOut(dto: TDto): any {
        return dto as any;
    }


}
