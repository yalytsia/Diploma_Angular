import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import RoomService  from 'src/app/services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  rooms: Room[] = [];

  constructor(private _roomService: RoomService, private router: Router) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this._roomService.getRooms().subscribe(
      (data:any) => {
        console.log(JSON.stringify(data));
        this.rooms = data;
         })
  }

  redirectToAngularCalendar(room: Room) {
    console.log(JSON.stringify(room));
    localStorage.setItem('room', JSON.stringify(room));
    this.router.navigateByUrl('/room/' + room.PathURL);
  }

}
