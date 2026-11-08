# Slotidy

Marketing site for Slotidy, a done-for-you AI voice receptionist for dental clinics and chiropractic practices in the UK and US.

The page is a single offer: book a call. Placeholders for the calendar link, contact details and founder photo live in `src/config/site.ts`.

The demo section places a live call to Sophie, an AI receptionist for a fictional clinic. Set `RETELL_API_KEY` in the Vercel project environment. `api/create-web-call` uses that key on the server and returns only an access token to the browser.

## Run locally

```bash
npm install
npm run dev
```

The dev server listens on port 4327 on all interfaces, including IPv4 and IPv6.

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

This runs `oxlint` over the project. Run it before opening a PR.

## Environment variables

- `RETELL_API_KEY`: server-side only, used by `api/create-web-call`. Set it in the Vercel project settings. Never commit it to the repo.

Local development uses an untracked `.env` file. Values are never committed.

## Deployment

The site deploys via Vercel. Environment variables are configured in the Vercel dashboard. `vercel.json` rewrites all non-`api/` routes to `index.html`.

## Placeholders

Replace these values in `src/config/site.ts`:

- `[CALENDLY_LINK]`
- `[CONTACT_EMAIL]`
- `[FOUNDER_PHOTO]`
- `[LINKEDIN_URL]`
- `[COMPANY_DETAILS]`
- `[CANONICAL_URL]`
