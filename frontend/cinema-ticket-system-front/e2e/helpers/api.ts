const API_BASE = process.env.E2E_API_URL ?? 'http://localhost:8080';

/** Show seeded with a start time a few minutes in the past — always within the validity window during E2E. */
export const E2E_VALID_SHOW_ID = 6;

interface SeatResponse {
  seatId: number;
  reserved: boolean;
}

export async function getAvailableSeatIds(showId: number, count: number): Promise<number[]> {
  const response = await fetch(`${API_BASE}/shows/${showId}/seats`);

  if (!response.ok) {
    throw new Error(`Failed to load seats for show ${showId}: ${response.status} ${await response.text()}`);
  }

  const seats = (await response.json()) as SeatResponse[];
  const available = seats.filter((seat) => !seat.reserved).map((seat) => seat.seatId);

  if (available.length < count) {
    throw new Error(`Show ${showId} has only ${available.length} free seat(s), need ${count}.`);
  }

  return available.slice(0, count);
}

export async function createReservation(showId: number, seatIds: number[]): Promise<string> {
  const response = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ showId, seatIds }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create reservation: ${response.status} ${await response.text()}`);
  }

  const body = (await response.json()) as { code: string };
  return body.code;
}

export async function createValidReservation(seatCount = 2): Promise<string> {
  const seatIds = await getAvailableSeatIds(E2E_VALID_SHOW_ID, seatCount);
  return createReservation(E2E_VALID_SHOW_ID, seatIds);
}
