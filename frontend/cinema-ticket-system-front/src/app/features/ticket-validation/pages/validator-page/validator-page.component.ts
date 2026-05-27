import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketValidationFacade } from '../../services/ticket-validation.facade';
import { ValidatorLoginComponent } from '../../ui/validator-login/validator-login.component';
import { TicketDetailsComponent } from '../../ui/ticket-details/ticket-details.component';

@Component({
  selector: 'app-validator-page',
  standalone: true,
  imports: [FormsModule, ValidatorLoginComponent, TicketDetailsComponent],
  templateUrl: './validator-page.component.html',
  styleUrl: './validator-page.component.css',
  providers: [TicketValidationFacade],
})
export class ValidatorPageComponent {
  protected readonly facade = inject(TicketValidationFacade);

  reservationCode = '';

  onLogin(credentials: { username: string; password: string }): void {
    this.facade.login(credentials.username, credentials.password);
  }

  onLookup(): void {
    this.facade.lookup(this.reservationCode);
  }

  onRedeem(): void {
    this.facade.redeem(this.reservationCode);
  }

  onLogout(): void {
    this.facade.logout();
    this.reservationCode = '';
  }
}
