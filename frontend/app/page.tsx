"use client";
import { useState, useEffect, useRef } from "react";
import type { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from "react";

const theme = {
  bg: "#FDFCF9", surface: "#FFFFFF", surfaceHover: "#F9F7F2",
  border: "#E8E4DB", text: "#2C2C2A", textSecondary: "#6B6960", textMuted: "#9C9889",
  primary: "#3D6B50", primaryLight: "#4E8A65", primaryBg: "#EDF5F0", primarySoft: "#D4E8DB",
  gold: "#B8953F", goldBg: "#FBF6EA", goldBorder: "#E8DDB8",
  info: "#3A6085", infoBg: "#EBF1F6",
  plum: "#6B4C6E", plumBg: "#F3EDF4",
  gentle: "#7A6E5D",
};

/* ── icons ── */
const Icons = {
  CheckCircle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  BookOpen: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  TrendingUp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  MessageCircle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ArrowLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Dollar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Compass: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  ExternalLink: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  MapPin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Loader: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  ClipboardCheck: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>,
};

/* ── mock data ── */
const MOCK_RACES = [
  { id: "va-senate", name: "U.S. Senate — Virginia", candidates: 3, electionDate: "November 3, 2026", primaryDate: "August 4, 2026" },
  { id: "va-house-5", name: "U.S. House — VA District 5", candidates: 2, electionDate: "November 3, 2026", primaryDate: "August 4, 2026" },
];

const POLICY_CATEGORIES = ["Healthcare", "Economy", "Education", "Climate & Energy"];

interface CandidateData {
  id: string;
  name: string;
  party: string;
  tagline: string;
  summary: string;
  keyVotes: { bill: string; vote: string; status: string }[];
  topDonors: { name: string; amount: string; type: string }[];
  positions: Record<string, string>;
}

const MOCK_CANDIDATES: Record<string, CandidateData[]> = {
  "va-senate": [
    {
      id: "c1", name: "Alex Rivera", party: "Democrat",
      tagline: "State legislator, former public health administrator",
      summary: "Rivera has built her campaign around expanding healthcare access and investing in public education. She served eight years in the state legislature where she authored bills on prescription drug affordability and teacher pay increases. She advocates for a balanced approach to energy policy that supports both renewable development and existing industries during the transition.",
      keyVotes: [
        { bill: "Prescription Drug Affordability Act", vote: "Sponsored", status: "Enacted" },
        { bill: "Teacher Pay Increase Act", vote: "Sponsored", status: "Passed Senate" },
        { bill: "Small Business Tax Relief", vote: "Yes", status: "In Committee" },
      ],
      topDonors: [
        { name: "Individual contributions < $200", amount: "$1.1M", type: "Small donors" },
        { name: "VA Education Association", amount: "$280K", type: "PAC" },
        { name: "Healthcare Workers PAC", amount: "$220K", type: "PAC" },
      ],
      positions: { "Healthcare": "Expand coverage options, lower prescription drug costs through negotiation", "Economy": "Raise minimum wage gradually, expand childcare tax credits for working families", "Education": "Increase teacher pay, expand pre-K access, invest in community colleges", "Climate & Energy": "Invest in renewables while supporting workers in transitioning industries" },
    },
    {
      id: "c2", name: "Michael Tran", party: "Republican",
      tagline: "Small business owner, former city council member",
      summary: "Tran draws on his experience building a regional logistics company and serving on city council. His platform focuses on reducing taxes and regulations for small businesses, expanding school choice, and developing an all-of-the-above energy strategy. He emphasizes fiscal discipline and local control over federal mandates in education and environmental policy.",
      keyVotes: [
        { bill: "Small Business Tax Relief", vote: "Sponsored", status: "Enacted" },
        { bill: "School Choice Expansion Act", vote: "Yes", status: "In Committee" },
        { bill: "Prescription Drug Affordability Act", vote: "No", status: "Enacted" },
      ],
      topDonors: [
        { name: "Individual contributions < $200", amount: "$920K", type: "Small donors" },
        { name: "VA Chamber of Commerce", amount: "$350K", type: "Industry" },
        { name: "National Realtors PAC", amount: "$260K", type: "PAC" },
      ],
      positions: { "Healthcare": "Increase market competition, support health savings accounts, reduce mandates", "Economy": "Cut taxes for small businesses, reduce regulations, balance the federal budget", "Education": "Expand school choice, increase parental involvement, support vocational training", "Climate & Energy": "All-of-the-above energy strategy, oppose mandates that raise energy costs" },
    },
    {
      id: "c3", name: "Sarah Okonkwo", party: "Independent",
      tagline: "Nonprofit director, community organizer",
      summary: "Okonkwo is running as an independent after fifteen years leading a statewide civic engagement nonprofit. She advocates for political reform including ranked-choice voting and campaign finance transparency. Her platform bridges progressive and moderate positions, emphasizing practical solutions over party loyalty.",
      keyVotes: [],
      topDonors: [
        { name: "Individual contributions < $200", amount: "$1.8M", type: "Small donors" },
        { name: "Reform Virginia PAC", amount: "$150K", type: "PAC" },
      ],
      positions: { "Healthcare": "Support a public option alongside private insurance, expand rural health clinics", "Economy": "Invest in workforce development, support small businesses and cooperatives", "Education": "Increase funding for public schools, expand access to trade and technical programs", "Climate & Energy": "Accelerate clean energy transition with support for affected communities" },
    },
  ],
};

/* ── shared components ── */
function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>{children}</div>;
}

function PartyBadge({ party }: { party: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = { Democrat: { bg: "#E6EEF5", text: "#2D5080", border: "#C4D6E8" }, Republican: { bg: "#F5E6E6", text: "#8B3A3A", border: "#E8C4C4" }, Independent: { bg: "#F0ECE3", text: "#6B5D3F", border: "#D9D0BE" } };
  const c = colors[party] || colors.Independent;
  return <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, padding: "2px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>{party}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = { Enacted: { bg: theme.primaryBg, color: theme.primary }, "Passed Senate": { bg: theme.primaryBg, color: theme.primary }, "In Committee": { bg: theme.goldBg, color: theme.gold } };
  const s = map[status] || { bg: theme.infoBg, color: theme.info };
  return <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{status}</span>;
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", fontSize: "14px", padding: 0, marginBottom: "32px", fontFamily: "inherit" }}><Icons.ArrowLeft /> {label}</button>;
}

function SampleDataBanner() {
  return <div style={{ background: theme.goldBg, border: `1px solid ${theme.goldBorder}`, borderRadius: "8px", padding: "10px 16px", fontSize: "12px", color: theme.gold, fontWeight: 500, marginBottom: "20px", textAlign: "center" }}>Sample data for demonstration — real candidate data will be sourced from official government APIs</div>;
}

function HoverCard({ children, hoverBorderColor, style, ...rest }: { children: ReactNode; hoverBorderColor?: string; style?: CSSProperties; onClick?: () => void }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s", ...style }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = hoverBorderColor || theme.primaryLight; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = theme.border; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
      {...rest}>{children}</div>
  );
}

/* ── page components ── */
function HomePage({ onNavigate }: { onNavigate: (page: string, params?: Record<string, unknown>) => void }) {
  const [zip, setZip] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const handleSubmit = () => { if (zip.length === 5 && /^\d+$/.test(zip)) onNavigate("races", { zip }); };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <div style={{ background: theme.primaryBg, borderBottom: `1px solid ${theme.primarySoft}` }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "28px 24px", textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontSize: "16px", fontStyle: "italic", color: theme.primary, lineHeight: 1.6, margin: "0 0 6px", fontFamily: "'Georgia', serif" }}>&ldquo;An educated, enlightened and informed population is one of the surest ways of promoting the health of a democracy.&rdquo;</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: theme.gentle, margin: 0 }}>— Nelson Mandela</p>
          </FadeIn>
        </div>
      </div>
      <div style={{ padding: "80px 24px 48px", maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
        <FadeIn delay={100}><h1 style={{ fontSize: "clamp(36px, 5.5vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: theme.text, marginBottom: "20px", fontFamily: "'Georgia', serif" }}>Your voice matters.</h1></FadeIn>
        <FadeIn delay={200}><p style={{ fontSize: "17px", lineHeight: 1.7, color: theme.textSecondary, maxWidth: "520px", margin: "0 auto 40px" }}>Get registered, learn about the candidates in your community, reach out to your representatives, and follow through to see if elected officials keep their promises.</p></FadeIn>
        <FadeIn delay={300}>
          <div style={{ display: "flex", maxWidth: "420px", margin: "0 auto", border: `2px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", background: theme.surface, transition: "border-color 0.2s" }}
            onFocus={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = theme.primary; }}
            onBlur={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = theme.border; }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", color: theme.textMuted }}><Icons.MapPin /></div>
            <input ref={inputRef} type="text" placeholder="Enter your zip code" value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ flex: 1, border: "none", outline: "none", fontSize: "16px", padding: "14px 0", color: theme.text, background: "transparent", fontFamily: "inherit" }} />
            <button onClick={handleSubmit} disabled={zip.length !== 5}
              style={{ padding: "14px 24px", background: zip.length === 5 ? theme.primary : theme.border, color: zip.length === 5 ? "#fff" : theme.textMuted, border: "none", cursor: zip.length === 5 ? "pointer" : "default", fontWeight: 600, fontSize: "15px", transition: "background 0.2s", display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit" }}>Go <Icons.ArrowRight /></button>
          </div>
        </FadeIn>
      </div>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px" }}>
        {([
          { icon: <Icons.CheckCircle />, title: "Get Registered", desc: "Find deadlines and connect to your state\u2019s official voter registration portal.", color: theme.primary, bg: theme.primaryBg },
          { icon: <Icons.BookOpen />, title: "Learn About Candidates", desc: "Explore voting records, policy positions, and campaign finance from official sources.", color: theme.info, bg: theme.infoBg },
          { icon: <Icons.MessageCircle />, title: "Contact Your Representative", desc: "Reach out to the people who represent you and make your perspective heard.", color: theme.plum, bg: theme.plumBg },
          { icon: <Icons.ClipboardCheck />, title: "Track Promise Follow-Through", desc: "See whether elected officials deliver on the commitments they made to earn your vote.", color: theme.gold, bg: theme.goldBg },
        ] as const).map((item, i) => (
          <FadeIn key={i} delay={400 + i * 80}>
            <div style={{ padding: "24px 20px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "12px", transition: "transform 0.2s, box-shadow 0.2s", height: "100%" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, marginBottom: "14px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: theme.text, marginBottom: "6px", fontFamily: "'Georgia', serif" }}>{item.title}</h3>
              <p style={{ fontSize: "13px", lineHeight: 1.55, color: theme.textSecondary, margin: 0 }}>{item.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function RaceSelectionPage({ zip, onNavigate }: { zip: string; onNavigate: (page: string, params?: Record<string, unknown>) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <BackButton onClick={() => onNavigate("home")} label="Home" />
        <FadeIn>
          <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: theme.textMuted, fontSize: "13px" }}><Icons.MapPin /> {zip}</div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: theme.text, marginBottom: "8px", fontFamily: "'Georgia', serif" }}>Your Upcoming Elections</h1>
          <p style={{ color: theme.textSecondary, fontSize: "15px", marginBottom: "36px" }}>Choose a race to learn about the candidates.</p>
        </FadeIn>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted }}><Icons.Loader /><p style={{ marginTop: "12px", fontSize: "14px" }}>Finding elections in your area...</p></div>
        ) : (
          <>
            <SampleDataBanner />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {MOCK_RACES.map((race, i) => (
                <FadeIn key={race.id} delay={i * 80}>
                  <button onClick={() => onNavigate("candidates", { zip, raceId: race.id, raceName: race.name, electionDate: race.electionDate })}
                    style={{ width: "100%", textAlign: "left" as const, padding: "18px 22px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s, background 0.2s", fontFamily: "inherit" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.primary; (e.currentTarget as HTMLButtonElement).style.background = theme.surfaceHover; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.border; (e.currentTarget as HTMLButtonElement).style.background = theme.surface; }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "15px", color: theme.text }}>{race.name}</div>
                      <div style={{ fontSize: "13px", color: theme.textMuted, marginTop: "3px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <span>{race.candidates} candidate{race.candidates !== 1 ? "s" : ""}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Icons.Calendar /> {race.electionDate}</span>
                      </div>
                    </div>
                    <div style={{ color: theme.textMuted }}><Icons.ArrowRight /></div>
                  </button>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={250}>
              <div style={{ marginTop: "40px", padding: "22px", background: theme.primaryBg, borderRadius: "10px", border: `1px solid ${theme.primarySoft}` }}>
                <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                  <div style={{ color: theme.primary, marginTop: "2px", flexShrink: 0 }}><Icons.CheckCircle /></div>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>Make sure you&apos;re registered to vote</h3>
                    <p style={{ fontSize: "13px", color: theme.textSecondary, margin: "0 0 14px", lineHeight: 1.5 }}>Virginia&apos;s registration deadline is October 23, 2026. It only takes a few minutes.</p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                      <a href="https://vote.org/register-to-vote/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: theme.primary, textDecoration: "none" }}><Icons.Home /> U.S. residents — Register at Vote.org <Icons.ExternalLink /></a>
                      <a href="https://www.fvap.gov" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: theme.primary, textDecoration: "none" }}><Icons.Globe /> U.S. citizens abroad — Register at FVAP.gov <Icons.ExternalLink /></a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </>
        )}
      </div>
    </div>
  );
}

function CandidateListPage({ zip, raceId, raceName, electionDate, onNavigate }: { zip: string; raceId: string; raceName: string; electionDate: string; onNavigate: (page: string, params?: Record<string, unknown>) => void }) {
  const candidates = MOCK_CANDIDATES[raceId] || [];
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const toggleCompare = (id: string) => { if (selected.includes(id)) setSelected(selected.filter(s => s !== id)); else if (selected.length < 2) setSelected([...selected, id]); };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
        <BackButton onClick={() => onNavigate("races", { zip })} label="All elections" />
        <FadeIn>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: theme.text, marginBottom: "4px", fontFamily: "'Georgia', serif" }}>{raceName}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", fontSize: "13px", color: theme.textMuted }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Icons.Calendar /> Election Day: {electionDate}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <p style={{ color: theme.textSecondary, fontSize: "14px", margin: 0 }}>{candidates.length} candidates • Information from official government sources</p>
            <button onClick={() => { setCompareMode(!compareMode); setSelected([]); }}
              style={{ padding: "6px 14px", fontSize: "13px", fontWeight: 600, background: compareMode ? theme.primary : "transparent", color: compareMode ? "#fff" : theme.primary, border: `1px solid ${compareMode ? theme.primary : theme.border}`, borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
              {compareMode ? "Cancel" : "Compare"}
            </button>
          </div>
        </FadeIn>
        <SampleDataBanner />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {candidates.map((c, i) => (
            <FadeIn key={c.id} delay={i * 80}>
              <div style={{ background: theme.surface, border: `1px solid ${selected.includes(c.id) ? theme.primary : theme.border}`, borderRadius: "12px", padding: "22px", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onClick={() => compareMode ? toggleCompare(c.id) : onNavigate("candidate-detail", { zip, raceId, raceName, electionDate, candidateId: c.id })}
                onMouseEnter={(e) => { if (!selected.includes(c.id)) (e.currentTarget as HTMLDivElement).style.borderColor = theme.primaryLight; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)"; }}
                onMouseLeave={(e) => { if (!selected.includes(c.id)) (e.currentTarget as HTMLDivElement).style.borderColor = theme.border; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "start" }}>
                    {compareMode && (
                      <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${selected.includes(c.id) ? theme.primary : theme.border}`, background: selected.includes(c.id) ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", flexShrink: 0, transition: "all 0.15s" }}>
                        {selected.includes(c.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    )}
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary, fontWeight: 700, fontSize: "18px", flexShrink: 0, fontFamily: "'Georgia', serif" }}>{c.name.charAt(0)}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                        <span style={{ fontWeight: 700, fontSize: "16px", color: theme.text }}>{c.name}</span>
                        <PartyBadge party={c.party} />
                      </div>
                      <p style={{ fontSize: "13px", color: theme.textSecondary, margin: 0 }}>{c.tagline}</p>
                    </div>
                  </div>
                  {!compareMode && <div style={{ color: theme.textMuted }}><Icons.ArrowRight /></div>}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        {compareMode && selected.length > 0 && (
          <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: theme.primary, color: "#fff", padding: "12px 24px", borderRadius: "12px", boxShadow: "0 8px 28px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: "14px", zIndex: 100 }}>
            <span style={{ fontSize: "14px" }}>{selected.length} of 2 selected</span>
            {selected.length === 2 && (
              <button onClick={() => onNavigate("compare", { zip, raceId, raceName, electionDate, candidateIds: selected })}
                style={{ padding: "8px 18px", background: "#fff", color: theme.primary, border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>Compare</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateDetailPage({ zip, raceId, raceName, electionDate, candidateId, onNavigate }: { zip: string; raceId: string; raceName: string; electionDate: string; candidateId: string; onNavigate: (page: string, params?: Record<string, unknown>) => void }) {
  const candidates = MOCK_CANDIDATES[raceId] || [];
  const candidate = candidates.find(c => c.id === candidateId);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, [activeTab]);

  if (!candidate) return <div style={{ padding: "48px", textAlign: "center" }}>Candidate not found.</div>;

  const tabs = [
    { id: "overview", label: "Overview", icon: <Icons.Compass /> },
    { id: "votes", label: "Legislative Record", icon: <Icons.FileText /> },
    { id: "finance", label: "Campaign Finance", icon: <Icons.Dollar /> },
    { id: "positions", label: "Policy Positions", icon: <Icons.Users /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
        <BackButton onClick={() => onNavigate("candidates", { zip, raceId, raceName, electionDate })} label="All candidates" />
        <FadeIn>
          <div style={{ display: "flex", gap: "18px", alignItems: "start", marginBottom: "28px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary, fontWeight: 700, fontSize: "26px", flexShrink: 0, fontFamily: "'Georgia', serif" }}>{candidate.name.charAt(0)}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, color: theme.text, margin: 0, fontFamily: "'Georgia', serif" }}>{candidate.name}</h1>
                <PartyBadge party={candidate.party} />
              </div>
              <p style={{ fontSize: "14px", color: theme.textSecondary, margin: "0 0 4px" }}>{candidate.tagline}</p>
              <p style={{ fontSize: "12px", color: theme.textMuted, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}><Icons.Calendar /> Election Day: {electionDate}</p>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div style={{ display: "flex", gap: "2px", borderBottom: `1px solid ${theme.border}`, marginBottom: "28px", overflowX: "auto" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? theme.primary : "transparent"}`, color: activeTab === tab.id ? theme.primary : theme.textMuted, fontWeight: activeTab === tab.id ? 700 : 500, fontSize: "13px", cursor: "pointer", transition: "all 0.2s", marginBottom: "-1px", fontFamily: "inherit", whiteSpace: "nowrap" }}>{tab.icon} {tab.label}</button>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}><Icons.Loader /><p style={{ marginTop: "12px", fontSize: "14px" }}>Loading information...</p></div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div>
                  <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "22px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: theme.textMuted }}><Icons.BookOpen /> AI-Generated Summary • Sources cited below</div>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, color: theme.text, margin: 0 }}>{candidate.summary}</p>
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textMuted, padding: "0 4px" }}>Sources: GovTrack.us, FEC.gov, Congress.gov, candidate campaign website</div>
                </div>
              )}
              {activeTab === "votes" && (candidate.keyVotes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: theme.textMuted, background: theme.surface, borderRadius: "10px", border: `1px solid ${theme.border}` }}>
                  <p style={{ fontSize: "15px", marginBottom: "4px" }}>No legislative record yet</p>
                  <p style={{ fontSize: "13px" }}>This candidate has not previously held legislative office.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {candidate.keyVotes.map((v, i) => (
                    <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontWeight: 600, fontSize: "15px", color: theme.text, marginBottom: "3px" }}>{v.bill}</div><div style={{ fontSize: "13px", color: theme.textSecondary }}>Action: <span style={{ fontWeight: 600 }}>{v.vote}</span></div></div>
                      <StatusBadge status={v.status} />
                    </div>
                  ))}
                </div>
              ))}
              {activeTab === "finance" && (
                <div>
                  <p style={{ fontSize: "13px", color: theme.textSecondary, marginBottom: "16px" }}>Campaign contributions for the 2026 election cycle, from Federal Election Commission filings.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {candidate.topDonors.map((d, i) => (
                      <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div><div style={{ fontWeight: 600, fontSize: "15px", color: theme.text, marginBottom: "2px" }}>{d.name}</div><div style={{ fontSize: "12px", color: theme.textMuted }}>{d.type}</div></div>
                        <div style={{ fontWeight: 700, fontSize: "15px", color: theme.text }}>{d.amount}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: "12px", color: theme.textMuted, marginTop: "14px" }}>Source: Federal Election Commission (FEC.gov)</div>
                </div>
              )}
              {activeTab === "positions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(candidate.positions).map(([issue, stance], i) => (
                    <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "16px 20px" }}>
                      <div style={{ fontWeight: 700, fontSize: "12px", color: theme.primary, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "5px" }}>{issue}</div>
                      <p style={{ fontSize: "14px", color: theme.text, margin: 0, lineHeight: 1.5 }}>{stance}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </FadeIn>
      </div>
    </div>
  );
}

function ComparePage({ zip, raceId, raceName, electionDate, candidateIds, onNavigate }: { zip: string; raceId: string; raceName: string; electionDate: string; candidateIds: string[]; onNavigate: (page: string, params?: Record<string, unknown>) => void }) {
  const candidates = MOCK_CANDIDATES[raceId] || [];
  const pair = candidateIds.map(id => candidates.find(c => c.id === id)).filter(Boolean) as CandidateData[];
  if (pair.length !== 2) return <div>Please select two candidates to compare.</div>;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg }}>
      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "48px 24px" }}>
        <BackButton onClick={() => onNavigate("candidates", { zip, raceId, raceName, electionDate })} label="Back to candidates" />
        <FadeIn>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: theme.text, marginBottom: "4px", fontFamily: "'Georgia', serif" }}>Compare Candidates</h1>
          <p style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "32px", display: "flex", alignItems: "center", gap: "4px" }}><Icons.Calendar /> Election Day: {electionDate}</p>
        </FadeIn>
        <SampleDataBanner />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
          {pair.map(c => (
            <FadeIn key={c.id} delay={80}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary, fontWeight: 700, fontSize: "18px", fontFamily: "'Georgia', serif" }}>{c.name.charAt(0)}</div>
                <div><div style={{ fontWeight: 700, fontSize: "16px", color: theme.text }}>{c.name}</div><PartyBadge party={c.party} /></div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={160}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: theme.textMuted, marginBottom: "12px", paddingBottom: "8px", borderBottom: `1px solid ${theme.border}` }}>Policy Positions</h3>
            {POLICY_CATEGORIES.map((category, ci) => (
              <div key={ci} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: theme.primary, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px", paddingLeft: "4px" }}>{category}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {pair.map(c => (<div key={c.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "14px 16px" }}><p style={{ fontSize: "14px", color: theme.text, margin: 0, lineHeight: 1.5 }}>{c.positions[category] || "No stated position"}</p></div>))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={240}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: theme.textMuted, marginBottom: "10px", paddingBottom: "8px", borderBottom: `1px solid ${theme.border}` }}>Top Campaign Contributors</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {pair.map(c => (<div key={c.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "16px" }}>{c.topDonors.map((d, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}><span style={{ color: theme.textSecondary }}>{d.name}</span><span style={{ fontWeight: 600, color: theme.text }}>{d.amount}</span></div>))}</div>))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={320}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: theme.textMuted, marginBottom: "10px", paddingBottom: "8px", borderBottom: `1px solid ${theme.border}` }}>Legislative Record</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {pair.map(c => (<div key={c.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "16px" }}>{c.keyVotes.length === 0 ? (<p style={{ fontSize: "13px", color: theme.textMuted, fontStyle: "italic" }}>No legislative record — first-time candidate</p>) : c.keyVotes.map((v, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}><span style={{ fontSize: "14px", color: theme.text }}>{v.bill}</span><span style={{ fontSize: "12px", fontWeight: 600, color: theme.textSecondary }}>{v.vote}</span></div>))}</div>))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={400}><div style={{ fontSize: "12px", color: theme.textMuted, marginTop: "16px", textAlign: "center" }}>All information sourced from GovTrack.us, FEC.gov, and Congress.gov</div></FadeIn>
      </div>
    </div>
  );
}

/* ── main app ── */
type PageParams = Record<string, unknown>;

export default function InformedApp() {
  const [page, setPage] = useState("home");
  const [params, setParams] = useState<PageParams>({});
  const navigate = (p: string, pr: PageParams = {}) => { setPage(p); setParams(pr); window.scrollTo(0, 0); };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253, 252, 249, 0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "54px" }}>
          <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: "19px", fontWeight: 700, color: theme.primary, padding: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>Informed
          </button>
          <div style={{ display: "flex", gap: "4px" }}>
            {[{ label: "Register", p: "register" }, { label: "Candidates", p: "home" }, { label: "Contact Reps", p: "contact" }, { label: "Stay Engaged", p: "track" }].map(item => (
              <button key={item.p} onClick={() => navigate(item.p)} style={{ padding: "6px 12px", background: "none", border: "none", fontSize: "13px", fontWeight: 500, color: theme.textSecondary, cursor: "pointer", borderRadius: "6px", transition: "background 0.2s, color 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = theme.surfaceHover; (e.currentTarget as HTMLButtonElement).style.color = theme.text; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = theme.textSecondary; }}>{item.label}</button>
            ))}
          </div>
        </div>
      </nav>

      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "races" && <RaceSelectionPage zip={params.zip as string} onNavigate={navigate} />}
      {page === "candidates" && <CandidateListPage zip={params.zip as string} raceId={params.raceId as string} raceName={params.raceName as string} electionDate={params.electionDate as string} onNavigate={navigate} />}
      {page === "candidate-detail" && <CandidateDetailPage zip={params.zip as string} raceId={params.raceId as string} raceName={params.raceName as string} electionDate={params.electionDate as string} candidateId={params.candidateId as string} onNavigate={navigate} />}
      {page === "compare" && <ComparePage zip={params.zip as string} raceId={params.raceId as string} raceName={params.raceName as string} electionDate={params.electionDate as string} candidateIds={params.candidateIds as string[]} onNavigate={navigate} />}

      {page === "register" && (
        <div style={{ minHeight: "100vh", background: theme.bg, padding: "80px 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: theme.primary }}><Icons.CheckCircle /></div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: theme.text, margin: "0 0 10px", fontFamily: "'Georgia', serif" }}>Register to Vote</h1>
              <p style={{ color: theme.textSecondary, margin: "0 auto 36px", lineHeight: 1.6, fontSize: "15px" }}>Voting is one of the most powerful ways to participate in your democracy. Choose the option that fits your situation.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" as const }}>
                <a href="https://vote.org/register-to-vote/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.primary; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.border; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.primary, flexShrink: 0 }}><Icons.Home /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: "15px", color: theme.text, marginBottom: "2px" }}>I live in the United States</div><div style={{ fontSize: "13px", color: theme.textSecondary }}>Register through Vote.org — quick and easy</div></div>
                  <div style={{ color: theme.textMuted }}><Icons.ExternalLink /></div>
                </a>
                <a href="https://www.fvap.gov" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.primary; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.border; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: theme.infoBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.info, flexShrink: 0 }}><Icons.Globe /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: "15px", color: theme.text, marginBottom: "2px" }}>I&apos;m a U.S. citizen living abroad</div><div style={{ fontSize: "13px", color: theme.textSecondary }}>Register and request an absentee ballot through FVAP.gov</div></div>
                  <div style={{ color: theme.textMuted }}><Icons.ExternalLink /></div>
                </a>
              </div>
              <p style={{ fontSize: "12px", color: theme.textMuted, marginTop: "24px", lineHeight: 1.5 }}>FVAP.gov is the Federal Voting Assistance Program, run by the U.S. Department of Defense, serving military members, their families, and overseas citizens.</p>
            </div>
          </FadeIn>
        </div>
      )}

      {page === "contact" && (
        <div style={{ minHeight: "100vh", background: theme.bg, padding: "80px 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: theme.plumBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: theme.plum }}><Icons.MessageCircle /></div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: theme.text, margin: "0 0 10px", fontFamily: "'Georgia', serif" }}>Contact Your Representative</h1>
              <p style={{ color: theme.textSecondary, margin: "0 auto 36px", lineHeight: 1.6, fontSize: "15px" }}>Your representatives work for you. Reaching out — whether by phone, email, or letter — is one of the most direct ways to make your voice heard on the issues you care about.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" as const }}>
                <a href="https://www.usa.gov/elected-officials" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.plum; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.border; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: theme.plumBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.plum, flexShrink: 0 }}><Icons.Users /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: "15px", color: theme.text, marginBottom: "2px" }}>Find your elected officials</div><div style={{ fontSize: "13px", color: theme.textSecondary }}>Look up contact info for federal, state, and local representatives on USA.gov</div></div>
                  <div style={{ color: theme.textMuted }}><Icons.ExternalLink /></div>
                </a>
                <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.plum; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.border; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: theme.infoBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.info, flexShrink: 0 }}><Icons.Home /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: "15px", color: theme.text, marginBottom: "2px" }}>Find your U.S. House Representative</div><div style={{ fontSize: "13px", color: theme.textSecondary }}>Search by zip code on the official House.gov website</div></div>
                  <div style={{ color: theme.textMuted }}><Icons.ExternalLink /></div>
                </a>
                <a href="https://www.senate.gov/senators/senators-contact.htm" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.plum; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = theme.border; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: theme.goldBg, display: "flex", alignItems: "center", justifyContent: "center", color: theme.gold, flexShrink: 0 }}><Icons.Globe /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: "15px", color: theme.text, marginBottom: "2px" }}>Contact your U.S. Senators</div><div style={{ fontSize: "13px", color: theme.textSecondary }}>Find senator contact forms and phone numbers on Senate.gov</div></div>
                  <div style={{ color: theme.textMuted }}><Icons.ExternalLink /></div>
                </a>
              </div>
              <div style={{ marginTop: "32px", padding: "18px", background: theme.surfaceHover, borderRadius: "10px", border: `1px solid ${theme.border}`, textAlign: "left" as const }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: theme.text, marginBottom: "6px" }}>U.S. Capitol Switchboard</p>
                <p style={{ fontSize: "14px", color: theme.textSecondary, margin: "0 0 4px" }}>You can also call <strong style={{ color: theme.text }}>(202) 224-3121</strong> to be connected to any member of Congress.</p>
                <p style={{ fontSize: "12px", color: theme.textMuted, margin: 0 }}>The operator can connect you to your senator or representative&apos;s office directly.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      )}

      {page === "track" && (
        <div style={{ minHeight: "100vh", background: theme.bg, padding: "80px 24px", textAlign: "center" }}>
          <FadeIn>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: theme.goldBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: theme.gold }}><Icons.ClipboardCheck /></div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: theme.text, margin: "0 0 10px", fontFamily: "'Georgia', serif" }}>Track Promise Follow-Through</h1>
            <p style={{ color: theme.textSecondary, maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.6, fontSize: "15px" }}>Democracy doesn&apos;t end at the ballot box. After the November 2026 election, you&apos;ll be able to follow your representatives&apos; work, see whether they deliver on their campaign promises, and stay connected to the decisions that affect your community.</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: theme.goldBg, color: theme.gold, borderRadius: "8px", fontSize: "14px", fontWeight: 600, border: `1px solid ${theme.goldBorder}` }}><Icons.Bell /> Coming after the November 2026 election</div>
          </FadeIn>
        </div>
      )}

      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: "28px 24px", textAlign: "center", fontSize: "12px", color: theme.textMuted, lineHeight: 1.6 }}>
        <div style={{ marginBottom: "4px" }}><strong style={{ color: theme.gentle }}>Informed</strong> — Open source civic technology</div>
        Information sourced from official government data • Free to use • Your privacy is protected
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        * { box-sizing: border-box; margin: 0; }
        ::selection { background: ${theme.primaryBg}; color: ${theme.primary}; }
      `}</style>
    </div>
  );
}