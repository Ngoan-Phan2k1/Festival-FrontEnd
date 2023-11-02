import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataStorageService } from 'src/app/tour/data-storage.service';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserInfo } from './userinfo.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  tourist_id: number;
  full_name = '';
  email = '';
  user_name = '';
  img_name = '';
  file: File;
  user_info: UserInfo;

  constructor(
    private userService: UserService,
    private dataService: DataStorageService,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.userService.fileChanged.subscribe(
      (file) => {
        this.file = file;
      }
    )

    
    this.user_info = this.userService.getUser();
    this.tourist_id = this.user_info?.id;
    this.full_name = this.user_info?.fullname;
    this.email = this.user_info?.email;
    this.user_name = this.user_info?.username;

    this.userService.userChanged.subscribe(
      (user) => {
        this.tourist_id = user.id;
        this.full_name = user?.fullname;
        this.email = user?.email;
        this.user_name = user?.username;
        this.img_name = user?.imageDTO?.name
      }
    )
    // const userData: {
    //   email: string;
    //   fullname: string;
    //   touristId: number;
    //   username: string;
    //   _token: string;
    //   _tokenExpirationDate: string;
    // } = JSON.parse(localStorage.getItem('userData'));

    // this.dataService.getTouristById(userData?.touristId).subscribe(
    //   (user) => {
    //     this.dataService.downloadImageByName(user?.imageDTO?.name).subscribe(
    //       (res) => {
    //         this.url = res.url;
    //       }
    //     )
    //   }
    // )

    // this.name = userData.fullname;
    // this.mail = userData.email;
    // this.username = userData.username;

    

  }

  onSubmitUserForm(form: NgForm) {

    // const fullname = form.value.fullname;
    // const email = form.value.email;
    // const phone = form.value.phone;
    // const address = form.value.addressShow;
    // const note = form.value.Note;
    // const adult = form.value.adult;
    // const child = form.value.child;
    // const baby = form.value.baby;

    if (!form.valid) {

      if (form.controls['fullname'].errors) {
        alert('Vui lòng nhập họ tên!');
        return;
      }

      if (form.controls['mail'] && form.controls['mail'].errors) {
        alert('Vui lòng nhập email hợp lệ!');
        return;
      }
  
      if (form.controls['username'] && (form.controls['username'].errors)) {
        alert('Vui lòng nhập tên đăng nhập!');
        return;
      }

    }

    if (this.file) {
      this.img_name = this.file.name;
      this.dataService.uploadImage(this.file).subscribe({
        next: (img) => {
          const params = new HttpParams().set('image_name', img?.name);

          let authObs: Observable<any>;
          authObs = this.dataService.updateTourist(
            this.tourist_id,
            this.full_name,
            this.user_name,
            this.email,
            params
          )

          authObs.subscribe({
            next: (resData: any) => {
              this.userService.setUser(resData);
              Swal.fire({
                icon: 'success',
                title: 'Cập nhật thành công',
                showConfirmButton: false,
                timer: 2000
              })

            },
            error: (errorMessage: any) => {
              Swal.close()
              Swal.fire({
                icon: 'error',
                title: 'Cập nhật không thành công',
                text: errorMessage.message,
              })
            },
          });
          
          
        },
        error: (errorMessage: any) => {
          
        }
      });

      // const uploadImage$ = new Observable((observer) => {
      //   this.dataService.uploadImage(this.file).subscribe({
      //     next: (uploadResult) => {
            
      //       console.log(uploadResult);
      //       //observer.next(uploadResult);
      //       observer.complete();
            
      //     },
      //     error: (error) => {
      //       observer.error(error);
      //     }
      //   });
      // });

      return;
    }

    

    const params = new HttpParams().set('image_name', this.img_name);

    let authObs: Observable<any>;
    authObs = this.dataService.updateTourist(
      this.tourist_id,
      this.full_name,
      this.user_name,
      this.email,
      params
    )

    authObs.subscribe({
      next: (resData: any) => {
        this.userService.setUser(resData);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          showConfirmButton: false,
          timer: 2000
        })

      },
      error: (errorMessage: any) => {
        Swal.close()
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật không thành công',
          text: errorMessage.message,
        })
      },
    });
         
    
  }
}
