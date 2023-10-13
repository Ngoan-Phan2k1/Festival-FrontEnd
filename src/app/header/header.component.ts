import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, AuthenticationResponse } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  name: string;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 900,
    autoplay: true,
    navText: ['', ''],
    animateOut: 'fadeOut', // Hiệu ứng chuyển ra
    animateIn: 'fadeIn',   // Hiệu ứng chuyển vào
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  constructor(
    private authService: AuthService,
    private modalServiceLogin: NgbModal,
    private modalServiceResgister: NgbModal
  ) {

  }

  ngOnInit(): void {

    // window.addEventListener("scroll", function () {
    //   const navbar = document.querySelector(".navbar");
    //   if (window.pageYOffset > 0) {
    //     navbar.classList.add("sticky-navbar");
    //   } else {
    //     navbar.classList.remove("sticky-navbar");
    //   }
    // });

    this.authService.user.subscribe(user => {
      
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        const parts = user.fullname.split(' '); // Tách chuỗi thành mảng các từ
        this.name = parts[parts.length - 1]; // Lấy phần tử cuối cùng của mảng
      }
        // console.log(!user);
        // console.log(!!user);
    });
  }


  closeResult = '';
  openLogin(content: any) {
		this.modalServiceLogin.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  openRegister(content: any) {
		this.modalServiceResgister.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
        console.log("RESULT")
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
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


  onSubmitRegister(form: NgForm) {
    if (!form.valid) {
      console.log("Form is not valid");
      return;
    }

    

    const fullname = form.value.fullname;
    const username = form.value.username;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthenticationResponse>
    authObs = this.authService.signup(fullname, email, username, password);



    // authObs.subscribe(
    //   resData => {
    //     console.log(resData);
    //     // this.isLoading = false;
    //     // this.router.navigate(['/recipes']);
    //   },
    //   errorMessage => {
    //     console.log("Day la loi: ", errorMessage);
    //     // this.error = errorMessage;
    //     // this.isLoading = false;
    //   }
    // );

    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, // Không cho phép tắt bằng cách nhấp bên ngoài
      didOpen: () => {
        Swal.showLoading()
      }
    });

    authObs.subscribe({
      next: (resData: AuthenticationResponse) => {
        //console.log(resData);
        // Xử lý phản hồi thành công ở đây
        Swal.close()
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.modalServiceResgister.dismissAll();
          form.reset();
        })
      },
      error: (errorMessage: any) => {
        //console.log("Đây là lỗi: ", errorMessage);

        Swal.fire({
          icon: 'error',
          title: 'Đăng ký thất bại',
          text: errorMessage.message,
        })
      },
    });

    
  }


  onSubmitLogin(form: NgForm) {

    // const dateString = "2023-09-29T09:30:46.000+00:00";
    // const dateObject = new Date(dateString);
    // const timestamp = dateObject.getTime(); // Lấy timestamp (số mili-giây)

    if (!form.valid) {
      console.log("Form is not valid");
      return;
    }

    const username = form.value.username;
    const password = form.value.password;

    let authObs: Observable<AuthenticationResponse>
    authObs = this.authService.login(username, password);

    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, // Không cho phép tắt bằng cách nhấp bên ngoài
      didOpen: () => {
        Swal.showLoading()
      }
    });

    authObs.subscribe({
      next: (resData: AuthenticationResponse) => {

        // Xử lý phản hồi thành công ở đây
        Swal.close()
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.modalServiceLogin.dismissAll();
          form.reset();
        })
      },
      error: (errorMessage: any) => {
        //console.log("Đây là lỗi: ", errorMessage);

        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: errorMessage.message,
        })
      },
    });

    //form.reset();
  }

  logout() {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, // Không cho phép tắt bằng cách nhấp bên ngoài
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.authService.logout();
    Swal.close()

  }
}
