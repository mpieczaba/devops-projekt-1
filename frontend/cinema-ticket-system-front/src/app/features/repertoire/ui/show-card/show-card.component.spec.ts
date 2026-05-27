import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowCardComponent } from './show-card.component';
import { Show } from '../../../../shared/models/domain.models';

describe('ShowCardComponent', () => {
  let fixture: ComponentFixture<ShowCardComponent>;
  let component: ShowCardComponent;

  const show: Show = {
    id: 1,
    date: '2026-05-27T18:00:00',
    movieId: 1,
    roomId: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowCardComponent);
    component = fixture.componentInstance;
    component.show = show;
    fixture.detectChanges();
  });

  it('renders room number and buy button', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Sala 2');
    expect(element.textContent).toContain('Kup bilet');
  });

  it('emits selected show on button click', () => {
    const selected = vi.fn();
    component.selected.subscribe(selected);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(selected).toHaveBeenCalledWith(show);
  });
});
