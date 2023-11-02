import { Component, Input, OnInit } from '@angular/core';
import { DataStorageService } from '../../data-storage.service';
import { Schedule } from './schedule.model';

@Component({
  selector: 'app-tour-schedule',
  templateUrl: './tour-schedule.component.html',
  styleUrls: ['./tour-schedule.component.scss']
})
export class TourScheduleComponent implements OnInit {

  @Input('tour_id') id : number;
  schedules: Schedule[] = [];
  test = false;

  constructor(
    //private tourDetailService: TourDetailService,
    // private bookedTourService: BookedTourService,
    // private authService: AuthService,
    // private modalService: NgbModal,
    // private currencyPipe: CurrencyPipe,
    private dataService: DataStorageService,
    // private route: ActivatedRoute,
    // private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getScheduleByTourId(this.id).subscribe(
      (schedules) => {
        this.schedules = schedules;
        for (const schedule of this.schedules) {
          this.dataService.downloadImageByName(schedule?.imageDTO?.name).subscribe(
            (res) => {
              schedule.url = res.url;
            }
          )
        }
      } 
    )
  }
}
