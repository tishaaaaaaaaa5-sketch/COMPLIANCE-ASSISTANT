# Test inventory and execution

The source archive contains 69 test/it declarations: 25 unit, 26 integration, and 18 security. These are source-level counts only; they do not establish that any test currently passes.

Run from this directory's parent (`project/`):

- `npm ci`
- `npm test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:security`
- `npm run test:coverage`

Record exact runtime versions, output, exit codes, and coverage before publishing results. Tests that accept broad status-code ranges should be tightened to assert the intended safe behavior and absence of sensitive data.