import { Component, OnInit } from '@angular/core';
import { Hotel } from './hotel.model';
import { DataStorageService } from '../tour/data-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {

  hotels: Hotel[] = [];

  constructor(
    private dataService: DataStorageService
  ) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Swal.fire({
    //   title: 'Loading...',
    //   html: 'Please wait',
    //   allowOutsideClick: false, 
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    if (this.hotels.length === 0) {
      Swal.fire({
        title: 'Loading...',
        html: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });
    }

    this.dataService.fetchHotels().subscribe(
      (data) => {
        this.hotels = data;
        for (const hotel of this.hotels) {
          this.dataService.downloadImageByName(hotel.imageDTO.name).subscribe(
            (res) => {
              hotel.url = res.url;
            }
          )
        }
        Swal.close()
      }
    )

  }

}
