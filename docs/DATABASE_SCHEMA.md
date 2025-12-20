# Informed App - Database Schema

## Overview
16 tables supporting three core functions:
1. Voter Registration (2 tables)
2. Candidate Understanding (8 tables)
3. Post-Election Tracking (4 tables)

## Core Tables (2)

### users
- **Purpose:** User accounts (extends Supabase auth.users)
- **RLS:** Enabled (users can only see their own data)
- **Key columns:** id, email, created_at, updated_at

### elections
- **Purpose:** Election metadata (date, level, location)
- **RLS:** Disabled (public data)
- **Key columns:** id, year, level, state, election_date, type
- **Indexes:** state, election_date, year

## Function 1: Voter Registration (2 tables)

### voter_registrations
- **Purpose:** Track user registration status per state
- **RLS:** Enabled (user-specific)
- **Key columns:** user_id, state, registration_status, registration_date
- **Indexes:** user_id, state

### election_deadlines
- **Purpose:** Registration deadlines by state/election
- **RLS:** Disabled (public data)
- **Key columns:** state, election_id, registration_deadline, election_date
- **Indexes:** state, election_id

## Function 2: Candidate Understanding (8 tables)

### candidates
- **Purpose:** Core candidate info (all election levels)
- **RLS:** Disabled (public data)
- **Key columns:** name, office_level, office_type, state, district, election_id, party
- **Indexes:** election_id, state, name, office_type

### candidate_bills
- **Purpose:** Bills sponsored/voted on by candidates
- **Key columns:** candidate_id, bill_id, vote_type, vote_date, bill_status
- **Indexes:** candidate_id, bill_id

### candidate_donations
- **Purpose:** Campaign finance data
- **Key columns:** candidate_id, donor_name, donor_type, amount, cycle
- **Indexes:** candidate_id, cycle, donor_type

### candidate_stock_trades
- **Purpose:** STOCK Act trade disclosures
- **Key columns:** candidate_id, ticker, transaction_type, trade_date
- **Indexes:** candidate_id, trade_date

### candidate_policy_positions
- **Purpose:** Candidate positions on issues
- **Key columns:** candidate_id, issue_category, position_text, source_url
- **Indexes:** candidate_id, issue_category

### candidate_endorsements
- **Purpose:** Endorsements received
- **Key columns:** candidate_id, endorser_name, endorser_type
- **Indexes:** candidate_id

### candidate_controversies
- **Purpose:** Ethics issues and controversies
- **Key columns:** candidate_id, title, severity, verified
- **Indexes:** candidate_id, severity

### candidate_summaries
- **Purpose:** AI-generated summaries
- **Key columns:** candidate_id, summary_type, summary_text, citations
- **Indexes:** candidate_id, summary_type

## Function 3: Post-Election Tracking (4 tables)

### tracked_candidates
- **Purpose:** User's tracked elected officials
- **RLS:** Enabled (user-specific)
- **Key columns:** user_id, candidate_id, notification_frequency
- **Indexes:** user_id, candidate_id

### candidate_activity_log
- **Purpose:** Timeline of official activity
- **Key columns:** candidate_id, activity_type, activity_date, description
- **Indexes:** candidate_id, activity_date, activity_type

### user_notifications
- **Purpose:** User alerts on tracked officials
- **RLS:** Enabled (user-specific)
- **Key columns:** user_id, tracked_candidate_id, notification_type, read_at
- **Indexes:** user_id, read_at

### user_promises_tracker
- **Purpose:** Campaign promises vs. voting record
- **RLS:** Enabled (user-specific)
- **Key columns:** user_id, candidate_id, promise_text, status
- **Indexes:** user_id, candidate_id, status

## Relationships
- elections → candidates (one-to-many)
- candidates → candidate_bills, candidate_donations, candidate_stock_trades, etc. (one-to-many)
- users → voter_registrations, tracked_candidates, user_notifications, user_promises_tracker (one-to-many)
- tracked_candidates → user_notifications (one-to-many)