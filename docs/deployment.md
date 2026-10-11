# Deploying: GitHub Pages + custom domain

Static HTML/CSS/JS, no build step. Hosted on GitHub Pages from the `main` branch root.

## GitHub Pages
1. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
2. Custom domain: `matchasan.au` (the `CNAME` file in the repo root already says this). Tick "Enforce HTTPS" once the certificate is issued.

## DNS (at the domain host, e.g. VentraIP)
- Apex `matchasan.au`: four A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- Optional AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- `www`: CNAME to `hellomatchasan-netizen.github.io`.
- Remove any other A/AAAA/CNAME records for those names. DNS can take up to a few hours to propagate.

## Enquiry form
GitHub Pages cannot run PHP, so the form posts to FormSubmit (`ENQUIRY_ENDPOINT` in `js/app.js`), which emails `hello.matchasan@gmail.com`.
One-time setup: submit the form once on the live site, then click the activation link FormSubmit emails to that inbox. Enquiries are not delivered until then.

## Photos
Drop files into `assets/images/{home,drinks,events,about}/` using the names in `assets/images/README.txt`.
