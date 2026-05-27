export interface Movie {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  imageUrl: string;
}

export interface Show {
  id: number;
  date: string;
  movieId: number;
  roomId: number;
}

export interface Seat {
  seatId: number;
  rowNumber: number;
  seatNumber: number;
  roomId: number;
  reserved: boolean;
}

export interface ReservationResult {
  id: number;
  code: string;
}

export type TicketState = 'VALID' | 'USED' | 'INVALID';

export interface ReservedSeatInfo {
  rowNumber: number;
  seatNumber: number;
  roomId: number;
  reserved: boolean;
}

export interface TicketValidationInfo {
  reservationCode: string;
  ticketCode: string;
  ticketState: TicketState;
  numberOfReservedSeats: number;
  showDate: string;
  roomId: number;
  reservedSeats: ReservedSeatInfo[];
}

export type Loadable<T> = T | undefined;
