import { Component, OnInit } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { CurrencyPipe} from '@angular/common';
import { Tour } from './tour.model';
import { Router, NavigationEnd } from '@angular/router';
import * as tf from '@tensorflow/tfjs';
import Swal from 'sweetalert2';
import { async, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {
  tours: Tour[] = [];
  file: File;
  url = '';
  model: any;
  predicted = '';
  context: CanvasRenderingContext2D;

  label: string;
  percent: number;

  constructor(
    private router: Router,
    private dataStorageService: DataStorageService, 
    private currencyPipe: CurrencyPipe ) {

      // this.router.events.subscribe((event) => {
      //   if (event instanceof NavigationEnd) {
      //     window.scrollTo(-100, -100);
      //   }
      // });
    }

  async ngOnInit(): Promise<void> {
    window.scrollTo(0, 0);
    
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait',
      allowOutsideClick: false, 
      didOpen: () => {
        Swal.showLoading()
      }
    });

    //const model = tf.loadLayersModel('http://localhost:3000/model.json');
    const fetchTours$ = this.dataStorageService.fetchTours();
    forkJoin([fetchTours$]).subscribe(([data]) => {
      this.tours = data;
      const downloadImageRequests = this.tours.map(tour => {
        return this.dataStorageService.downloadImageByName(tour.imageDTO.name);
      });

      forkJoin(downloadImageRequests).subscribe(imageResponses => {
        imageResponses.forEach((res, index) => {
          this.tours[index].url = res.url;
        });
        Swal.close();
      })


    })

    // const model = await tf.loadLayersModel('http://localhost:3000/model.json');
    // console.log(model.summary());


    // this.dataStorageService.fetchTours().subscribe(data => {
    //   this.tours = data;
    //   for (const tour of this.tours) {
    //     this.dataStorageService.downloadImageByName(tour.imageDTO.name).subscribe(
    //       (res) => {
    //         tour.url = res.url;
    //       }
    //     )
    //   }
    //   Swal.close()
    // });
  }

  
  // formatPrice(price: number): string {
  //   const formattedPrice = this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0');
  //   if (formattedPrice) {
  //     return formattedPrice.replace('₫', '') + ' đ';
  //   }
  //   return '';
  // }

  formatPrice(price: any): string {
    return this.currencyPipe.transform(price, 'VND', 'symbol', '1.0-0') || '';
  }

  async onImageSelected(event: any) {

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.dataStorageService.prediction(this.file).subscribe(
        (data) => {
          
          this.percent = data?.percent;
          if (data.label === '0') {
            this.label = 'Lễ hội Cầu Ngư';
          }
          else if (data.label === '1') {
            this.label = 'Lễ hội chùa Hương';
          }
          else if (data.label === '2') {
            this.label = 'Lễ hội đua bò Bảy Núi';
          }
          else if (data.label === '3') {
            this.label = 'Lễ hội đua voi Tây Nguyên';
          }
          else if (data.label === '4') {
            this.label = 'Lễ hội giỗ tổ Hùng Vương';
          }
          else if (data.label === '5') {
            this.label = 'Lễ hội Gióng';
          }
          else if (data.label === '6') {
            this.label = 'Lễ hội Gò Đống Đa';
          }
          else if (data.label === '7') {
            this.label = 'Lễ hội Kate';
          }
          else if (data.label === '8') {
            this.label = 'Lễ hội Lim';
          }
          else if (data.label === '9') {
            this.label = 'Lễ hội vía Bà Chúa Xứ';
          }
          else if (data.label === '10') {
            this.label = 'Lễ hội Yên Tử';
          }
        }
      )
      const selectedImage = fileList[0];
      this.url = URL.createObjectURL(selectedImage);

      //const imageTensor = await this.preprocessImage(selectedImage);

      // if (imageTensor) {
      //   let output = this.model.predict(imageTensor) as any;
      //   let predictions = Array.from(output.dataSync());

      //   //let predictions: number[] = Array.from(output.dataSync());


      //   // const maxProbability = Math.max(...predictions);
      //   // const predictedClass = predictions.indexOf(maxProbability);
      //   // console.log("DU DOna: ", predictedClass);
      //   //console.log(output);

      //   // for (let i = 0; i < predictions.length; i++) {
      //   //   console.log(predictions[i]);
      //   //   // if (predictions[i] == "1") {
      //   //   //   this.predicted = i.toString();
      //   //   //   console.log(this.predicted);
      //   //   // }
      //   // }

      // }
      
      // const reader = new FileReader();
      // reader.readAsArrayBuffer(this.file);
      // reader.onload = async (event) => {

      // const arrayBuffer: ArrayBuffer = event.target.result as ArrayBuffer;

      
      // const imageTensor = tf.tensor(new Uint8Array(arrayBuffer));
      
      // const normalizedImage = imageTensor.toFloat().div(255);
      // const inputTensor = normalizedImage.reshape([1, 128, 128, 1]);
      // const predictions = this.model.predict(inputTensor) as tf.Tensor;
      // const predictionsArray = Array.from(predictions.dataSync());
      

      // }

      

    }
  }

  async preprocessImage(imageFile: File) {

    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, 128, 128);
    let imageData = context.getImageData(0, 0, 128, 128); 
    let img = tf.browser.fromPixels(imageData, 1);
    let imgtmp = img.reshape([1, 128, 128, 1]);
    imgtmp = tf.cast(imgtmp, 'float32');
    console.log(imgtmp);
    return imgtmp;
  }

  // async preprocessImage(imageFile: File): Promise<tf.Tensor> {
  //   // Thực hiện tiền xử lý hình ảnh (phù hợp với yêu cầu của mô hình)
  //   // Đảm bảo rằng đầu ra là một Tensor thích hợp cho mô hình
  //   const image = new Image();
  //   image.src = URL.createObjectURL(imageFile);
  //   //await image.decode();
  //   const canvas = document.createElement('canvas');
  //   canvas.width = 128; // Thay đổi kích thước thành 128x128
  //   canvas.height = 128; // Thay đổi kích thước thành 128x128
  //   const context = canvas.getContext('2d');
  //   context.drawImage(image, 0, 0, 128, 128);
  //   const imageData = context.getImageData(0, 0, 128, 128); // Thay đổi kích thước
  //   // const grayscaleImageData = this.convertToGrayscale(imageData);
  //   // const imageTensor = tf.browser.fromPixels(grayscaleImageData).toFloat();

  //   const imageTensor = tf.browser.fromPixels(imageData).toFloat();
    

  //   const batchedTensor = imageTensor.expandDims(0);
    
  //   return batchedTensor;
  // }
  
  
  

  clearImg() {
    this.url = '';
    this.file = null;
    this.predicted = '';
  }
  
}
