import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OffsetLimitService {
  private offset: number = 0;

  constructor() {}
  getOffset(): number {
    return this.offset;
  }
  setOffset(newOffset: number) {
    this.offset = newOffset;
  }
}
