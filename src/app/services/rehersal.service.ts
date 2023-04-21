import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rehersal } from '../models/rehersal';
import { AppConfig } from '../app-config';

@Injectable({
    providedIn: 'root'
  })
export default class RehersalService {
  
  constructor(private http: HttpClient, private _appConfig: AppConfig) { }

  // Rehersal
  getRehersalList() {
      return this.http.get(this._appConfig.apiRehersalUrl + '/Rehersal/Rehersals');
  }
  getRehersalByCityID(cityId : number) {
    return this.http.get(this._appConfig.apiRehersalUrl + '/Rehersal/GetRehersalByCityID/' + cityId);
}
  addRehersal(rehersal: Rehersal): Observable<Rehersal> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Rehersal>(this._appConfig.apiRehersalUrl + '/Rehersal/Create', rehersal, httpOptions);
  }

  updateRehersal(rehersal: Rehersal): Observable<Rehersal> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.put<any>(this._appConfig.apiRehersalUrl + '/Rehersal/Edit/', rehersal, httpOptions);
  }

  deleteRehersal(id: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.delete<number>(this._appConfig.apiRehersalUrl + '/Rehersal/Delete/' + id, httpOptions);
  }
}