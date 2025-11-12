# Worksense Scheduling App

## Overview

Worksense is a small workplace scheduling application providing shift management, time off requests, and shift swap capabilities.

This repository contains:

1. `Frontend/` – Front-end client (setup TBD)
2. `server/` – Express + TypeScript API server

## Database Setup (Minimal)

The database schema is defined in `server/migrations/20231110_initial.sql`.

To set up the database:

1. Create a Supabase or Postgres database
2. Open the SQL Editor (Supabase Dashboard → SQL Editor, or use `psql`)
3. Copy and paste the contents of `server/migrations/20231110_initial.sql`
4. Run the SQL to create tables

## Database Schema

Tables:
| Table | Purpose |
|-------|---------|
| `users` | Employee and manager accounts (with role) |
| `shifts` | Individual work shifts; may be unassigned (`assigned_to` NULL) |
| `time_off_requests` | Employee time off periods with approval workflow |
| `shift_swap_requests` | Requests to swap assigned shifts |

Important constraints:

- Unique `users.email`
- Validated role via CHECK constraint
- `end_time > start_time` for shifts
- `end_date >= start_date` for time off

## Server Setup

1. Install dependencies (inside `server/`):
   ```bash
   cd server
   npm install
   ```
2. Configure environment variables in `server/.env` as needed for your API server
3. Start development server:
   ```bash
   npm run dev
   ```

## Contributing

Create feature branches (e.g. `database`, `auth`, `shifts-ui`) and open PRs for review.
