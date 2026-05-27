import {
  formatSeatLabel,
  groupSeatsByRow,
  toggleSeatSelection,
} from './seat-layout.util';
import { Seat } from '../models/domain.models';

describe('seat-layout.util', () => {
  const seats: Seat[] = [
    { seatId: 1, rowNumber: 2, seatNumber: 1, roomId: 1, reserved: false },
    { seatId: 2, rowNumber: 1, seatNumber: 2, roomId: 1, reserved: false },
    { seatId: 3, rowNumber: 1, seatNumber: 1, roomId: 1, reserved: true },
    { seatId: 4, rowNumber: 1, seatNumber: 1, roomId: 2, reserved: false },
  ];

  it('groupSeatsByRow sorts rows and filters by room', () => {
    const rows = groupSeatsByRow(seats, 1);

    expect(rows).toHaveLength(2);
    expect(rows[0].rowNumber).toBe(1);
    expect(rows[1].rowNumber).toBe(2);
    expect(rows[0].seats).toHaveLength(2);
    expect(rows[1].seats).toHaveLength(1);
  });

  it('toggleSeatSelection adds and removes seat ids', () => {
    expect(toggleSeatSelection([], 5)).toEqual([5]);
    expect(toggleSeatSelection([5], 5)).toEqual([]);
    expect(toggleSeatSelection([5], 7)).toEqual([5, 7]);
  });

  it('formatSeatLabel returns polish label', () => {
    expect(formatSeatLabel({ rowNumber: 3, seatNumber: 8 })).toBe('rząd 3, miejsce 8');
  });
});
