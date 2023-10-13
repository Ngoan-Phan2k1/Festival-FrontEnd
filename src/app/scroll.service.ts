import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private positions: { [key: string]: number } = {};

  saveScrollPosition(key: string, position: number): void {
    this.positions[key] = position;
  }

  getScrollPosition(key: string): number {
    return this.positions[key] || 0;
  }
}
