import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {

  customer: Customer;
  reservations: any[] = [];

  constructor(private _customerService: CustomerService, private router: Router) {
    this.customer = JSON.parse(localStorage.getItem('customer'))
   }

  ngOnInit() {
    this.getMyReservations();
  }

  getMyReservations() {
    this._customerService.getCustomerReservations(this.customer.CustomerId).subscribe(
      (reservations) => {
        this.reservations = reservations;
      }
    )
  }

  redirectToCalendar(reservation: any) {
    let data = {
      id: reservation.Id,
      startProgram: reservation.StartProgram,
      endProgram: reservation.EndProgram,
      start: reservation.Start,
      end: reservation.End
    };

    console.log("redirect to calendar: " + JSON.stringify(reservation));
    localStorage.setItem('attr', JSON.stringify(data))
    this.router.navigate(['/my-reservations/room/' + reservation.Path + "/reservation/" + reservation.Id]);
  }

}
