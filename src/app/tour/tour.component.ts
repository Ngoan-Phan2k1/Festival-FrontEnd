import { Component, OnInit } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { CurrencyPipe} from '@angular/common';
import { Tour } from './tour.model';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  tours: Tour[] = [];
  constructor(private dataStorageService: DataStorageService, private currencyPipe: CurrencyPipe ) {}

  ngOnInit(): void {
    this.dataStorageService.fetchTours().subscribe(data => {
      this.tours = data
      //console.log(this.tours)

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
