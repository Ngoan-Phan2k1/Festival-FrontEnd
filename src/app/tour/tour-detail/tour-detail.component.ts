import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tour } from '../tour.model';
import { DataStorageService } from '../data-storage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrencyPipe} from '@angular/common';
import { Observable, lastValueFrom } from 'rxjs';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { BookedTourService } from './booked-tour.service';
import { TourDetailService } from './tour-detail.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss']
})
export class TourDetailComponent implements OnInit {

  tour!: Tour
  id!: number
  touristId!: number
  isAuthenticated = false;
  tourCapacity = 1;
  isCapacityInvalid: boolean = false;


  constructor(
    private tourDetailService: TourDetailService,
    private bookedTourService: BookedTourService,
    private authService: AuthService,
    private modalService: NgbModal,
    private currencyPipe: CurrencyPipe,
    private dataService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);

    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, 
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.tourDetailService.tourdetailChanged.subscribe(
      (tour) => {
        this.tour = tour;
        this.dataService.downloadImageByName(this.tour.imageDTO.name).subscribe(
          (res) => {
            this.tour.url = res.url;
            // this.hotelService.setHotel(this.hotel);
            // this.url = res.url;
          }
        )
        Swal.close();
      }
    )

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.dataService.getTourById(this.id).subscribe(data => {
          this.tour = data;
          this.dataService.downloadImageByName(this.tour.imageDTO.name).subscribe(
            (res) => {
              this.tour.url = res.url;
              // this.hotelService.setHotel(this.hotel);
              // this.url = res.url;
            }
          )
        })
        Swal.close();
      }
    )

    this.tourDetailService.tourdetailChanged.subscribe(
      (tour) => {
        //console.log("Tour Detail Changed: ", tour);
        this.tour = tour;
      }
    )

    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      
      if (!!user) {
        this.touristId = user.touristId
      }
    })
  }

  checkInput(event: any) {

    const parsedValue = parseInt(event.target.value, 10);
    if (parsedValue < 1) {
      this.isCapacityInvalid = true;
    } else {
        this.isCapacityInvalid = false;
    }
    
  }

  formatPrice(price: number): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0') || '';
  }

  closeResult = '';
  open(content: any) {
    let isAuthenticated = false;

    // this.authService.user.subscribe(user => {
    //   isAuthenticated = !!user
    //   if (!isAuthenticated) {
    //     Swal.fire('Vui lòng đăng nhập để đặt tour')
    //     return;
    //   }
    //   else if (isAuthenticated) {
    //     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    //       (result) => {
    //         this.closeResult = `Closed with: ${result}`;
    //       },
    //       (reason) => {
    //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //       },
    //     );
    //   }
    // })

    if (!this.isAuthenticated) {
      Swal.fire('Vui lòng đăng nhập để đặt tour')
    }
    else if (this.isAuthenticated) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
		  );
    }


		// this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
		// 	(result) => {
		// 		this.closeResult = `Closed with: ${result}`;
		// 	},
		// 	(reason) => {
		// 		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		// 	},
		// );
	}

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  onSubmitBooked(form: NgForm) {

    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, 
      didOpen: () => {
        Swal.showLoading()
      }
    });

    if (!form.valid) {
      console.log("Form is not valid");
      return;
    }

    const booked = form.value.booked;
    const phone = form.value.phone;
    const tourId = this.tour.id;
    const touristId = this.touristId;

    let authObs: Observable<any>;
    authObs = this.bookedTourService.bookedTour(booked, phone, tourId, touristId);
    authObs.subscribe({
      next: (resData: any) => {
        //console.log(resData);
        Swal.close()
        Swal.fire({
          icon: 'success',
          title: 'Đặt tour thành công',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.modalService.dismissAll();
          form.reset();
        })

      },
      error: (errorMessage: any) => {
        //console.log("Đây là lỗi: ", errorMessage);
        //Swal.close()
        Swal.fire({
          icon: 'error',
          title: 'Đặt tour không thành công',
          text: errorMessage.message,
        })
      },
    });

  }

  checkLogin(tour_id: number) {
    // if (!this.isAuthenticated) {
    //   Swal.fire('Vui lòng đăng nhập để đặt tour');
    //   return;
    // }

    this.router.navigate(['book-tour', tour_id]);
  }

}
