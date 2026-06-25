# Founder's Idea Lab

An AI-powered entrepreneur tool for young founders. Built for the UNT Frisco
Digital Health Pioneer Summer Camp 2026, designed for middle and high school
students. Students move through six stations: spot an opportunity, spark ideas,
build a venture canvas, learn money models, remix concepts, and practice
prompting. An AI investor reviews each venture, checks the money model, and
gives a readiness score.

## How it works

The web app is built with React and Vite. The AI features call a small backend
function (`api/claude.js`) that talks to the Anthropic API. The API key stays on
the server as a secret environment variable, so it is never exposed in the
browser. This is the safe way to ship an AI app others can use.

## What you need

1. A free GitHub account.
2. A free Vercel account (it connects to GitHub and hosts the app).
3. An Anthropic API key from the Anthropic Console: https://console.anthropic.com
   API usage is pay as you go. See current pricing at
   https://www.anthropic.com/pricing and the API docs at
   https://docs.claude.com/en/api/overview

## Deploy it (no coding required)

1. Put this folder in a GitHub repository.
   - Create a new repo at https://github.com/new
   - Upload these files, or push them from your computer with git.

2. Connect the repo to Vercel.
   - Go to https://vercel.com, sign in with GitHub, and click "Add New Project."
   - Pick this repository. Vercel detects Vite automatically. Click Deploy.

3. Add your API key as a secret.
   - In Vercel, open the project, then Settings, then Environment Variables.
   - Add a variable named `ANTHROPIC_API_KEY` with your key as the value.
   - Redeploy from the Deployments tab so the key takes effect.

That is it. Vercel gives you a public link anyone can use.

## Run it on your own computer (optional)

You need Node.js 18 or newer (https://nodejs.org).

```bash
npm install
cp .env.example .env      # then open .env and paste your key
npm run dev
```

Open the local address Vite prints. Note: the AI calls need the backend
function, which runs on Vercel. For full local testing including the AI, use
the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Customizing

Everything lives in `src/App.jsx`.

- Colors are in the `C` object near the top (UNT brand palette).
- Markets, audiences, money models, and remix options are plain lists you can
  edit by hand.
- The model can be changed with a `CLAUDE_MODEL` environment variable, or in
  `api/claude.js`.

## A note on the UNT brand

This is an unofficial educational project. It uses UNT brand colors and the
EB Garamond / Arial typography pairing from the UNT Brand Reference Guide, but
it does not include the official UNT logo or trademark. Per UNT brand policy,
official promotional materials must use marks from identityguide.unt.edu and be
approved by the Division of University Brand Strategy and Communications
(ubscbrand@unt.edu) before distribution.

## License

MIT. Free to use, fork, and adapt.
