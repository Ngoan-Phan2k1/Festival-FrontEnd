import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort} from "@angular/material/sort";
import { UserService } from '../user.service';
import { DataStorageService } from 'src/app/tour/data-storage.service';
import { OrderTour } from './order-tour.model';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';


export interface PeriodicElement {
  action: string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface tabel_tour {
  booked_id: number;
  name: string;
  priceAdult: number;
  priceChild: number;
  priceBaby: number;
  bookedAdult: number;
  bookedChild: number;
  bookedBaby: number;
  description: string;
  fromDate: string;
  toDate: string;
  fromWhere: string;
  toWhere: string;
  fullname: string;
  email: string;
  address: string;
  note: string;
  num_room: number;
  phone: string;
  hotel: string;
  room: string;
  priceRoom: number;
  total: number;
  checkout: boolean;
  tour_url: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', action:''},
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', action:''},
  //{action:'', position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  // {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  // {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  // {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  // {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  // {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  // {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action' ];
  displayedColumns: string[] = ['tour', 'total', 'status', 'action'];
  //dataSource = ELEMENT_DATA;
  tabel_tour: tabel_tour[] = [];
  dataSource = new MatTableDataSource<tabel_tour>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  tourist_id: number;
  selectedVNPay: boolean = false;
  amount: number;
  booked_id: number;

  constructor(
    private modalCheckout: NgbModal,
    private userService: UserService,
    private dataService: DataStorageService,
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


    this.dataService.getToursByTouristId(this.userService.getUser()?.id, 'token').subscribe(
      (bookeds) => {
        bookeds.forEach((booked: OrderTour, i) => {
          const total =
          (booked?.bookedAdult || 0) * (booked?.tourDto?.priceAdult || 0) +
          (booked?.bookedChild || 0) * (booked?.tourDto?.priceChild || 0) +
          (booked?.bookedBaby || 0) * (booked?.tourDto?.priceBaby || 0) +
          ((booked?.roomDtO?.price || 0) * booked.num_room);

          this.tabel_tour.push({
            booked_id: booked?.booked_id,
            name: booked?.tourDto?.name,
            priceAdult: booked?.tourDto?.priceAdult,
            priceChild: booked?.tourDto?.priceChild,
            priceBaby: booked?.tourDto?.priceBaby,
            bookedAdult: booked?.bookedAdult,
            bookedChild: booked?.bookedChild,
            bookedBaby: booked?.bookedBaby,
            description: booked?.tourDto?.description,
            fromDate: booked?.tourDto?.fromDate,
            toDate: booked?.tourDto?.toDate,
            fromWhere: booked?.tourDto?.fromWhere,
            toWhere: booked?.tourDto?.toWhere,
            fullname: booked?.fullname,
            email: booked?.email,
            address: booked?.address,
            note: booked?.note,
            num_room: booked?.num_room,
            phone: booked?.phone,
            hotel: booked?.roomDtO?.hotelDTO?.name,
            room: booked?.roomDtO?.name,
            priceRoom: booked?.roomDtO?.price,
            total: total,
            checkout: booked?.checkout,
            tour_url: ''
          })

          this.dataService.downloadImageByName(booked?.tourDto?.imageDTO?.name).subscribe(
            (res) => {
              this.tabel_tour[i].tour_url = res?.url;
            }
          )

        })

        this.dataSource = new MatTableDataSource<tabel_tour>(this.tabel_tour);
        this.dataSource.paginator = this.paginator;
        Swal.close();
      }
    )
      
    // this.userService.userChanged.subscribe(
    //   (user) => {
    //     this.tourist_id = user.id;
    //     //Swal.close();
    //     this.dataService.getToursByTouristId(this.tourist_id, 'token').subscribe(
    //       (bookeds) => {
    //         bookeds.forEach((booked: OrderTour, i) => {
    //           const total =
    //           (booked?.bookedAdult || 0) * (booked?.tourDto?.priceAdult || 0) +
    //           (booked?.bookedChild || 0) * (booked?.tourDto?.priceChild || 0) +
    //           (booked?.bookedBaby || 0) * (booked?.tourDto?.priceBaby || 0) +
    //           (booked?.roomDtO?.price || 0);
    
    //           this.tabel_tour.push({
    //             booked_id: booked?.booked_id,
    //             name: booked?.tourDto?.name,
    //             priceAdult: booked?.tourDto?.priceAdult,
    //             priceChild: booked?.tourDto?.priceChild,
    //             priceBaby: booked?.tourDto?.priceBaby,
    //             bookedAdult: booked?.bookedAdult,
    //             bookedChild: booked?.bookedChild,
    //             bookedBaby: booked?.bookedBaby,
    //             description: booked?.tourDto?.description,
    //             fromDate: booked?.tourDto?.fromDate,
    //             toDate: booked?.tourDto?.toDate,
    //             fromWhere: booked?.tourDto?.fromWhere,
    //             toWhere: booked?.tourDto?.toWhere,
    //             fullname: booked?.fullname,
    //             email: booked?.email,
    //             address: booked?.address,
    //             note: booked?.note,
    //             phone: booked?.phone,
    //             hotel: booked?.roomDtO?.hotelDTO?.name,
    //             room: booked?.roomDtO?.name,
    //             priceRoom: booked?.roomDtO?.price,
    //             total: total,
    //             checkout: booked?.checkout,
    //             tour_url: ''
    //           })
    
    //           this.dataService.downloadImageByName(booked?.tourDto?.imageDTO?.name).subscribe(
    //             (res) => {
    //               this.tabel_tour[i].tour_url = res?.url;
    //             }
    //           )
    
    //         })

    //         this.dataSource = new MatTableDataSource<tabel_tour>(this.tabel_tour);
    //         this.dataSource.paginator = this.paginator;
    //         //Swal.close();
    //       }
    //     )

    //     //Swal.close();
    //   }
    // )

  }

  handleCheckout() {

    if (this.selectedVNPay) {
      const amount =  this.amount.toString();
      const params = new HttpParams()
        .set('amount', amount)
        .set('bookedtourId', this.booked_id);

      this.dataService.checkout(params).subscribe((data) => {
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

        this.dataService.removeBookedTour(bookedtourId, this.userService.getUser()?.id).subscribe(
          (bookeds) => {
            this.tabel_tour = [];
            bookeds.forEach((booked: OrderTour, i) => {
              const total =
              (booked?.bookedAdult || 0) * (booked?.tourDto?.priceAdult || 0) +
              (booked?.bookedChild || 0) * (booked?.tourDto?.priceChild || 0) +
              (booked?.bookedBaby || 0) * (booked?.tourDto?.priceBaby || 0) +
              (booked?.roomDtO?.price || 0);
    
              this.tabel_tour.push({
                booked_id: booked?.booked_id,
                name: booked?.tourDto?.name,
                priceAdult: booked?.tourDto?.priceAdult,
                priceChild: booked?.tourDto?.priceChild,
                priceBaby: booked?.tourDto?.priceBaby,
                bookedAdult: booked?.bookedAdult,
                bookedChild: booked?.bookedChild,
                bookedBaby: booked?.bookedBaby,
                description: booked?.tourDto?.description,
                fromDate: booked?.tourDto?.fromDate,
                toDate: booked?.tourDto?.toDate,
                fromWhere: booked?.tourDto?.fromWhere,
                toWhere: booked?.tourDto?.toWhere,
                fullname: booked?.fullname,
                email: booked?.email,
                address: booked?.address,
                note: booked?.note,
                num_room: booked?.num_room,
                phone: booked?.phone,
                hotel: booked?.roomDtO?.hotelDTO?.name,
                room: booked?.roomDtO?.name,
                priceRoom: booked?.roomDtO?.price,
                total: total,
                checkout: booked?.checkout,
                tour_url: ''
              })
    
              this.dataService.downloadImageByName(booked?.tourDto?.imageDTO?.name).subscribe(
                (res) => {
                  this.tabel_tour[i].tour_url = res?.url;
                }
              )
    
            })

            this.dataSource = new MatTableDataSource<tabel_tour>(this.tabel_tour);
            this.dataSource.paginator = this.paginator;

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

  closeResult = '';
  openCheckout(content: any, booked_id: number, amount: number, isCheckout: boolean) {
    if (isCheckout) {
      Swal.fire('Bạn đã thanh toán tour này');
      return;
    }

    this.booked_id = booked_id;
    this.amount = amount;

		this.modalCheckout.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
        //this.selectedVNPay = false;
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

}
