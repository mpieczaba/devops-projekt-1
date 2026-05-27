import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeatComponent } from './seat.component';
import { Seat } from '../../../../shared/models/domain.models';

describe('SeatComponent', () => {
  let fixture: ComponentFixture<SeatComponent>;
  let component: SeatComponent;

  const seat: Seat = {
    seatId: 7,
    rowNumber: 2,
    seatNumber: 3,
    roomId: 1,
    reserved: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatComponent);
    component = fixture.componentInstance;
    component.seat = seat;
    fixture.detectChanges();
  });

  it('renders seat number', () => {
    expect(fixture.nativeElement.textContent).toContain('3');
  });

  it('emits seat id when available seat is clicked', () => {
    const toggled = vi.fn();
    component.toggled.subscribe(toggled);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(toggled).toHaveBeenCalledWith(7);
  });

  it('does not emit for reserved seat', () => {
    component.seat = { ...seat, reserved: true };
    fixture.detectChanges();

    const toggled = vi.fn();
    component.toggled.subscribe(toggled);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(toggled).not.toHaveBeenCalled();
  });
});
