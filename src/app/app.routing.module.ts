import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { HomePageComponent } from './home-page/home-page.component';
import { TourComponent } from './tour/tour.component';
import { TourDetailComponent } from './tour/tour-detail/tour-detail.component';
import { BookedTourComponent } from './booked-tour/booked-tour.component';
import { VnpayReturnComponent } from './vnpay-return/vnpay-return.component';
import { HotelComponent } from './hotel/hotel.component';
import { HotelDetailComponent } from './hotel/hotel-detail/hotel-detail.component';
import { TquanComponent } from './hotel/tquan/tquan.component';
import { HotelRoomComponent } from './hotel/hotel-room/hotel-room.component';
import { ContactFormComponent } from './hotel/contact-form/contact-form.component';
import { FestivalComponent } from './festival/festival.component';
import { FestivalDetailComponent } from './festival/festival-detail/festival-detail.component';
import { BookTourComponent } from './book-tour/book-tour.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component:  HomePageComponent },
    { path: 'tour', component:  TourComponent },
    { path: 'hotel', component:  HotelComponent},
    { path: 'festival', component: FestivalComponent},
    { path: 'booked-tour', component:  BookedTourComponent },
    { path: 'book-tour', component:  BookTourComponent },
    { path: 'vnpay_return', component:  VnpayReturnComponent },
    { path: 'festival/detail', component: FestivalDetailComponent},
    { path: 'hotel/detail', component:  HotelDetailComponent,
        children: [
            {path: '', component: TquanComponent},
            // { path: 'tquan', component:  TquanComponent },
            { path: 'room', component:  HotelRoomComponent },
        ]
    },
    { path: 'contact-form/:id', component:  ContactFormComponent },
    { path: 'tour/:id', component:  TourDetailComponent },
    { path: 'hotel/:id', component:  HotelDetailComponent,
        children: [
            {path: '', component: TquanComponent},
            { path: 'tquan', component:  TquanComponent },
            { path: 'room', component:  HotelRoomComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})
export class AppRoutingModule {

}

// children: [
        //     {path: 'test', component: TourDetailComponent},
        // ]