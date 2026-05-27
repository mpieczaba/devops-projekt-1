import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BodyScrollLockService {
  private readonly document = inject(DOCUMENT);
  private lockCount = 0;

  lock(): void {
    this.lockCount++;
    this.document.body.style.overflow = 'hidden';
  }

  unlock(): void {
    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      this.document.body.style.overflow = '';
    }
  }

  reset(): void {
    this.lockCount = 0;
    this.document.body.style.overflow = '';
  }
}
