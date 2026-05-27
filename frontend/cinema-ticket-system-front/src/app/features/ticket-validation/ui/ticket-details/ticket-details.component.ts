import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketValidationInfo } from '../../../../shared/models/domain.models';
import {
  formatSeatLabel,
} from '../../../../shared/utils/seat-layout.util';
import {
  ticketStateCssClass,
  ticketStateLabel,
} from '../../../../shared/utils/ticket-state.util';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css',
})
export class TicketDetailsComponent {
  @Input({ required: true }) info!: TicketValidationInfo;
  @Input() redeemMessage: string | null = null;
  @Input() redeeming = false;
  @Output() redeem = new EventEmitter<void>();

  protected readonly stateLabel = ticketStateLabel;
  protected readonly stateClass = ticketStateCssClass;
  protected readonly formatSeat = formatSeatLabel;
}
