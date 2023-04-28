import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Room}  from '../../models/room';
import  RoomService  from '../../services/room.service';
import {Rehersal}  from '../../models/rehersal';
import  RehersalService  from '../../services/rehersal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styles: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor(private service: RoomService, private modal: NgbModal, private rehersalService: RehersalService,) { }

    // Define ngModal as null for opening and closing the modal
  public modalReference = null;
  RoomList: Observable<Room[]>
  RehersalList: Observable<Rehersal[]>
  selectedRehersalValue: number
  ModalTitle = "ModalTitle";
  ActivateAddEditRoomComp: boolean = false;
  room: Room;

  RoomIdFilter = "";
  RoomNameFilter = "";
  RoomListWithoutFilter: Observable<Room[]>;
  @ViewChild('exampleModal', { static: true }) exampleModal: TemplateRef<any>;
  ngOnInit(): void {
    
    this.refreshData();
    //console.log(this.selectedRehersalValue);
    //this.refreshRoomList();
    
  }
  refreshData() {
    this.rehersalService.getRehersalList().subscribe((data:any) => {
      this.RehersalList = data; 
      if (this.selectedRehersalValue==undefined)
      {
        this.selectedRehersalValue = this.RehersalList[0].RehersalSpaseID;
        console.log(this.selectedRehersalValue);
      }

      this.service.getRoomByRehersalID(this.selectedRehersalValue).subscribe((data:any) => {
        this.RoomList = data;
        this.RoomListWithoutFilter = data;
        });
     });
  }
  onDropdownChange(e){
    console.log(e);
    this.selectedRehersalValue =e; 
    this.refreshData();
  }
  addClick() {
    this.room = {
        RoomId: 0,
        RehersalRoomName: "",
        RehersalSpaseID:0,
        RehersalRoomSize :0,
        PriceHour: 0,
        ImageURL: "",
        PathURL: "",
        Address: "",
        Description: "",
        StartProgram: "",
        EndProgram: ""
    }
    this.ModalTitle = "Add Room";
    this.ActivateAddEditRoomComp = true;
    this.modalReference = this.modal.open(this.exampleModal, { size: 'lg' });
 
  }
  addRoom(item: Room) {
    var room = {
        RoomId: 0,
        RehersalRoomName: item.RehersalRoomName,
        RehersalSpaseID: this.selectedRehersalValue,
        RehersalRoomSize: item.RehersalRoomSize,
        PriceHour: item.PriceHour,
        ImageURL: item.ImageURL,
        PathURL: item.PathURL,
        Address: item.Address,
        Description: item.Description,
        StartProgram: item.StartProgram,
        EndProgram: item.EndProgram
    };
    this.service.addRoom(room).subscribe();
    this.modalReference.close();
    this.refreshData();
  }
  updateRoom(item: Room) {
    var room = {
        RoomId: item.RoomId,
        RehersalRoomName: item.RehersalRoomName,
        RehersalSpaseID: this.selectedRehersalValue,
        RehersalRoomSize: item.RehersalRoomSize,
        PriceHour: item.PriceHour,
        ImageURL: item.ImageURL,
        PathURL: item.PathURL,
        Address: item.Address,
        Description: item.Description,
        StartProgram: item.StartProgram,
        EndProgram: item.EndProgram
    };
    this.service.updateRoom(room).subscribe();
    this.modalReference.close();
    this.refreshData();
  }

  editClick(item: Room) {
   // confirm('Are you sure????' + item.RoomName)
   this.modalReference = this.modal.open(this.exampleModal, { size: 'lg' });
    this.room = item;
    this.ModalTitle = "Edit Room";
    this.ActivateAddEditRoomComp = true;
  }

  deleteClick(item: Room) {
    if (confirm('Are you sure??')) {
      this.service.deleteRoom(item.RoomId).subscribe(() => {
        //alert(data.toString());
        this.refreshData();
      })
    }
  }

  closeClick() {
    this.ActivateAddEditRoomComp = false;
    this.refreshData();
  }



  sortResult(prop: any, asc: any) {
/*     this.RoomList = this.RoomListWithoutFilter.sort(function (a: any, b: any) {
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
      }
      else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
      }
    }); */
  }

  FilterFn() {
/*     debugger;
    var RoomIdFilter = this.RoomIdFilter;
      var RoomNameFilter = this.RoomNameFilter;

    this.RoomList = this.RoomListWithoutFilter.filter(
      function (el: any) {
        return el.RoomId.toString().toLowerCase().includes(
          RoomIdFilter.toString().trim().toLowerCase()
        ) &&
          el.RoomName.toString().toLowerCase().includes(
            RoomNameFilter.toString().trim().toLowerCase())
      }
    ); */
  }
}
