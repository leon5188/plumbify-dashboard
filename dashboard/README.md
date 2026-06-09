# Plumbify Boss Dashboard

A modern, responsive Next.js application that visualizes GoHighLevel (GHL) workflows, paid invoices, open opportunities, and a technician leaderboard. It runs as a self-contained frontend with a proxy API route that directly queries GHL data.

## Deployed URL
*   **Production Deployment:** [https://dashboard-ivory-chi-92.vercel.app](https://dashboard-ivory-chi-92.vercel.app)
*   **Git Repository:** [leon5188/plumbify-dashboard](https://github.com/leon5188/plumbify-dashboard)

## Features
-   **Live Data Sync:** Connects to the GoHighLevel API to pull workflow states, invoice balances, active jobs, and won opportunities.
-   **Financial Analytics:** Computes Month-to-Date (MTD) Revenue, Average Ticket Size, and Unpaid/Overdue balances in real-time.
-   **Active Jobs Map:** Lists jobs from open opportunities and displays their active status.
-   **Technician Leaderboard:** Dynamically ranks assigned users based on closed-won job volumes and revenues.
-   **Elegant Design:** Sleek dark-mode aesthetic built with Tailwind CSS, custom Geist fonts, and Lucide icons.

## Configuration & Environment Variables
The dashboard requires the following environment variables to connect to GoHighLevel:
-   `GHL_API_KEY`: Your private integration access token (starting with `pit-`).
-   `GHL_LOCATION_ID`: The GoHighLevel Location ID representing your business location.
-   `GHL_BASE_URL`: The LeadConnector API base URL (defaults to `https://services.leadconnectorhq.com`).

These have been pre-configured in Vercel for the `production`, `preview`, and `development` scopes.

## Local Development
To run the dashboard locally:
```bash
cd dashboard
npm install
npm run dev
```

The dev server will spin up on [http://localhost:3000](http://localhost:3000).

## Tech Stack
-   **Framework:** Next.js 16 (App Router + Turbopack)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4
-   **API Requests:** Axios

