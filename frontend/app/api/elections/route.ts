import { NextResponse } from "next/server";
import { fetchUpcomingElections, hasCivicKey } from "@/lib/civic";

// GET /api/elections?zip=22301
// Returns upcoming elections from Google Civic when a key is configured, else a
// "mock" signal telling the client to render labeled sample data. The Civic API
// key stays server-side — the browser only ever talks to this same-origin route.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip") ?? "";

  // Validate input (the homepage only sends 5-digit zips, but never trust it).
  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: "A valid 5-digit zip code is required." },
      { status: 400 }
    );
  }

  // No key yet → ask the client to fall back to sample data (not an error).
  if (!hasCivicKey()) {
    return NextResponse.json({ source: "mock", reason: "no_api_key", elections: [] });
  }

  try {
    const elections = await fetchUpcomingElections();
    // Note: electionQuery is not location-filtered yet, so `zip` is echoed back
    // but not used to narrow results. voterInfoQuery(zip) is the next slice.
    return NextResponse.json({ source: "live", zip, elections });
  } catch (err) {
    // Any upstream failure degrades to sample data rather than breaking the UI.
    return NextResponse.json({ source: "mock", reason: String(err), elections: [] });
  }
}
