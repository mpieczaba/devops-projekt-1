import { TicketState } from '../models/domain.models';

const STATE_LABELS: Record<TicketState, string> = {
  VALID: 'Ważny',
  USED: 'Skasowany',
  INVALID: 'Nieważny',
};

const STATE_CSS: Record<TicketState, string> = {
  VALID: 'state-valid',
  USED: 'state-used',
  INVALID: 'state-invalid',
};

export function ticketStateLabel(state: TicketState | null | undefined): string {
  return state ? STATE_LABELS[state] : '—';
}

export function ticketStateCssClass(state: TicketState | null | undefined): string {
  return state ? STATE_CSS[state] : '';
}

export function mapHttpErrorToTicketMessage(status: number): string {
  if (status === 404) {
    return 'Bilet nie istnieje — sprawdź kod rezerwacji.';
  }
  if (status === 401 || status === 403) {
    return 'Sesja wygasła. Zaloguj się ponownie.';
  }
  return 'Nie udało się wykonać operacji.';
}
