import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HomePageComponent } from './home-page/home-page.component';
import { FeedbackSlideComponent } from './home-page/feedback-slide/feedback-slide.component';
import { FooterComponent } from './footer/footer.component';
import { TourComponent } from './tour/tour.component';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { TourDetailComponent } from './tour/tour-detail/tour-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookedTourComponent } from './booked-tour/booked-tour.component';
import { VnpayReturnComponent } from './vnpay-return/vnpay-return.component';
import { HotelComponent } from './hotel/hotel.component';
import { HotelDetailComponent } from './hotel/hotel-detail/hotel-detail.component';
import { TquanComponent } from './hotel/tquan/tquan.component';
import { HotelRoomComponent } from './hotel/hotel-room/hotel-room.component';
import { ContactFormComponent } from './hotel/contact-form/contact-form.component';
import { TourScheduleComponent } from './tour/tour-detail/tour-schedule/tour-schedule.component';
import { FestivalComponent } from './festival/festival.component';
import { FestivalDetailComponent } from './festival/festival-detail/festival-detail.component';
import { BookTourComponent } from './book-tour/book-tour.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    HeaderComponent,
    FeedbackSlideComponent,
    FooterComponent,
    TourComponent,
    TourDetailComponent,
    BookedTourComponent,
    VnpayReturnComponent,
    HotelComponent,
    HotelDetailComponent,
    TquanComponent,
    HotelRoomComponent,
    ContactFormComponent,
    TourScheduleComponent,
    FestivalComponent,
    FestivalDetailComponent,
    BookTourComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule,
    MatIconModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    CurrencyPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
