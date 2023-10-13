import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataStorageService } from 'src/app/tour/data-storage.service';
import { HotelService } from '../hotel.service';
import { Hotel } from '../hotel.model';

@Component({
  selector: 'app-tquan',
  templateUrl: './tquan.component.html',
  styleUrls: ['./tquan.component.scss']
})
export class TquanComponent implements OnInit {

  hotel: Hotel;

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private dataService: DataStorageService
  ) {

  }

  ngOnInit(): void {
    this.hotel = this.hotelService.getHotel();
    this.route.params
    .subscribe(
      (params: Params) => {
        this.hotelService.hotelChanged.subscribe(
          (data) => {
            this.hotel = data;
          }
        )
      }
    )
  }
}
