import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Show } from '../../../../shared/models/domain.models';
import { ShowCardComponent } from '../show-card/show-card.component';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [ShowCardComponent],
  templateUrl: './show-list.component.html',
  styleUrl: './show-list.component.css',
})
export class ShowListComponent {
  @Input({ required: true }) shows: Show[] = [];
  @Input() loading = false;
  @Output() showSelected = new EventEmitter<Show>();
}
