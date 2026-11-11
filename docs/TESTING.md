# Test workflow and verification status

## Test inventory

The bundled Jest source contains 69 declared test/it cases by static count:
- Unit: 25
- Integration: 26
- Security: 18

These are declaration counts, not evidence that the tests pass, that coverage thresholds are met, or that the application is secure.

## Reproduce locally

```bash
cd project
npm ci
npm test -- --runInBand
npm run test:unit -- --runInBand
npm run test:integration -- --runInBand
npm run test:security -- --runInBand
npm run test:coverage -- --runInBand
```

## Continuous integration

`.github/workflows/compliance-assistant-tests.yml` installs dependencies from `package-lock.json` and runs the full Jest suite on pushes and pull requests.

## Verified GitHub Actions run

<badge>CI passed</badge>

- Workflow run: [#3 — Compliance Assistant tests](https://github.com/tishaaaaaaaaa5-sketch/COMPLIANCE-ASSISTANT/actions/runs/43122334444)
- Commit: `234b1be37da4442db5c3c3e00f92b6f7edc342b2`
- Runtime: Node.js 22.23.4 on `ubuntu-latest`
- Dependency installation: `npm ci` succeeded using the committed lockfile
- Result: **3 test suites passed; 69 tests passed; 0 failed**

This is a reproducible CI pass for the committed source at that SHA. Re-run the workflow after future code changes; do not carry the green status forward to later commits without a new run.