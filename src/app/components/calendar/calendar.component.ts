import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Router } from '@angular/router'
import { Room } from 'src/app/models/room';
import { CalendarService } from 'src/app/services/calendar.service';
import { Customer } from 'src/app/models/customer';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from 'src/app/models/reservation';
import { CalendarConfig } from 'src/app/calendar-config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  // Define form data for submitting the reservation
  public reservationForm: any;

  // Define ngModal as null for opening and closing the modal
  public modalReference = null;

  // Get customer info and assign to customer obj
  public customer: Customer;

  // It saves the event as reservation before proceeding with the payment
  public event: any;

  // It maintains a list of calendar events
  public events: CalendarEvent[] = [];

  // Maintain room data 
  public room: Room;

  // Define boolean types for the following buttons
  public showReservationDetail: boolean = false;
  public showCreateEventBtn: boolean = true;
  public showUpdateEventBtn: boolean = false;
  public showDeleteEventBtn: boolean = false;
  public disabledReserveNowBtn: boolean = true;

  // Define ngui datetime picker attributes
  public start: Date = new Date();
  public end: Date = new Date();
  public currentDate = new Date();
  public minHour: number;
  public maxHour: number;
  public minuteStep: number;

  // Define duration
  public duration: number;

  // Define total price 
  public total: number;

  // Define submitType
  public submitType = 'Створити'
  public showNew: Boolean = true;
  public titleReservation: string;
  // Set values into reservation to proceeed with Reserve Now button 
  public reservation: Reservation;

  // Search reservations by title
  searchTerm$ = new Subject<string>();

  // Angular Bootstrap Calendar 6+
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  constructor(private modal: NgbModal,
    private router: Router,
    private calendarService: CalendarService,
    private toastrService: ToastrService,
    private calendarConfig: CalendarConfig) {

    this.room = JSON.parse(localStorage.getItem('room'));
    this.customer = JSON.parse(localStorage.getItem('customer'))

    this.minHour = Number(this.room.StartProgram);
    this.maxHour = Number(this.room.EndProgram);
    this.minuteStep = 15;
  }

  ngOnInit() {
    this.loadReservations();
    this.setDefaultForm();
    this.search();
  }

  loadReservations() {
    console.log(this.room);
     this.calendarService.getCalendarReservations(this.room.RoomId).subscribe(
      (data: CalendarEvent[]) => {
        this.events = data;
        this.events.forEach(event => {
          event.start = new Date(event.start),
          event.end = new Date(event.end)
          event.color = this.calendarConfig.colors.green;
        });
      });
  }

  setDefaultForm() {
    // Set default reservation form
    if (localStorage.getItem('customer') !== null) {
      this.reservationForm = {
        id: Math.floor(100000 + Math.random() * 900000),
        start: null,
        end: null,
        title: this.titleReservation,
        total: 0,
        customerID: null,
        roomId: this.room.RoomId,
        primaryColor: '#37D822',
        secondaryColor: '#e8fde7'
      }
    } else {
      this.modalReference = null;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getStartTimeSelection(val) {
    this.start = val;
  }

  getEndTimeSelection(val) {
    this.end = val;
    this.updateTotal();
  }

  updateTotal() {

    // Perform calculation difference between end and start time
    let diff = this.end.valueOf() - this.start.valueOf();
    console.log("this.end.valueOf() " + JSON.stringify(this.end.valueOf()));
    console.log("this.start.valueOf() " + JSON.stringify(this.start.valueOf()));
    console.log("diff " + JSON.stringify(diff));
    // Convert milliseconds to hours
    let timeSelection = (diff / 1000 / 60 / 60);

    // Round up the time selection
    let roundTimeSelection = (Math.round(timeSelection * 100) / 100);

    // Assign the roundTimeSelection to duration variable
    this.duration = roundTimeSelection;
    this.titleReservation = this.reservationForm.title;
    // Perform total price using start and end time
    this.reservationForm.total = (this.room.PriceHour * roundTimeSelection).toFixed(2);
    this.total = this.reservationForm.total;
  }

  onCreate() {
    // Check if customer authenticated
    if (localStorage.getItem('customer') === null) {
      this.toastrService.error('Authentication Required!');
    }
    else {
      this.showNew = true;
      this.modalReference = this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  onDelete() {
    this.events = this.events.filter(x => x.id !== this.event.id);
    this.showCreateEventBtn = true;
    this.showDeleteEventBtn = false;
    this.showUpdateEventBtn = false;
    this.disabledReserveNowBtn = true;
    this.showReservationDetail = false;
    this.submitType = 'Створити';
    this.toastrService.success("Reservation successfully deleted!");
  }

  onUpdate() {
    this.submitType = 'Оновити';
    this.modalReference = this.modal.open(this.modalContent, { size: 'lg' });
    this.showNew = true;
  }

  eventClicked({ event }: { event: any }): void {
      let data = {
        id: event.id,
        startProgram: this.minHour,
        endProgram: this.maxHour,
        start: event.start,
        end: event.end
      };
      localStorage.setItem('attr', JSON.stringify(data))
      this.router.navigate(['/room/' + this.room.PathURL + '/reservation/' + event.id]);
  }


  search() {
    this.calendarService.search(this.searchTerm$, this.room.RoomId).subscribe(
      (data: any[]) => {
        this.events = data;
        this.events.forEach(event => {
          event.start = new Date(event.start),
            event.end = new Date(event.end)
          event.color = this.calendarConfig.colors.green;
        });
      });
  }

  onSubmit() {
    if (this.submitType === 'Створити') {

      this.reservation = new Reservation();

      // Proceed with CREATE operation
      // 1.Validation Condition 1: The new event starts during the existing event
      // 2.Validation Condition 2: The new event ends during the existing event
      // 3. Validation for reservations created before current hour and date
      let exists = this.events.some(event =>
        (this.start >= event.start) && (this.start <= event.end) || (this.end >= event.start) && (this.end <= event.end));

      if (exists) {
        this.toastrService.error("Інша бронь була зроблена на цей час!");
        this.showUpdateEventBtn = false;
        this.showDeleteEventBtn = false;
        this.showCreateEventBtn = true;
      } else if (this.start < this.currentDate) {
        this.toastrService.error("Ви не можете створити бронь в минулому часі!");
      } else if (this.total < 0) {
        this.toastrService.error("Ви не можете створити бронь з сумою менше 0!");
      } else if (this.duration < 1) {
        this.toastrService.error("Вибачте, мінімальний час броні - 1 година!");
      } else {

        // Create a reservation temporary
        this.event = {
          id: this.reservationForm.id,
          start: new Date(this.start.toLocaleString()),
          end: new Date(this.end.toLocaleString()),
          title: this.reservationForm.title,
          color: this.calendarConfig.colors.green
        };

        this.events = this.events.concat(this.event);
      
        this.reservation.Id = this.reservationForm.id
        this.reservation.CustomerId = this.customer.CustomerId;
        this.reservation.RoomId = this.room.RoomId;
        this.reservation.Start = this.start.toLocaleString();
        this.reservation.End = this.end.toLocaleString();
        this.reservation.Title = this.reservationForm.title;
        this.titleReservation = this.reservationForm.title;
        this.reservation.Total = this.reservationForm.total;

        this.reservation.PrimaryColor = this.reservationForm.primaryColor;
        this.reservation.SecondaryColor = this.reservationForm.secondaryColor;

        localStorage.setItem('reservation', JSON.stringify(this.reservation));

        this.toastrService.success("Тимчасова бронь створена!");
        this.modalReference.close();
        this.showDeleteEventBtn = true;
        this.showUpdateEventBtn = true;
        this.showReservationDetail = true;
        this.showCreateEventBtn = false;
        this.disabledReserveNowBtn = false;
      }

    } else {

      // Proceed with UPDATE operation
      // 1. Validation for updating reservation with negative balance
      // 2. Validation for updating reservation for less than 1 hour
      if (this.total < 0) {
        this.toastrService.error("Ви не можете створити бронь з сумою менше 0!");
      }
      else if (this.duration < 1) {
        this.toastrService.error("Вибачте, мінімальний час броні - 1 година!");
      } else {
        
        
        this.events = this.events.map(event => {
          if (event.id == this.event.id) {
            return {
              ...event,
              start: new Date(this.start.toLocaleString()),
              end: new Date(this.end.toLocaleString()),
              title: this.reservationForm.title,
              color: this.calendarConfig.colors.green
            };
          }
          return event;
        });
        
      
        this.reservation.Id = this.reservationForm.reservationNo;
        this.reservation.CustomerId = this.customer.CustomerId;
        this.reservation.RoomId = this.room.RoomId;
        this.reservation.Start = this.start.toLocaleString();
        this.reservation.End = this.end.toLocaleString();
        this.reservation.Title = this.reservationForm.title;

        this.reservation.Total = this.reservationForm.total;

        this.reservation.PrimaryColor = this.reservationForm.primaryColor;
        this.reservation.SecondaryColor = this.reservationForm.secondaryColor;

        localStorage.setItem('reservation', JSON.stringify(this.reservation));

        this.modalReference.close();
        this.showDeleteEventBtn = true;
        this.showUpdateEventBtn = true;
        this.showReservationDetail = true;
        this.showCreateEventBtn = false;
        this.disabledReserveNowBtn = false;
      }
    }
  }

  reserveNow() {
    this.disabledReserveNowBtn = true;
    this.showCreateEventBtn = true;
    this.showDeleteEventBtn = false;
    this.showUpdateEventBtn = false;
    this.showReservationDetail = false;
    this.router.navigate(['/payment']);
  }
}
