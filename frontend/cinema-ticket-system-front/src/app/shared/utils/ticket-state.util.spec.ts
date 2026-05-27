import {
  mapHttpErrorToTicketMessage,
  ticketStateCssClass,
  ticketStateLabel,
} from './ticket-state.util';

describe('ticket-state.util', () => {
  it('maps ticket states to polish labels', () => {
    expect(ticketStateLabel('VALID')).toBe('Ważny');
    expect(ticketStateLabel('USED')).toBe('Skasowany');
    expect(ticketStateLabel('INVALID')).toBe('Nieważny');
    expect(ticketStateLabel(undefined)).toBe('—');
  });

  it('maps ticket states to css classes', () => {
    expect(ticketStateCssClass('VALID')).toBe('state-valid');
    expect(ticketStateCssClass('USED')).toBe('state-used');
    expect(ticketStateCssClass(null)).toBe('');
  });

  it('maps http errors to user messages', () => {
    expect(mapHttpErrorToTicketMessage(404)).toContain('nie istnieje');
    expect(mapHttpErrorToTicketMessage(401)).toContain('Sesja wygasła');
    expect(mapHttpErrorToTicketMessage(500)).toContain('Nie udało się');
  });
});
