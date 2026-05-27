const API_BASE = process.env.E2E_API_URL ?? 'http://localhost:8080';

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
