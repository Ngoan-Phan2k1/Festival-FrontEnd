// import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

// @Directive({
//   selector: '[appSticky]'
// })
// export class StickyDirective {
//   @Input() scrollOffset: number = 200; // Khoảng cách từ đỉnh trang để cố định phần tử

//   constructor(private el: ElementRef, private renderer: Renderer2) {}

//   @HostListener('window:scroll', ['$event'])
//   onScroll(event: Event): void {
//     const scrollY = window.scrollY;
//     if (scrollY >= this.scrollOffset && scrollY <= 600) {
//       // Đảm bảo rằng phần tử không bị che khuất bởi các phần tử khác
//       this.renderer.setStyle(this.el.nativeElement, 'position', 'fixed');
//       this.renderer.setStyle(this.el.nativeElement, 'top', '100');
//     } else {
//       this.renderer.removeStyle(this.el.nativeElement, 'position');
//       this.renderer.removeStyle(this.el.nativeElement, 'top');
//     }
//   }
// }

import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSticky]'
})
export class StickyDirective {
  @Input() startOffset: number = 200; // Điểm bắt đầu sử dụng sticky
  @Input() endOffset: number = 600; // Điểm kết thúc sử dụng sticky

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollY = window.scrollY;
    if (scrollY >= this.startOffset && scrollY <= this.endOffset) {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'fixed');
      this.renderer.setStyle(this.el.nativeElement, 'top', '100');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'position');
      this.renderer.removeStyle(this.el.nativeElement, 'top');
    }
  }
}










