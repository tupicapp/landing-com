[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/2oj1p.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

# tupic.com — Landing Page


## Development

```bash
npm install
npm run dev
```

Environment variables:

```bash
VITE_IAM_BASE_URL=https://iam.tupic.com
VITE_IAM_REALM=tupic
VITE_IAM_CLIENT_ID=...
VITE_IAM_REDIRECT_URI=...
VITE_ACCOUNTS_URL=https://accounts.tupic.com
```

## Build

```bash
npm run build
```

Outputs built `index.html` and `assets/` to the project root for GitHub Pages.

## Deploy

Commit both `index.html` and the `assets/` folder. GitHub Pages serves directly from the repository root.
