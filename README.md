# Informed: Political Transparency App

> "An educated, enlightened and informed population is one of the surest ways of promoting the health of a democracy." — Nelson Mandela

Informed helps U.S. citizens make better-informed voting decisions and holds elected officials accountable after the election.

## What Informed Does

### 1. Help You Register to Vote
Get registration deadlines, polling locations, and direct links to official registration portals—all based on your location.

### 2. Understand Candidates
Research candidates before you vote using comprehensive, unbiased information:
- Legislative records (bills sponsored, voting patterns, attendance)
- Campaign finance (who funds them, donor patterns, stock trades)
- Policy positions on key issues
- Endorsements and controversies
- Plain-language AI summaries with citations to official sources

Compare candidates side-by-side to make informed choices.

### 3. Track Elected Officials
After the election, monitor whether your elected officials deliver on their promises:
- Track new bills they sponsor or vote on
- See how their voting record compares to campaign promises
- Monitor ongoing donor patterns and fundraising
- Get notifications on their legislative activity

## Why Informed?

**Unbiased:** All information comes from official government sources (voting records, campaign finance disclosures, legislative data) — never opinion.

**Transparent:** Every claim is cited with links to original source data.

**Accessible:** Complex political information is presented in plain language, not jargon.

**Privacy-First:** Your data is never sold or shared. We collect only what we need. You can delete your account anytime.

**Open Source:** Built in the open. Community contributions welcome.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (React) | Fast, SSR-friendly, great for civic apps |
| Backend | Node.js + Express | Lightweight, secure, easy to understand |
| Database | Supabase (PostgreSQL) | Free tier generous, built-in auth, relational data |
| Authentication | Supabase Auth | GDPR-compliant, secure, free |
| AI | Claude API | Better reasoning for political summaries |
| Hosting | Vercel + Railway/Render | Free tier, easy deployments, auto-scaling |

## Data Sources

Informed aggregates data from official U.S. government APIs:
- **Google Civic Information API** — Elections, registration deadlines, polling locations
- **GovTrack API** — Bills, voting records, legislative activity
- **Congress.gov API** — Official legislative data
- **FEC API** — Campaign finance disclosures
- **OpenSecrets API** — Campaign donations, donor patterns
- **Quiver Quant API** — Congressional stock trades

All data is public and freely available. We make it accessible and understandable.

## Privacy & Security

Your privacy is fundamental to Informed:
- **No personal data sales:** Your information is never sold or shared with third parties
- **Minimal collection:** We collect only what's needed (zip code for elections, optional login for tracking)
- **Encrypted:** All data in transit (HTTPS) and at rest (Supabase encryption)
- **GDPR/CCPA ready:** You can request your data, edit it, or delete it anytime
- **Audit logging:** All access is logged for security

See [PRIVACY.md](docs/PRIVACY.md) for details.

## Getting Started (Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/informed-app.git
   cd informed-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the template
   cp backend/.env.example backend/.env.local
   cp frontend/.env.example frontend/.env.local
   
   # Fill in your API keys and database URL
   # See docs/SETUP.md for detailed instructions
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

The app will be available at `http://localhost:3000`

### First Run Checklist
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Database connected (Supabase)
- [ ] API keys configured
- See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for troubleshooting

## Project Structure

```
informed-app/
├── frontend/                 # Next.js frontend
│   ├── pages/               # Page routes
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── styles/              # CSS/Tailwind
│   └── README.md            # Frontend-specific docs
│
├── backend/                 # Express backend
│   ├── routes/              # API routes
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── middleware/          # Auth, logging, etc.
│   └── README.md            # Backend-specific docs
│
├── docs/
│   ├── ARCHITECTURE.md      # System design
│   ├── API_GUIDE.md         # How to use each API
│   ├── SCHEMA.md            # Database schema
│   ├── PRIVACY.md           # Privacy policy
│   ├── SECURITY.md          # Security practices
│   ├── SETUP.md             # Setup instructions
│   └── DEVELOPMENT.md       # Development guide
│
├── .env.example             # Environment template (no secrets!)
├── README.md                # This file
├── CONTRIBUTING.md          # Contribution guidelines
├── CODE_OF_CONDUCT.md       # Code of conduct
└── LICENSE                  # MIT License
```

## Development Roadmap

| Phase | Weeks | Focus |
|-------|-------|-------|
| **Phase 1** | 1-4 | Foundation: Infrastructure, APIs, database schema |
| **Phase 2** | 5-8 | Frontend & Voter Registration: UI, voter registration flow, AI summaries |
| **Phase 3** | 9-12 | Accountability Tracking: Bill monitoring, promise tracking, notifications |
| **Phase 4** | 13-16 | Polish & Launch: Testing, security audit, deployment |

See [ROADMAP.md](docs/ROADMAP.md) for detailed breakdown.

## Contributing

We welcome contributions! Whether it's bug fixes, features, documentation, or ideas—we want your help.

**Before you start:**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
3. Review [docs/SECURITY.md](docs/SECURITY.md) for security practices
4. Open an issue to discuss your idea before large changes

**Getting started:**
- Look for issues labeled `good-first-issue` or `help-wanted`
- Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup help
- Join discussions in GitHub Issues/Discussions

## Security & Privacy

Security is not optional for a civic tool. We take it seriously:
- All code is reviewed before merging
- Dependencies are regularly updated
- Security vulnerabilities are reported responsibly
- Privacy practices follow GDPR/CCPA standards

See [docs/SECURITY.md](docs/SECURITY.md) for our full security practices.

## Questions?

- **Usage questions:** Open a GitHub Discussion
- **Bug reports:** Open a GitHub Issue
- **Security concerns:** Email [to be provided] (do not open a public issue)
- **General inquiries:** See [docs/FAQ.md](docs/FAQ.md)

## License

MIT License — see [LICENSE](LICENSE) file for details.

This means the code is free to use, modify, and distribute. We believe civic tech should be open.

## Status

🚀 **Early Development** — We're actively building this. Expect rapid changes. Want to help shape the future? Contribute!

- **Current Phase:** Phase 1 (Weeks 1-4)
- **Latest Update:** [Check releases](https://github.com/Drew3710/informed-app/releases)
- **Known Issues:** [See GitHub Issues](https://github.com/Drew3710/informed-app/issues)

---

**Inspired by civic tech models from around the world. Built with 🇺🇸 for democracy.**