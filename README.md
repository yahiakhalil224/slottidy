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

Run the linter before opening a pull request.

```bash
npm run lint
```

## Environment variables

- `RETELL_API_KEY`: server-side only. Used by `api/create-web-call` to start the demo call. Set it in the Vercel project settings and never commit it to the repository.

Do not commit a `.env` file.

## Deployment

Slotidy is deployed on Vercel. Pushes to `main` are deployed automatically. Environment variables are configured in the Vercel dashboard, not in the repo.

## Placeholders

Replace these values in `src/config/site.ts`:

- `[CALENDLY_LINK]`
- `[CONTACT_EMAIL]`
- `[FOUNDER_PHOTO]`
- `[LINKEDIN_URL]`
- `[COMPANY_DETAILS]`
- `[CANONICAL_URL]`
