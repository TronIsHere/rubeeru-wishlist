# روبه‌رو · فهرست انتظار

A one-page waitlist for [rubeeru](../doom) with an admin panel. Same brand, tokens, fonts and mist panel as the main app, but a separate Next.js project with its own MongoDB database.

## Run

```bash
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm install
npm run dev                  # http://localhost:3210
```

| Env | Meaning |
| --- | --- |
| `MONGODB_URI` | MongoDB server. |
| `MONGODB_DB` | Database name (default `rubeeru_waitlist`), one `waitlist` collection. |
| `ADMIN_PASSWORD` | Password for `/admin`. Unset = the panel is locked. Changing it signs every admin out. |

## Pages

- `/` signup: name, mobile or email, optional use case. Same phone/email twice shows the original place in line. `?ref=twitter` is stored on the signup.
- `/admin` stats, status filter (pending / invited / rejected), search, bulk invite / reject / delete, copy contact, CSV export (`/admin/export`).

## Granting access

Marking someone «دعوت‌شده» only records it here; this app sends nothing. Export the list or copy the contact, then send the invite from the main app's channel. Wiring SMS/email sending into `setStatus` (`app/admin/actions.ts`) is the natural next step.

## Notes

- Rate limits (signup 6/h per IP, admin login 5/15 min per IP) are in memory: right for one server process, reset on restart.
- Behind a proxy, make sure `x-forwarded-for` is set, or all visitors share one limit bucket.
- The voice and photo are Erwin's (`FOUNDER` in `lib/brand.ts`, `public/erwin.png`, `components/founder.tsx`); change them there.
- Brand lives in `lib/brand.ts`, `public/logo.svg`, `components/logo.tsx`: keep in sync with the main app.
