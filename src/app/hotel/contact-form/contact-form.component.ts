import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/tour/data-storage.service';
import Swal from 'sweetalert2';
import { Hotel } from '../hotel.model';
import { Room } from '../hotel-room/room.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  fullname: string;
  tourist_id: number;
  hotel_id: number;
  hotel: Hotel;
  rooms: Room[];
  selectedRoom: number;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private dataService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {

    window.scrollTo(0, 0);


    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // if (!!user) {
      //   this.touristId = user.touristId
      // }
    })

    const userData: {
      fullname: string;
      touristId: number;
      username: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    this.fullname = userData.fullname;
    this.tourist_id = userData.touristId;



    this.route.params
    .subscribe(
      (params: Params) => {

        this.hotel_id = +params['id'];
        // Swal.fire({
        //   title: 'Loading...',
        //   html: 'Please wait',
        //   allowOutsideClick: false, 
        //   didOpen: () => {
        //     Swal.showLoading()
        //   }
        // });
        // this.dataService.getRoomById(this.room_id).subscribe(
        //   (room) => {
        //     this.dataService.getHotelById(room.hotel_id).subscribe(
        //       (hotel) => {
        //         this.hotel = hotel;
        //       }
        //     )

        //     this.dataService.getRoomByHotelId(room.hotel_id).subscribe(
        //       (rooms) => {
        //         this.rooms = rooms;
        //       }
        //     )
        //   }
        // )

        this.dataService.getRoomByHotelId(this.hotel_id).subscribe(
          (rooms) => {
            this.rooms = rooms;
            this.selectedRoom = rooms[0].id;
          }
        )
        
        //Swal.close();
      }
    )


  }

  onSubmitContact(form: NgForm) {

    if (!this.isAuthenticated) {
      Swal.fire('Vui lòng đăng nhập để gửi yêu cầu')
    } 
    else {
      if (!form.valid) {
        //console.log("Form is not valid");
        return;
      }
  
      const fullname = form.value.fullname;
      const email = form.value.email;
      const phone = form.value.phone;
      const tourist_id = this.tourist_id;
  
  
      let authObs: Observable<any>;
      authObs = this.dataService.addContact(fullname, email, phone, tourist_id, this.selectedRoom)
      authObs.subscribe({
        next: (resData: any) => {
          Swal.close()
          Swal.fire({
            icon: 'success',
            title: 'Gửi liên hệ thành công',
            showConfirmButton: true,
            text: 'Khách sạn sẽ liên hệ với quý khách trong thời gian sớm nhất'
            //timer: 2000
          }).then(() => {
            form.reset();
          })
  
        },
        error: (errorMessage: any) => {
          //console.log("Đây là lỗi: ", errorMessage);
          //Swal.close()
          Swal.fire({
            icon: 'info',
            title: 'Không thành công',
            text: errorMessage.message,
          })
        },
      });

    }

    // if (!form.valid) {
    //   //console.log("Form is not valid");
    //   return;
    // }

    // const fullname = form.value.fullname;
    // const email = form.value.email;
    // const phone = form.value.phone;
    // const tourist_id = this.tourist_id;


    // let authObs: Observable<any>;
    // authObs = this.dataService.addContact(fullname, email, phone, tourist_id, this.selectedRoom)
    // authObs.subscribe({
    //   next: (resData: any) => {
    //     Swal.close()
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Gửi liên hệ thành công',
    //       showConfirmButton: true,
    //       text: 'Khách sạn sẽ liên hệ với quý khách trong thời gian sớm nhất'
    //       //timer: 2000
    //     }).then(() => {
    //       form.reset();
    //     })

    //   },
    //   error: (errorMessage: any) => {
    //     //console.log("Đây là lỗi: ", errorMessage);
    //     //Swal.close()
    //     Swal.fire({
    //       icon: 'info',
    //       title: 'Không thành công',
    //       text: errorMessage.message,
    //     })
    //   },
    // });
  }
}
