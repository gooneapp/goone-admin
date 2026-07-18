# goone-admin
GoOne Admin Dashboard


## goone-admin/README.md

# GoOne Admin CMS

**Description:** The GoOne Admin is a web-based admin panel (React) for managing content, users, and system settings. It allows administrators to approve businesses, monitor orders, and push notifications.  
**Tagline:** One App. One Community. Unlimited Opportunities.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) [![Coverage](https://img.shields.io/badge/coverage-100%25-green.svg)](#) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)

## Table of Contents

- [Quick Start](#quick-start)  
- [Architecture](#architecture)  
- [Features](#features)  
- [Folder Structure](#folder-structure)  
- [Key Scripts](#key-scripts)  
- [Environment Variables](#environment-variables)  
- [Building & Testing](#building--testing)  
- [CI/CD](#cicd)  
- [Deployment](#deployment)  
- [Accessibility](#accessibility)  
- [Contributing](#contributing)  
- [Issue Templates](#issue-templates)  
- [Security](#security)  
- [License](#license)  
- [Maintainers & Contacts](#maintainers--contacts)  
- [ADR & Docs](#adr--docs)  
- [Design](#design)

## Quick Start

1. **Prerequisites:** Node.js (18+), Yarn.  
2. **Install:**  
   ```bash
   git clone https://github.com/your-org/goone-admin.git
   cd goone-admin
   yarn install
   ```  
3. **Configure:** Copy `.env.example` to `.env`. Example variables: `REACT_APP_API_URL` (backend endpoint), `NODE_ENV`.  
4. **Run (Dev):**  
   ```bash
   yarn start
   ```  
   Opens the admin UI at `http://localhost:3000`.  
5. **Build:**  
   ```bash
   yarn build
   ```  
   Creates a production build in `build/`.

This sets up the admin dashboard locally.

## Architecture

Admin UI is a single-page app that calls the Backend API. Diagram:

```mermaid
graph LR
    AdminWeb[Admin Panel (React)] -->|HTTPS| API[Backend API]
    API --> Postgres[(PostgreSQL)]
```

Here, AdminWeb is served as static files. This architecture overview explains that the admin panel is purely client-side and relies on the same backend.

## Features

- Business approval workflow (accept/decline registrations).  
- Order monitoring dashboard (view all orders, filter by status).  
- User management (view/edit customer/business accounts).  
- Notification composer (send in-app or push notifications).  

List key admin functionalities. Link to relevant API docs if needed.

## Folder Structure

```
goone-admin/
├── src/
│   ├── components/  # UI components (tables, forms, dialogs)
│   ├── pages/       # Routes (Dashboard, Users, Orders, Settings)
│   ├── services/    # API calls, authentication
│   └── App.js
├── public/
├── .env.example
├── package.json
└── README.md
```

(This is a typical CRA/Next.js project structure.)

## Key Scripts

- `yarn start` – Run dev server (usually on port 3000).  
- `yarn build` – Create production build.  
- `yarn test` – Run unit tests (e.g. with React Testing Library).  
- `yarn lint` – Lint code (ESLint/Prettier).

## Environment Variables

Example `.env.example`:

```env
REACT_APP_API_URL=https://api.goone.example   # Backend API base URL
NODE_ENV=development
```

As usual, explain each variable. Admin frontend uses the same backend endpoints, so just the base URL is needed.

## Building & Testing

- **Development:** `yarn start`.  
- **Production:** Serve the `build/` folder with Nginx or a Node static server.  
- **Testing:** Use Jest and React Testing Library:  
  ```bash
  yarn test
  ```  
Include any end-to-end test setup if applicable (e.g. Cypress).

## CI/CD

A CI pipeline (GitHub Actions) should run on push/PR, performing `yarn test` and `yarn lint`, and building the app. For example:

```yaml
name: Admin CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: yarn install
      - run: yarn lint
      - run: yarn test
      - run: yarn build
```

After a successful build, you can deploy the `build/` assets to a web host (see Deployment). Document the deployment trigger (e.g. push to `main`).

## Deployment

The admin UI is a static site. Example deployment steps:

- **Heroku/Netlify:** Push to `main` triggers auto-build via GitHub integration.  
- **Docker:** Build an image that serves the `build/` folder with Nginx. Example in `docker-compose.yml`.  

Provide a sample `docker-compose.yml` for reference if using Docker:

```yaml
version: '3.8'
services:
  admin:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
```

(*Adjust to actual deployment method.*)

## Accessibility

Follow one-hand usage guidelines: ensure the admin UI is responsive and can be used easily on tablets or small screens. Use semantic HTML, ARIA labels for forms, and ensure high contrast. For example, use large buttons/inputs and include skip navigation links. Describe any audits performed (e.g. Lighthouse).

## Contributing

Branch from `main`, commit with clear messages, and open a PR. As with other repos, we follow our main CONTRIBUTING guidelines.

## Issue Templates

Use the same set of issue templates as other repos. Admin-specific issues (e.g. UI bug) should still use bug report template.

## Security

The admin UI should not expose any secrets. Protect admin routes on the backend. Use HTTPS to serve assets. Describe any measures (e.g. content security policy) to protect against XSS or CSRF in the admin context.

## License

MIT License (see [LICENSE](../LICENSE)).

## Maintainers & Contacts

- **Frontend Lead:** Ingrid UI (ingrid@example.com)  
- **Admin Team:** Jack Admin (jack@example.com)  

## ADR & Docs

See ADRs for frontend choices. For general docs, see [goone-docs](../goone-docs).

## Design

Admin UI mockups are in Figma: [GoOne Admin Panel Designs](https://www.figma.com/GoOne-Admin-Designs) (TODO link).

---

*End of Admin CMS README.*  