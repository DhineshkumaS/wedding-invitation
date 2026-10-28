# Wedding Invitation

A responsive React + Vite wedding invitation website using a Mocha Brown, Champagne Gold, and Burnt Amber palette.

## Included
- Multi-section wedding website (not a scanned invitation image)
- Couple names, invitation text, date, time, and venue
- Responsive mobile navigation
- Live countdown (shows a post-event message after the wedding date)
- Google Maps directions link
- Downloadable calendar event (.ics)
- No backend or environment variables required

## Run locally
Install Node.js (LTS), then run:

```bash
npm install
npm run dev
```

Vite prints a local URL (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deploy to Vercel
1. Create a GitHub repository and upload these project files.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Click **Deploy**.

No environment variables are required.

## Change wedding details
Edit the `wedding` object near the top of `src/main.jsx`. The countdown date is read from `wedding.start`, and the displayed date/time labels are set there too.
