# Security policy

## Reporting a vulnerability

Please do not publish exploit details, credentials, personal data, payment data, or confidential audit artifacts in a public issue. Contact the repository maintainer privately through GitHub's supported security reporting mechanism, if enabled.

## Secret handling

- Never commit API keys, access tokens, passwords, private keys, or populated environment files.
- Use environment variables or a secret manager for local configuration.
- If a secret is committed, revoke/rotate it immediately. Removing it in a later commit does not invalidate the exposed credential or erase it from Git history.
- Keep sample data synthetic and redact sensitive values from logs and reports.

## Safe use

Treat analyzed repositories as untrusted input. Do not execute analyzed code as part of static review. Obtain authorization before scanning repositories or handling regulated information.
