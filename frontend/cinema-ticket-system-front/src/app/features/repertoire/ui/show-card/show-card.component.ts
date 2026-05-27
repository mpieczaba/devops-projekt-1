import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Show } from '../../../../shared/models/domain.models';

@Component({
  selector: 'app-show-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './show-card.component.html',
  styleUrl: './show-card.component.css',
})
export class ShowCardComponent {
  @Input({ required: true }) show!: Show;
  @Output() selected = new EventEmitter<Show>();

  onSelect(): void {
    this.selected.emit(this.show);
  }
}
