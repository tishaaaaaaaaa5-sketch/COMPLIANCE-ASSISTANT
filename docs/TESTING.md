# Testing inventory and evidence

## Static inventory

The supplied source archive contains three Jest test files. Counting syntactic test/it declarations in those files gives:

| Suite | Test declarations |
|---|---:|
| Unit (project/tests/unit/compliance.test.js) | 25 |
| Integration (project/tests/integration/api.test.js) | 26 |
| Security (project/tests/security/security.test.js) | 18 |
| **Total** | **69** |

These are declaration counts from source inspection. They are not a test-run result, pass count, coverage result, or proof that every security property is enforced.

## Claims removed

Earlier project copy claimed 115+ automated tests, 31/31 passing unit tests, 99% vulnerability-detection accuracy, zero security vulnerabilities, 70%+ coverage, and production readiness. Those claims are not supported by the available evidence and should not be repeated unless a reproducible run and evaluation support them.

## Reproducible verification

From the project directory, install dependencies using the committed lockfile and run:

- npm test
- npm run test:unit
- npm run test:integration
- npm run test:security
- npm run test:coverage

Record Node/npm versions, install command, exact command output, exit codes, and generated coverage summary. Do not infer that a security test prevents an attack merely because the test accepts a broad range of HTTP status codes; assert the expected safe behavior and absence of sensitive disclosure.

## Accuracy evaluation

No labeled benchmark, independent reviewer ground truth, precision/recall calculation, or confidence interval was supplied. Therefore, no numerical detection-accuracy claim is currently justified.
