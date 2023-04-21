import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { AppConfig } from '../app-config';

@Injectable({
    providedIn: 'root'
  })
export default class RoomService {
  
  constructor(private http: HttpClient, private _appConfig: AppConfig) { }

  // Room
  getRoomList(): Observable<Room[]> {
      return this.http.get<any[]>(this._appConfig.apiRehersalUrl + '/Room/Rooms');
  }

  addRoom(room: Room): Observable<Room> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Room>(this._appConfig.apiRehersalUrl + '/Room/Create', room, httpOptions);
  }

  updateRoom(room: Room): Observable<Room> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.put<any>(this._appConfig.apiRehersalUrl + '/Room/Edit/', room, httpOptions);
  }

  deleteRoom(id: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.http.delete<number>(this._appConfig.apiRehersalUrl + '/Room/Delete/' + id, httpOptions);
  }
  getRooms(): Observable<Room[]> {
    return this.http.get<any[]>(this._appConfig.apiRehersalUrl + '/Room/GetRooms');
  }  
  getRoomByRehersalID(id: number): Observable<Room[]> {
    return this.http.get<any[]>(this._appConfig.apiRehersalUrl + '/Room/GetRoomByRehersalID/' + id);
  }
}