import { Component, OnInit } from '@angular/core';
import { CurrencyPipe} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DataStorageService } from '../tour/data-storage.service';
import { BookedTourResponse } from './booked-tour-response.model';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Hotel } from '../hotel/hotel.model';
import { Contact } from '../hotel/contact-form/contact.model';

@Component({
  selector: 'app-booked-tour',
  templateUrl: './booked-tour.component.html',
  styleUrls: ['./booked-tour.component.scss']
})
export class BookedTourComponent implements OnInit {

  // bookedTours: BookedTourResponse[] = [];
  bookedTours: any[];
  tourist_id: number;
  selectedVNPay: boolean = false;
  amount: number;
  selectedBookedtourId: number;
  hotels: Hotel[] = [];
  contacts: Contact[] = []; 
  

  constructor(
    private modalCheckout: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dataStorageService: DataStorageService, 
    private currencyPipe: CurrencyPipe 
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const userData: {
      fullname: string;
      touristId: number;
      username: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    this.tourist_id = userData.touristId;

    this.dataStorageService.getToursByTouristId(this.tourist_id, "something").subscribe((data) => {
      this.bookedTours = data;
    });

    this.dataStorageService.getContactByTouristId(this.tourist_id).subscribe(
      (contacts) => {
        this.contacts = contacts;
        this.contacts.map(contact => {
          this.dataStorageService.getHotelById(contact.roomDTO.hotel_id).subscribe(
            (hotel) => {
              this.hotels.push(hotel);
            }
          )
        })
      }
    )



  }

  // checkout(booked_id: number) {
  //   this.dataStorageService.checkout(booked_id).subscribe((data) => {
  //     window.location.href = data.url;
  //     //const queryParams = new URLSearchParams(window.location.search);
  //   })
  // }


  closeResult = '';
  openCheckout(content: any, bookedtourId: number, amount: number, isCheckout: boolean) {
    if (isCheckout) {
      Swal.fire('Bạn đã thanh toán tour này');
      return;
    }

    this.selectedBookedtourId = bookedtourId;
    this.amount = amount;

		this.modalCheckout.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
        this.selectedVNPay = false;
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
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


  onSubmitCheckout(form: NgForm) {
    //console.log("form: ", this.selectedOption);
  }


  handleCheckout() {

    if (this.selectedVNPay) {
      const amount =  this.amount.toString();
      const params = new HttpParams()
        .set('amount', amount)
        .set('bookedtourId', this.selectedBookedtourId);

      this.dataStorageService.checkout(params).subscribe((data) => {
        window.location.href = data.url;
        //const queryParams = new URLSearchParams(window.location.search);
      })
    }
    
    this.selectedVNPay = false;
    this.modalCheckout.dismissAll()
  }

  onCancleBooked(bookedtourId: number, isCheckout: boolean) {

    if (isCheckout) {
      Swal.fire(
        'Không thể hủy tour',
        'Bạn không thể hủy tour đã thanh toán',
        'info'
      )
      return;
    }

    Swal.fire({
      title: 'Bạn chắc muốn hủy tour này ?',
      //text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận hủy đặt'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Loading...',
          html: 'Please wait',
          allowOutsideClick: false, 
          didOpen: () => {
            Swal.showLoading()
          }
        });

        this.dataStorageService.removeBookedTour(bookedtourId, this.tourist_id).subscribe(
          (data) => {
            this.bookedTours = data;
            Swal.close();
            Swal.fire(
              'Hoàn tất',
              'Đã hủy đặt tour thành công.',
              'success'
            )
          }
        )
      }
    })
  }


  onCancleContact(id: number) {
    Swal.fire({
      title: 'Quý khách chắc muốn hủy yêu cầu này ?',
      //text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận hủy'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Loading...',
          html: 'Please wait',
          allowOutsideClick: false, 
          didOpen: () => {
            Swal.showLoading()
          }
        });

        this.dataStorageService.deleteContact(id, this.tourist_id).subscribe(
          (data) => {
            this.contacts = data
            this.contacts.map(contact => {
              this.dataStorageService.getHotelById(contact.roomDTO.hotel_id).subscribe(
                (hotel) => {
                  this.hotels.push(hotel);
                }
              )
            })

            Swal.close();
            Swal.fire(
              'Hoàn tất',
              'Đã hủy yêu cầu thành công',
              'success'
            )
          }
        )
      }
    })

  }

}
