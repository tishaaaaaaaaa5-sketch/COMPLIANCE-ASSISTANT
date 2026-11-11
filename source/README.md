## Source archive

The application source is provided in `Compliance-Assistant-source.zip`. It includes the Node.js/Express server, Gemini integration, GitHub scanning logic, PDF report generator, MCP server, sample repository, Jest test files, and setup instructions. It excludes `.env`, populated secrets, and `node_modules`; install dependencies with `npm ci` inside `project/`.

The test suite contains 69 test declarations (25 unit, 26 integration, 18 security). The project maintainer reports that all 69 tests pass. This repository update did not independently reproduce that result; see `../docs/TESTING.md` for the verification caveat and recommended CI evidence.
