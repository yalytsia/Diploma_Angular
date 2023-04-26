import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {City}  from '../../../models/city';
import  CityService  from '../../../services/city.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-city',
  templateUrl: './show-city.component.html',
  styles: ['./show-city.component.css']
})
export class ShowCityComponent implements OnInit {

  constructor(private service: CityService, private modal: NgbModal,) { }

    // Define ngModal as null for opening and closing the modal
  public modalReference = null;
  CityList: Observable<City[]>
  ModalTitle = "ModalTitle";
  ActivateAddEditCityComp: boolean = false;
  city: City;

  CityIdFilter = "";
  CityNameFilter = "";
  CityListWithoutFilter: Observable<City[]>;
  @ViewChild('exampleModal', { static: true }) exampleModal: TemplateRef<any>;
  ngOnInit(): void {
    this.refreshCityList();
  }

  addClick() {
    this.city = {
      CityID: 0,
      CityName: ""
    }
    this.ModalTitle = "Add City";
    this.ActivateAddEditCityComp = true;
    this.modalReference = this.modal.open(this.exampleModal, { size: 'lg' });
 
  }
  addCity(item: City) {
    var city = {
      CityID: item.CityID,
      CityName: item.CityName
    };
    this.service.addCity(city).subscribe();
    this.modalReference.close();
    this.refreshCityList();
  }
  updateCity(item: City) {
    var city = {
      CityID: item.CityID,
      CityName: item.CityName
    };
    this.service.updateCity(city).subscribe();
    this.modalReference.close();
    this.refreshCityList();
  }

  editClick(item: City) {
   // confirm('Are you sure????' + item.CityName)
   this.modalReference = this.modal.open(this.exampleModal, { size: 'lg' });
    this.city = item;
    this.ModalTitle = "Edit City";
    this.ActivateAddEditCityComp = true;
  }

  deleteClick(item: City) {
    if (confirm('Are you sure??')) {
      this.service.deleteCity(item.CityID).subscribe(() => {
        //alert(data.toString());
        this.refreshCityList();
      })
    }
  }

  closeClick() {
    this.ActivateAddEditCityComp = false;
    this.refreshCityList();
  }


  refreshCityList() {
    this.service.getCityList().subscribe((data:any) => {
      console.log("Result: city " + JSON.stringify(data));
      this.CityList = data;
      this.CityListWithoutFilter = data;
    });
  }

  sortResult(prop: any, asc: any) {
/*     this.CityList = this.CityListWithoutFilter.sort(function (a: any, b: any) {
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
    var CityIdFilter = this.CityIdFilter;
      var CityNameFilter = this.CityNameFilter;

    this.CityList = this.CityListWithoutFilter.filter(
      function (el: any) {
        return el.CityId.toString().toLowerCase().includes(
          CityIdFilter.toString().trim().toLowerCase()
        ) &&
          el.CityName.toString().toLowerCase().includes(
            CityNameFilter.toString().trim().toLowerCase())
      }
    ); */
  }
}
