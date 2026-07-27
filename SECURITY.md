# Security Policy

## Supported versions

This is a single deployed site. "Supported" means whatever is live at
<https://anesis-dev.vercel.app>; fixes ship there and there is no back-porting.

## Reporting a vulnerability

**Do not open a public issue for a security problem.**

Use GitHub's private vulnerability reporting on this repository:
[Security → Report a vulnerability](https://github.com/anesis-dev/anesis-web/security/advisories/new).

Include what the issue is, how to reproduce it, and what an attacker gains. You
should get an acknowledgement within 7 days. Confirmed issues are fixed,
deployed, and then published as a GitHub Security Advisory crediting you unless
you ask otherwise.

## Scope

In scope:

- XSS anywhere — most importantly in rendered user content. The site renders
  README markdown from arbitrary GitHub repositories through `rehype-raw`, which
  permits raw HTML; `rehype-sanitize` is what keeps that safe, so a sanitizer
  bypass is a real finding.
- Anything that leaks or misuses a session cookie or an API token, including
  through the `/api/backend/*` proxy.
- CSRF against any state-changing action.
- A gap in the Content-Security-Policy or the other response headers set in
  `next.config.ts` that has demonstrable impact.
- Client-side routing or metadata handling that lets an attacker control a
  redirect target.

Out of scope:

- Missing headers on responses that carry no credentialed content.
- Automated scanner output with no demonstrated impact.
- Issues in the registry API itself — report those to
  [anesis-server](https://github.com/anesis-dev/anesis-server/security/advisories/new).
- Rate limiting: it is enforced by the API, not by this app.

## Notes for reviewers

- Session state lives in an HTTP-only cookie set by the API. This app never
  reads a JWT in JavaScript.
- API tokens are shown exactly once, at creation, and are never re-fetchable.
- `getApiUrl()` throws in a production build rather than falling back to
  `localhost`, so a misconfigured deploy fails loudly instead of pointing every
  visitor's browser at their own machine.
