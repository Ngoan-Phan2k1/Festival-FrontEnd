import { Component, OnInit } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { CurrencyPipe} from '@angular/common';
import { Tour } from './tour.model';
import { Router, NavigationEnd } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  tours: Tour[] = [];
  constructor(
    private router: Router,
    private dataStorageService: DataStorageService, 
    private currencyPipe: CurrencyPipe ) {

      // this.router.events.subscribe((event) => {
      //   if (event instanceof NavigationEnd) {
      //     window.scrollTo(-100, -100);
      //   }
      // });
    }

  ngOnInit(): void {
    //window.scrollTo(0, 0);
    // window.scroll({ 
    //   top: 0, 
    //   left: 0, 
    //   behavior: 'smooth' 
    // });
    
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, 
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.dataStorageService.fetchTours().subscribe(data => {
      this.tours = data;
      for (const tour of this.tours) {
        this.dataStorageService.downloadImageByName(tour.imageDTO.name).subscribe(
          (res) => {
            tour.url = res.url;
          }
        )
      }
      Swal.close()
    });
  }

  // formatPrice(price: number): string {
  //   const formattedPrice = this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0');
  //   if (formattedPrice) {
  //     return formattedPrice.replace('₫', '') + ' đ';
  //   }
  //   return '';
  // }

  formatPrice(price: any): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0') || '';
  }
  
}
