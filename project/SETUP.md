# Local setup

## Requirements

- Node.js 20 or later (Node 22 is used by the CI workflow).
- npm.
- A Google AI Studio API key for Gemini-backed analysis.
- Optional: a GitHub token to increase public GitHub API rate limits.

## Install

From the repository root:

```bash
cd project
npm ci
```

## Configure secrets

```bash
cp .env.example .env
```

Set `GEMINI_API_KEY` in `project/.env`. Optionally set `GITHUB_TOKEN`. Keep `.env` private; it is excluded from version control. Do not paste keys into issues, screenshots, notebooks, or logs.

## Start the server

```bash
npm start
```

The default application port is defined in `server.js`; set `PORT` in `.env` if you need to change it.

## Run tests

```bash
npm test -- --runInBand
npm run test:unit -- --runInBand
npm run test:integration -- --runInBand
npm run test:security -- --runInBand
```

The GitHub Actions workflow runs `npm ci` and the full Jest suite. Treat the Actions run—not a static count of test declarations—as the authoritative test status.

## MCP server

```bash
npm run mcp
```

The MCP server uses stdio transport. Configure the same Gemini API key in the environment of the MCP host.

## Safety and scope

The tool produces preliminary AI-assisted observations. It does not certify compliance or replace an independent audit. Review every finding, verify the referenced code, and confirm framework applicability with a qualified reviewer.