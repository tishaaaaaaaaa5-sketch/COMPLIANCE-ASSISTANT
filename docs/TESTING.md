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

## Verification note for this repository update

A local attempt to install dependencies did not complete within the available environment time. The subsequent test command could not find the Jest executable because installation was incomplete. This is an **environment/setup failure**, not a passing or failing test result. The first successful GitHub Actions run should be recorded here with the workflow run URL, Node/npm versions, exit code, test totals, and coverage summary.

Do not claim “69 tests passing” until CI actually reports that result.