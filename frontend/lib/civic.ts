// =============================================================================
// Google Civic Information API client — SERVER ONLY.
// -----------------------------------------------------------------------------
// Do NOT import this from a client component. It reads GOOGLE_CIVIC_API_KEY,
// which is a server-side secret (note: no NEXT_PUBLIC_ prefix) and must never
// be shipped to the browser. It is consumed only by app/api/elections/route.ts.
//
// Endpoint used: elections.electionQuery
//   https://developers.google.com/civic-information/docs/v2/elections/electionQuery
// This returns the elections Google currently has data for (nationwide). It is
// NOT yet filtered to the user's location — location-specific contests/polling
// come from voterInfoQuery, which needs a full address and is the next slice.
// =============================================================================

const CIVIC_BASE = "https://www.googleapis.com/civicinfo/v2";

export interface CivicElection {
  id: string;
  name: string;
  electionDate: string; // YYYY-MM-DD (Google's electionDay)
  ocdDivisionId: string;
}

/** True when a Civic API key is configured. Lets callers fall back cleanly. */
export function hasCivicKey(): boolean {
  return Boolean(process.env.GOOGLE_CIVIC_API_KEY);
}

/**
 * Fetch upcoming elections from Google Civic, dropping the permanent test
 * election (id "2000") and anything already past, sorted soonest-first.
 * Throws if the key is missing or the upstream call fails — the route handler
 * turns that into a graceful sample-data fallback.
 */
export async function fetchUpcomingElections(): Promise<CivicElection[]> {
  const key = process.env.GOOGLE_CIVIC_API_KEY;
  if (!key) throw new Error("GOOGLE_CIVIC_API_KEY is not set");

  const res = await fetch(`${CIVIC_BASE}/elections?key=${key}`, {
    // The election list changes rarely; cache 1h to stay well within free quota.
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Google Civic elections query failed (HTTP ${res.status})`);
  }

  const data = (await res.json()) as {
    elections?: {
      id: string;
      name: string;
      electionDay: string;
      ocdDivisionId: string;
    }[];
  };

  const today = new Date().toISOString().slice(0, 10);
  return (data.elections ?? [])
    .filter((e) => e.id !== "2000") // Google's permanent VIP test election
    .filter((e) => e.electionDay >= today)
    .map((e) => ({
      id: e.id,
      name: e.name,
      electionDate: e.electionDay,
      ocdDivisionId: e.ocdDivisionId,
    }))
    .sort((a, b) => a.electionDate.localeCompare(b.electionDate));
}
