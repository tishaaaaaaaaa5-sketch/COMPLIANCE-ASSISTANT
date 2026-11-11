# Methodology and validation

## Current evidence status

The repository was empty when this documentation was added. No application source, test suite, dependency manifest, evaluation dataset, model configuration, or run logs were available for independent verification. Consequently, this document describes the minimum reproducible process expected for future claims; it does not claim that the process has already been completed.

## Recommended analysis record

For each run, preserve:
- Repository commit SHA and analyzed paths.
- Tool version, model/provider identifier, prompt/template version, and configuration (excluding secrets).
- Framework versions and mapping source.
- Scope, exclusions, and data classification assumptions.
- Timestamp, run identifier, and output artifact checksum.
- Findings with code evidence, confidence, and reviewer status.

## Validation protocol

1. Select a representative, permissioned code corpus.
2. Have qualified reviewers independently label findings against a written rubric.
3. Include vulnerable and non-vulnerable examples, varied languages, and realistic false-positive cases.
4. Split by project/repository—not randomly by individual finding—to reduce leakage.
5. Report precision, recall, F1, false-positive rate, and confidence intervals with denominators.
6. Report results by framework/control family and language, not only as one aggregate score.
7. Compare with a documented baseline and record model/provider changes.
8. Have reviewers assess severity and framework applicability separately from model detection.
9. Publish limitations, disagreements, excluded cases, and reproducible commands.

## Security and privacy safeguards

- Never send secrets, payment credentials, personal data, or regulated data to a model unless authorized and protected by an approved data-processing arrangement.
- Redact tokens, passwords, PAN, CVV, SSNs, and sensitive headers from prompts and logs.
- Treat repository content as untrusted input.
- Avoid executing analyzed code.
- Use least-privilege credentials and keep secrets out of source control.
- Retain audit artifacts only under an explicit retention policy.

## Reproduction

No reproduction command is published yet because the application source and runtime configuration are not present in this repository. Add setup and test instructions only after verifying them against the committed implementation.
