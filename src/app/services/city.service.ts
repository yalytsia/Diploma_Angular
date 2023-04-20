import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from './../models/city';
import { AppConfig } from '../app-config';

@Injectable({
    providedIn: 'root'
  })
export default class CityService {
  
  constructor(private http: HttpClient, private _appConfig: AppConfig) { }

  // City
  getCityList() {
      var res = this.http.get(this._appConfig.apiRehersalUrl + '/City/Cities');
       return res;
  }

  addCity(city: City): Observable<City> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<City>(this._appConfig.apiRehersalUrl + '/City/Create', city, httpOptions);
  }

  updateCity(city: City): Observable<City> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.put<any>(this._appConfig.apiRehersalUrl + '/City/Edit/', city, httpOptions);
  }

  deleteCity(id: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.delete<number>(this._appConfig.apiRehersalUrl + '/City/Delete/' + id, httpOptions);
  }
}