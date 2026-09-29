# Deploying to VentraIP

## What this site is

Plain static HTML/CSS/JS (no build step, no Node.js server) plus one small PHP
script for the event-enquiry form. This matches standard VentraIP shared/cPanel
hosting, which serves static files directly and includes PHP by default.

## Files that make up the live site

```
index.html              the whole site (routes between Home/Menu/About/Events with a URL hash, no page reloads)
css/style.css
js/app.js
php/enquiry-handler.php  handles the "Send enquiry" form, emails hello.matchasan@gmail.com
assets/                  logo, photos, videos (see assets/images/README.txt and assets/videos/README.txt)
```

The repo root now only contains these files, so everything present is safe to
upload — the original design-tool prototype export and the source menu
PDFs/screenshots have already been removed.

## Upload steps (cPanel File Manager or FTP)

1. Log in to the VentraIP cPanel for the domain.
2. Open File Manager (or connect via FTP/SFTP) and go to `public_html/`
   (or the subfolder for the domain, if it's an addon domain).
3. Upload `index.html`, `css/`, `js/`, `php/`, and `assets/` keeping the same
   folder structure.
4. Visit the domain in a browser and click through Home / Menu / About / Events.

## Enquiry form (PHP mail)

`php/enquiry-handler.php` uses PHP's built-in `mail()` function, which works
out of the box on VentraIP shared hosting without any extra setup. It sends to
`hello.matchasan@gmail.com` — change the `RECIPIENT_EMAIL` constant near the
top of that file if that inbox changes.

Because `mail()` depends on the live server's mail configuration, **it cannot
be tested locally** (there's no PHP/mail server on this machine) — it was
tested by mocking the fetch response instead. Test it for real once it's live:
submit the form on the deployed site and confirm the email arrives. If it
doesn't, check VentraIP's cPanel "Email Deliverability" tool for the domain —
shared hosting sometimes needs SPF/DKIM records added before outgoing mail is
accepted by Gmail.

## Adding real photos later

Drop files into `assets/images/{home,drinks,events,about}/` using the exact
names listed in `assets/images/README.txt`. The page automatically shows the
real photo once the file exists, and falls back to the current placeholder box
if it's missing — no code changes needed.

## Adding Square checkout later

No framework needed for this. Square's own embeddable Buy Button, hosted
checkout link, or the Web Payments SDK (`<script>` tag + a bit of vanilla JS)
all drop straight into `index.html` / `js/app.js` as-is.
