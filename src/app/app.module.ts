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



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    HeaderComponent,
    FeedbackSlideComponent,
    FooterComponent,
    TourComponent,
    TourDetailComponent
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
