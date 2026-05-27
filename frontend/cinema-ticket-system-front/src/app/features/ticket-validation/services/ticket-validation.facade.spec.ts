import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { TicketValidationInfo } from '../../../shared/models/domain.models';
import { TicketValidatorRepository } from '../data/ticket-validator.repository';
import { TicketValidationFacade } from './ticket-validation.facade';

const ticketInfo: TicketValidationInfo = {
  reservationCode: 'RES-ABC',
  ticketCode: 'RES-ABC',
  ticketState: 'VALID',
  numberOfReservedSeats: 2,
  showDate: '2026-05-27T18:00:00',
  roomId: 1,
  reservedSeats: [{ rowNumber: 1, seatNumber: 1, roomId: 1, reserved: true }],
};

class TicketValidatorRepositoryStub extends TicketValidatorRepository {
  getInfo = vi.fn(() => of(ticketInfo));
  redeem = vi.fn(() => of(void 0));
}

class AuthServiceStub {
  isLoggedIn = vi.fn(() => true);
  username = vi.fn(() => 'a');
  login = vi.fn(() => of(true));
  logout = vi.fn();
}

describe('TicketValidationFacade', () => {
  let facade: TicketValidationFacade;
  let repository: TicketValidatorRepositoryStub;
  let auth: AuthServiceStub;

  beforeEach(() => {
    repository = new TicketValidatorRepositoryStub();
    auth = new AuthServiceStub();

    TestBed.configureTestingModule({
      providers: [
        TicketValidationFacade,
        { provide: TicketValidatorRepository, useValue: repository },
        { provide: AuthService, useValue: auth },
      ],
    });

    facade = TestBed.inject(TicketValidationFacade);
  });

  it('loads ticket info on lookup', () => {
    facade.lookup(' RES-ABC ');

    expect(repository.getInfo).toHaveBeenCalledWith('RES-ABC');
    expect(facade.ticketInfo()).toEqual(ticketInfo);
    expect(facade.lookingUp()).toBe(false);
  });

  it('ignores empty lookup code', () => {
    facade.lookup('   ');

    expect(repository.getInfo).not.toHaveBeenCalled();
  });

  it('maps not found error', () => {
    repository.getInfo.mockReturnValue(throwError(() => ({ status: 404 })));

    facade.lookup('RES-MISSING');

    expect(facade.ticketInfo()).toBeNull();
    expect(facade.lookupError()).toContain('nie istnieje');
  });

  it('redeems valid ticket and refreshes info', () => {
    facade.lookup('RES-ABC');
    facade.redeem('RES-ABC');

    expect(repository.redeem).toHaveBeenCalledWith('RES-ABC');
    expect(facade.redeemMessage()).toBe('Bilet został skasowany.');
    expect(repository.getInfo).toHaveBeenCalledTimes(2);
    expect(facade.ticketInfo()).toEqual(ticketInfo);
  });

  it('does not redeem invalid ticket state', () => {
    repository.getInfo.mockReturnValue(
      of({ ...ticketInfo, ticketState: 'INVALID' })
    );
    facade.lookup('RES-ABC');
    facade.redeem('RES-ABC');

    expect(repository.redeem).not.toHaveBeenCalled();
  });

  it('logs out on auth error during lookup', () => {
    repository.getInfo.mockReturnValue(throwError(() => ({ status: 401 })));

    facade.lookup('RES-ABC');

    expect(auth.logout).toHaveBeenCalled();
    expect(facade.lookupError()).toContain('Sesja wygasła');
  });
});
