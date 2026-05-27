import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { TicketValidationInfo } from '../../../shared/models/domain.models';
import { mapHttpErrorToTicketMessage } from '../../../shared/utils/ticket-state.util';
import { TicketValidatorRepository } from '../data/ticket-validator.repository';

@Injectable()
export class TicketValidationFacade {
  private readonly authService = inject(AuthService);
  private readonly repository = inject(TicketValidatorRepository);

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly username = this.authService.username;

  private readonly ticketInfoState = signal<TicketValidationInfo | null>(null);
  private readonly lookupErrorState = signal<string | null>(null);
  private readonly loginErrorState = signal<string | null>(null);
  private readonly redeemMessageState = signal<string | null>(null);
  private readonly loggingInState = signal(false);
  private readonly lookingUpState = signal(false);
  private readonly redeemingState = signal(false);

  readonly ticketInfo = this.ticketInfoState.asReadonly();
  readonly lookupError = this.lookupErrorState.asReadonly();
  readonly loginError = this.loginErrorState.asReadonly();
  readonly redeemMessage = this.redeemMessageState.asReadonly();
  readonly loggingIn = this.loggingInState.asReadonly();
  readonly lookingUp = this.lookingUpState.asReadonly();
  readonly redeeming = this.redeemingState.asReadonly();

  login(username: string, password: string): void {
    this.loginErrorState.set(null);
    this.loggingInState.set(true);

    this.authService.login(username, password).subscribe({
      next: (success) => {
        this.loggingInState.set(false);
        if (!success) {
          this.loginErrorState.set('Nieprawidłowy login lub hasło.');
        }
      },
      error: () => {
        this.loggingInState.set(false);
        this.loginErrorState.set('Nie udało się zalogować.');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.resetSession();
  }

  lookup(code: string): void {
    const trimmed = code.trim();
    if (!trimmed) {
      return;
    }

    this.lookupErrorState.set(null);
    this.redeemMessageState.set(null);
    this.lookingUpState.set(true);

    this.repository
      .getInfo(trimmed)
      .pipe(finalize(() => this.lookingUpState.set(false)))
      .subscribe({
        next: (info) => this.ticketInfoState.set(info),
        error: (error) => {
          this.ticketInfoState.set(null);
          this.handleAuthError(error.status);
          if (error.status !== 401 && error.status !== 403) {
            this.lookupErrorState.set(mapHttpErrorToTicketMessage(error.status));
          }
        },
      });
  }

  redeem(code: string): void {
    const info = this.ticketInfoState();
    if (!info || info.ticketState !== 'VALID') {
      return;
    }

    this.redeemMessageState.set(null);
    this.redeemingState.set(true);

    this.repository
      .redeem(code.trim())
      .pipe(finalize(() => this.redeemingState.set(false)))
      .subscribe({
        next: () => {
          this.redeemMessageState.set('Bilet został skasowany.');
          this.refreshTicketInfo(code.trim());
        },
        error: (error) => {
          this.handleAuthError(error.status);
          if (error.status !== 401 && error.status !== 403) {
            this.redeemMessageState.set('Nie udało się skasować biletu.');
          }
        },
      });
  }

  clearLookup(): void {
    this.ticketInfoState.set(null);
    this.lookupErrorState.set(null);
    this.redeemMessageState.set(null);
  }

  private resetSession(): void {
    this.ticketInfoState.set(null);
    this.lookupErrorState.set(null);
    this.redeemMessageState.set(null);
    this.loginErrorState.set(null);
  }

  private refreshTicketInfo(code: string): void {
    this.repository.getInfo(code).subscribe({
      next: (info) => this.ticketInfoState.set(info),
      error: (error) => {
        this.handleAuthError(error.status);
        if (error.status !== 401 && error.status !== 403) {
          this.lookupErrorState.set(mapHttpErrorToTicketMessage(error.status));
        }
      },
    });
  }

  private handleAuthError(status: number): void {
    if (status === 401 || status === 403) {
      this.lookupErrorState.set(mapHttpErrorToTicketMessage(status));
      this.authService.logout();
    }
  }
}
