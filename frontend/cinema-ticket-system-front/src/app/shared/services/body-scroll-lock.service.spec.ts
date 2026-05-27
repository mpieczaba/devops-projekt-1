import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BodyScrollLockService } from './body-scroll-lock.service';

describe('BodyScrollLockService', () => {
  let service: BodyScrollLockService;
  let documentRef: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyScrollLockService);
    documentRef = TestBed.inject(DOCUMENT);
    documentRef.body.style.overflow = '';
  });

  it('locks and unlocks body scroll', () => {
    service.lock();
    expect(documentRef.body.style.overflow).toBe('hidden');

    service.unlock();
    expect(documentRef.body.style.overflow).toBe('');
  });

  it('supports nested locks', () => {
    service.lock();
    service.lock();
    service.unlock();
    expect(documentRef.body.style.overflow).toBe('hidden');

    service.unlock();
    expect(documentRef.body.style.overflow).toBe('');
  });

  it('reset clears lock counter', () => {
    service.lock();
    service.lock();
    service.reset();
    expect(documentRef.body.style.overflow).toBe('');
  });
});
