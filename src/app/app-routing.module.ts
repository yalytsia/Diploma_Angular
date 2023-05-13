import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShowCityComponent } from './components/city/show-city/show-city.component';
import { RehersalComponent } from './components/rehersal/rehersal.component';
import { RoomComponent } from './components/room/room.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { MyReservationsComponent } from './components/my-reservations/my-reservations.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'show-city', component: ShowCityComponent },
   { path: 'rehersal', component: RehersalComponent },
   { path: 'room', component: RoomComponent },
 { path: 'room/:pathURL', component: CalendarComponent },
  { path: 'room/:pathURL/reservation/:id', component: ReservationDetailComponent },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuardService]},
  { path: 'my-reservations', component: MyReservationsComponent, canActivate: [AuthGuardService]},
  { path: 'my-reservations/room/:pathURL/reservation/:id', component: ReservationDetailComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

