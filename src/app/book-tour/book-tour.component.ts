import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort} from "@angular/material/sort";
import { CustomPaginator } from './CustomPaginatorConfiguration';
import { DataStorageService } from '../tour/data-storage.service';
import { Tour } from '../tour/tour.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Hotel } from '../hotel/hotel.model';
import { Room } from '../hotel/hotel-room/room.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Observable, forkJoin, Observer } from 'rxjs';
import { TourDetailService } from '../tour/tour-detail/tour-detail.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface data {
  hotel: string;
  room: string;
  services: string[];
  price: number;
  url_room: string;
}

@Component({
  selector: 'app-book-tour',
  templateUrl: './book-tour.component.html',
  styleUrls: ['./book-tour.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class BookTourComponent implements OnInit {
  displayedColumns: string[] = ['hotel', 'room', 'services', 'price'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<data>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  //customPaginatorIntl: MatPaginatorIntl = new MatPaginatorIntl();


  tour: Tour;
  tour_id: number;
  hotels: Hotel[];
  rooms: Room[];
  roomsByHotel: Room[];
  data: data[] = [];
  isAuthenticated = false;
  isValidAdult = false;
  isValidChild = false;
  isValidBaby = false;
  isValidRoom = false;
  selectedHotel: number;
  selectedRoom: number;

  numAdult = 1;
  numChild = 0;
  numBaby = 0;
  numRoom = 1;

  constructor(
    private tourDetailService: TourDetailService,
    private authService: AuthService,
    private dataService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router
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
      }
    )

    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      
    })

    //this.dataSource.paginator = this.paginator;
    
    this.dataSource.sort = this.sort;

    this.route.params
    .subscribe(
      (params: Params) => {
        

        this.tour_id = +params['id'];
        this.dataService.getTourById(this.tour_id).subscribe(
          (tour) => {
            this.tour = tour;
            this.dataService.downloadImageByName(tour?.imageDTO?.name).subscribe(
              (res) => {this.tour.url = res.url;}
              
            )
            this.hotels = tour.hotelDTOs;
            this.selectedHotel = this.hotels[0].id;
            this.dataService.getRoomByHotelId(this.selectedHotel).subscribe(
              (roomsByHotel) => {
                this.roomsByHotel = roomsByHotel;
                this.selectedRoom = this.roomsByHotel[0]?.id;
              }
            )
            this.hotels.map(hotel => {
              this.dataService.getRoomByHotelId(hotel.id).subscribe(
                (rooms) => {
                  rooms.forEach((room: Room, i) => {
                    this.data.push({
                      hotel: room?.hotelDTO?.name,
                      room: room?.name,
                      services: room?.services,
                      price: room?.price,
                      url_room: ''
                    })

                    this.dataService.downloadImageByName(room.imageDTO.name).subscribe(
                      (res) => {
                        this.data[i].url_room = res.url;
                      }
                    )
                    
                  })
                  this.dataSource = new MatTableDataSource<data>(this.data);
                  this.dataSource.paginator = this.paginator;
                  //this.paginator.pageSizeOptions = [1];
                  //this.dataSource.paginator.pageSize = 1;
                }
              )
            })
          }
        )
      }
      
    )

  }

  Filterchange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    //window.scrollTo(0, 400);

    // console.log(startIndex);
    // Tải dữ liệu mới từ nguồn dữ liệu, ví dụ: lấy phần tử thứ startIndex đến endIndex
    // Sau đó cập nhật dataSource với dữ liệu mới
    // const newData = this.loadDataFromSource(startIndex, endIndex);
    // this.dataSource = new MatTableDataSource<data>(newData);
}

  checkAdult(event: any) {

    const parsedValue = parseInt(event.target.value, 10);

    if (parsedValue < 1) {
      this.isValidAdult = true;
      alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 1!');
    } else {
      this.isValidAdult = false;
    }
    
  }

  checkChild(event: any) {

    const parsedValue = parseInt(event.target.value, 10);

    if (parsedValue < 0) {
      this.isValidChild = true;
      alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 0!');
    } else {
      this.isValidChild = false;
    }
    
  }

  checkBaby(event: any) {

    const parsedValue = parseInt(event.target.value, 10);

    if (parsedValue < 0) {
      this.isValidBaby = true;
      alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 0!');
    } else {
      this.isValidBaby = false;
    }
    
  }

  checkNumRoom(event: any) {

    const parsedValue = parseInt(event.target.value, 10);
    const max_value = this.numAdult + this.numChild + this.numBaby;

    if (parsedValue < 1) {
      this.isValidRoom = true;
      alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 1!');
    }
    else if (parsedValue > max_value) {
      alert('Quý khách chỉ có thể chọn số phòng tối đa dựa trên số người đặt tour hiện tại là ' + max_value);
    }
    else {
      this.isValidRoom = false;
    }
    
  }

  onHandleSelectHotel() {
    this.dataService.getRoomByHotelId(this.selectedHotel).subscribe(
      (roomsByHotel) => {
        this.roomsByHotel = roomsByHotel;
        this.selectedRoom = this.roomsByHotel[0]?.id;
      }
    )
  }

  onHandleSelectRoom() {
    
  }

  onSubmitBook(form: NgForm) {
    if (!this.isAuthenticated) {
      Swal.fire('Vui lòng đăng nhập để gửi yêu cầu');
      return;
    }

    if (!form.valid) {

      if (form.controls['fullname'].errors) {
        alert('Vui lòng nhập họ tên!');
        return;
      }

      if (form.controls['email'] && form.controls['email'].errors) {
        alert('Vui lòng nhập email hợp lệ!');
        return;
      }
  
      if (form.controls['phone'] && (form.controls['phone'].errors)) {
        alert('Vui lòng nhập số điện thoại hợp lệ!');
        return;
      }
  
      if (form.controls['addressShow'] && (form.controls['addressShow'].errors)) {
        alert('Vui lòng nhập địa chỉ!');
        return;
      }

      if (form.controls['adult'] && (form.controls['adult'].errors)) {
        alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 1!');
        return;
      }

      if (form.controls['child'] && (form.controls['child'].errors)) {
        alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 0!');
        return;
      }

      if (form.controls['baby'] && (form.controls['baby'].errors)) {
        alert('Vui lòng nhập vào giá trị hợp lệ, lớn hơn hoặc bằng 0!');
        return;
      }

    }

    let adult = form.value.adult;
    let child = form.value.child;
    let baby = form.value.baby;
    let num_room = form.value.num_room;
    if (num_room > (adult + child + baby)) {
      alert('Quý khách chỉ có thể chọn số phòng tối đa dựa trên số người đặt tour hiện tại');
      return;
    }

    Swal.fire({
      title: 'Quý khách vui lòng chọn xác nhận để hoàn tất việc đặt tour',
      //text: "You won't be able to revert this!",
      //icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận'
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

        const userData: {
          fullname: string;
          touristId: number;
          username: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        const fullname = form.value.fullname;
        const email = form.value.email;
        const phone = form.value.phone;
        const address = form.value.addressShow;
        const note = form.value.Note;
        
        let authObs: Observable<any>;
        authObs = this.dataService.bookedTour(
          adult,
          child,
          baby,
          fullname,
          email,
          address,
          note,
          num_room,
          phone,
          this.tour_id,
          userData.touristId,
          this.selectedRoom,
          userData._token
        )
        authObs.subscribe({
          next: (resData: any) => {
            
            Swal.fire({
              icon: 'success',
              title: 'Đặt tour thành công',
              showConfirmButton: true,
              //timer: 2000
            }).then(() => {
              form.reset();
            })

          },
          error: (errorMessage: any) => {
            //console.log("Đây là lỗi: ", errorMessage);
            Swal.close()
            Swal.fire({
              icon: 'error',
              title: 'Đặt tour không thành công',
              text: errorMessage.message,
            })
          },
        });

        // this.dataStorageService.removeBookedTour(bookedtourId, this.tourist_id).subscribe(
        //   (data) => {
        //     this.bookedTours = data;
        //     Swal.close();
        //     Swal.fire(
        //       'Hoàn tất',
        //       'Đã hủy đặt tour thành công.',
        //       'success'
        //     )
        //   }
        // )
      }
    })

    // const userData: {
    //   fullname: string;
    //   touristId: number;
    //   username: string;
    //   _token: string;
    //   _tokenExpirationDate: string;
    // } = JSON.parse(localStorage.getItem('userData'));


    // const fullname = form.value.fullname;
    // const email = form.value.email;
    // const phone = form.value.phone;
    // const address = form.value.addressShow;
    // const note = form.value.Note;
    // const adult = form.value.adult;
    // const child = form.value.child;
    // const baby = form.value.baby;


    // let authObs: Observable<any>;
    // authObs = this.dataService.bookedTour(
    //   adult,
    //   child,
    //   baby,
    //   fullname,
    //   email,
    //   address,
    //   phone,
    //   this.tour_id,
    //   userData.touristId,
    //   this.selectedRoom,
    //   userData._token
    // )
    // authObs.subscribe({
    //   next: (resData: any) => {
    //     console.log(resData);
    //     Swal.close()
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Đặt tour thành công',
    //       showConfirmButton: false,
    //       timer: 2000
    //     }).then(() => {
    //       form.reset();
    //     })

    //   },
    //   error: (errorMessage: any) => {
    //     //console.log("Đây là lỗi: ", errorMessage);
    //     //Swal.close()
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Đặt tour không thành công',
    //       text: errorMessage.message,
    //     })
    //   },
    // });
      

  }



}
