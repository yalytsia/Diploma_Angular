import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { CalendarService } from 'src/app/services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { Room } from 'src/app/models/room';
import { Customer } from 'src/app/models/customer';
import { ActivatedRoute, Router } from '@angular/router';

declare var paypal;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  reservation: Reservation;
  room: Room;
  customer: Customer;

  constructor(private calendarService: CalendarService, private toastrService: ToastrService, private router: Router) {
    this.reservation = JSON.parse(localStorage.getItem('reservation'));
    this.room = JSON.parse(localStorage.getItem('room'));
  }

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "Room: " + this.room.RehersalRoomName,
                amount: {
                  currency_code: 'USD',
                  value: this.reservation.Total
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.calendarService.createReservation(this.reservation).subscribe(
            () => {
              this.toastrService.success("Успішна оплата!");
              this.router.navigate(['/room/' + this.room.PathURL]);
            },
            (error) => {
              this.toastrService.error("Саталася помилка під час оплати!");
            })

        },
        onError: err => {
          this.toastrService.error(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}

