import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Show } from './show.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show',
  imports: [DatePipe],
  templateUrl: './show.component.html',
  styleUrl: './show.component.css',
})
export class ShowComponent {
  @Input({ required: true }) show!: Show;
  @Output() buyTicket = new EventEmitter<Show>();

  onClick() {
    this.buyTicket.emit(this.show);
  }
}
