import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from '../tour/data-storage.service';
import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-vnpay-return',
  templateUrl: './vnpay-return.component.html',
  styleUrls: ['./vnpay-return.component.scss']
})
export class VnpayReturnComponent implements OnInit {

  bookedTourId: number = null;
  vnp_TxnRef: string = null;
  isValid: boolean = false;
  vnp_TransactionNo: string;
  vnp_Amount: string = null;;
  vnp_BankCode: string;
  vnp_OrderInfo: string;
  vnp_ResponseCode: string;
  vnp_PayDate: string;
  dateOfCheckout: Date;




  constructor(
    private dataService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {

      const params = new HttpParams({
        fromObject: queryParams
      });

      const vnp_Amount = queryParams['vnp_Amount'];
      const vnp_BankCode = queryParams['vnp_BankCode'];
      const vnp_BankTranNo = queryParams['vnp_BankTranNo'];
      const vnp_CardType = queryParams['vnp_CardType'];
      const vnp_PayDate = queryParams['vnp_PayDate'];
      const vnp_TransactionNo = queryParams['vnp_TransactionNo'];
      const vnp_TmnCode = queryParams['vnp_TmnCode'];
      const vnp_TxnRef = queryParams['vnp_TxnRef'];
      const vnp_OrderInfo = queryParams['vnp_OrderInfo'];
      const vnp_ResponseCode = queryParams['vnp_ResponseCode'];

      let authObs: Observable<any>;
      authObs = this.dataService.getPaymentInfo(params);
      authObs.subscribe({
        next: (data: any) => {

          this.isValid = true;
          this.bookedTourId = data.bookedTour.id;
          this.vnp_TxnRef = data.vnp_TxnRef;
          this.vnp_Amount = data.amount;
          this.dateOfCheckout = data.dateOfCheckout;

          //Swal.close()
          Swal.fire({
            icon: 'success',
            title: 'Thanh toán thành công',
            showConfirmButton: true,
            //timer: 2000
          })
        },
        error: (errorMessage: any) => {
          //console.log("Đây là lỗi: ", errorMessage);
          //Swal.close()
          Swal.fire({
            icon: 'error',
            title: 'Lỗi giao dịch',
            text: errorMessage.message,
          })
        },
      });
  
      // Sử dụng các tham số tại đây
      // console.log('vnp_TxnRef:', vnp_TxnRef);
      // console.log('vnp_TransactionNo:', vnp_TransactionNo);
      // console.log('vnp_Amount:', vnp_Amount);
      // console.log('vnp_BankCode:', vnp_BankCode);
      // console.log('vnp_OrderInfo:', vnp_OrderInfo);
      // console.log('vnp_ResponseCode:', vnp_ResponseCode);
      // console.log('vnp_PayDate', vnp_PayDate);

      //console.log('params:', params);


    });
  }

  

  
}
