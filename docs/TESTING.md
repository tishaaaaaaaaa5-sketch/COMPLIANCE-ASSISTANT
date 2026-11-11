# Testing inventory and evidence

## Test suite

The project contains three Jest suites with 69 declared tests:

| Suite | Declared tests |
|---|---:|
| Unit | 25 |
| Integration | 26 |
| Security | 18 |
| **Total** | **69** |

**Maintainer-reported result:** The project maintainer reports that all 69 tests pass.

**Independent verification status:** This repository update did not independently reproduce the pass result. An attempted local run in the available execution environment stopped during Jest configuration validation because Jest could not resolve `tests/setup.js`, even though the file is present in the source archive. Therefore, this update does not claim an independently verified 69/69 pass result or coverage percentage. A clean CI run should be attached to establish reproducibility.

## Reproducible verification

From the `project/` directory, install dependencies using the committed lockfile and run:

- `npm ci`
- `npm test -- --runInBand`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:security`
- `npm run test:coverage`

Record Node/npm versions, exact command output, exit codes, and generated coverage summary. Do not infer that a security test prevents an attack merely because the test accepts a broad range of HTTP status codes; assert the expected safe behavior and absence of sensitive disclosure.

## Accuracy evaluation

No labeled benchmark, independent reviewer ground truth, precision/recall calculation, or confidence interval was supplied. Therefore, no numerical detection-accuracy claim is currently justified.
