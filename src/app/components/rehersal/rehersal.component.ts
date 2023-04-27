import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Rehersal}  from '../../models/rehersal';
import  RehersalService  from '../../services/rehersal.service';
import { Observable } from 'rxjs';
import {City}  from '../../models/city';
import  CityService  from '../../services/city.service';

@Component({
  selector: 'app-rehersal',
  templateUrl: './rehersal.component.html',
  styles: ['./rehersal.component.css']
})
export class RehersalComponent implements OnInit {

  constructor(private service: RehersalService, private modal: NgbModal, private cityService: CityService,) { }

    // Define ngModal as null for opening and closing the modal
  public modalReference = null;
  RehersalList: Observable<Rehersal[]>
  CityList: Observable<City[]>
  selectedCityValue: number
  ModalTitle = "ModalTitle";
  ActivateAddEditRehersalComp: boolean = false;
  rehersal: Rehersal;

  RehersalIdFilter = "";
  RehersalNameFilter = "";
  RehersalListWithoutFilter: Observable<Rehersal[]>;
  @ViewChild('exampleModal', { static: true }) exampleModal: TemplateRef<any>;
  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.cityService.getCityList().subscribe((data:any) => {
      this.CityList = data; 
      if (this.selectedCityValue==undefined)
      {
        this.selectedCityValue = this.CityList[0].CityID;
        console.log(this.selectedCityValue);
      }

      this.service.getRehersalByCityID(this.selectedCityValue).subscribe((data:any) => {
        this.RehersalList = data;
     
        });
     });
  }

  onDropdownChange(e){
    console.log(e);
    this.selectedCityValue =e; 
    this.refreshData();
  }
  addClick() {
    this.rehersal = {
        RehersalSpaseID: 0,
        RehersalSpaseName: "",
        CityID:0,
        Adress :""
    }
    this.ModalTitle = "Add Rehersal";
    this.ActivateAddEditRehersalComp = true;
    this.modalReference = this.modal.open(this.exampleModal, { size: 'lg' });
 
  }
  addRehersal(item: Rehersal) {
    var rehersal = {
        RehersalSpaseID: item.RehersalSpaseID,
        RehersalSpaseName: item.RehersalSpaseName,
      CityID: this.selectedCityValue,
      Adress: item.Adress
    };
    this.service.addRehersal(rehersal).subscribe();
    this.modalReference.close();
    this.refreshData();
  }
  updateRehersal(item: Rehersal) {
    var rehersal = {
        RehersalSpaseID: item.RehersalSpaseID,
        RehersalSpaseName: item.RehersalSpaseName,
      CityID: this.selectedCityValue,
      Adress: item.Adress
    };
    this.service.updateRehersal(rehersal).subscribe();
    this.modalReference.close();
    this.refreshData();
  }

  editClick(item: Rehersal) {
   // confirm('Are you sure????' + item.RehersalName)
   this.modalReference = this.modal.open(this.exampleModal, { size: 'lg' });
    this.rehersal = item;
    this.ModalTitle = "Edit Rehersal";
    this.ActivateAddEditRehersalComp = true;
  }

  deleteClick(item: Rehersal) {
    if (confirm('Are you sure??')) {
      this.service.deleteRehersal(item.RehersalSpaseID).subscribe(() => {
        //alert(data.toString());
        this.refreshData();
      })
    }
  }

  closeClick() {
    this.ActivateAddEditRehersalComp = false;
    this.refreshData();
  }



  sortResult(prop: any, asc: any) {
/*     this.RehersalList = this.RehersalListWithoutFilter.sort(function (a: any, b: any) {
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
    var RehersalIdFilter = this.RehersalIdFilter;
      var RehersalNameFilter = this.RehersalNameFilter;

    this.RehersalList = this.RehersalListWithoutFilter.filter(
      function (el: any) {
        return el.RehersalId.toString().toLowerCase().includes(
          RehersalIdFilter.toString().trim().toLowerCase()
        ) &&
          el.RehersalName.toString().toLowerCase().includes(
            RehersalNameFilter.toString().trim().toLowerCase())
      }
    ); */
  }
}
