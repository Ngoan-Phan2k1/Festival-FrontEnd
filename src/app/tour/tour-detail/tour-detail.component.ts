import { Component, OnInit } from '@angular/core';
import { Tour } from '../tour.model';
import { DataStorageService } from '../data-storage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss']
})
export class TourDetailComponent implements OnInit {

  tour!: Tour
  id!: number


  constructor(
    private currencyPipe: CurrencyPipe,
    private dataService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        //this.recipe = this.recipeService.getRecipe(this.id);
        //console.log(this.dataService.getTourById(this.id))
        this.dataService.getTourById(this.id).subscribe(data => {
          this.tour = data;
        })
      }
  )
  }

  formatPrice(price: number): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0') || '';
  }

}
