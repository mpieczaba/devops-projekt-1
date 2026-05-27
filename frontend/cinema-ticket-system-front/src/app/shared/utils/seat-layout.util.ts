import { Seat } from '../models/domain.models';

export interface SeatRow {
  rowNumber: number;
  seats: Seat[];
}

export function groupSeatsByRow(seats: Seat[], roomId?: number): SeatRow[] {
  const filtered = roomId != null ? seats.filter((seat) => seat.roomId === roomId) : seats;
  const rows = new Map<number, Seat[]>();

  for (const seat of filtered) {
    const row = rows.get(seat.rowNumber) ?? [];
    row.push(seat);
    rows.set(seat.rowNumber, row);
  }

  return Array.from(rows.entries())
    .sort(([a], [b]) => a - b)
    .map(([rowNumber, rowSeats]) => ({ rowNumber, seats: rowSeats }));
}

export function toggleSeatSelection(selectedIds: number[], seatId: number): number[] {
  return selectedIds.includes(seatId)
    ? selectedIds.filter((id) => id !== seatId)
    : [...selectedIds, seatId];
}

export function formatSeatLabel(seat: Pick<Seat, 'rowNumber' | 'seatNumber'>): string {
  return `rząd ${seat.rowNumber}, miejsce ${seat.seatNumber}`;
}
