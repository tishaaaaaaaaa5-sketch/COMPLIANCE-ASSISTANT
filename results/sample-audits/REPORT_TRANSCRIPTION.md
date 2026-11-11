# Sample audit result — extracted finding register

**Source artifact:** Compliance Audit Report, Bundled Sample Systems  
**Report date printed in artifact:** May 9, 2026  
**Analysis engine printed in artifact:** IBM watsonx.ai / granite-34b-code-instruct  
**Status in this repository:** Unverified sample output; not a formal audit conclusion.

This register summarizes the five findings stated in the supplied PDF. It is not an independent reproduction of the analysis.

| ID | Component named in PDF | Observation stated in PDF | Suggested action stated in PDF | Validation status |
|---|---|---|---|---|
| F-01 | checkout.js, logger.js | CVV allegedly appears in logs or console output | Stop logging request bodies/CVV; add sensitive-field scrubbing | Not independently verified |
| F-02 | payments.js | Cardholder data allegedly sent to a processor over HTTP | Use HTTPS with modern TLS and validate the processor certificate | Not independently verified |
| F-03 | logger.js, checkout.js | Full PAN allegedly written to request logs and console output | Mask/truncate PAN and exclude sensitive request fields from logs | Not independently verified |
| F-04 | auth.js, users.js | Hardcoded admin credentials and plaintext password storage allegedly exist | Remove hardcoded credentials and use a suitable password-hashing scheme | Not independently verified |
| F-05 | legacy-payroll.cobol.txt | SSN and salary data allegedly displayed or logged | Suppress SSN output and restrict/encrypt payroll data files | Not independently verified |

## Important qualifications

- The report names seven reviewed files, but the underlying sample source files were not independently re-run against the analyzer as part of this repository update.
- The report's opening declaration that the system is non-compliant across PCI-DSS, GDPR, and HIPAA is broader than these code observations alone establish.
- The PDF's predicted fines, processing suspension, revocation, legal liability, and specific financial estimates are not verified by this artifact.
- The payment-processing question and payroll finding have different scopes. Framework applicability must be established separately.
- The PDF is identified as an IBM watsonx artifact. Its model/provider label is retained as source provenance and must not be rewritten to Gemini.

## Original PDF availability

The original eight-page PDF was supplied for this review, but the available GitHub write connector supports text-file creation only in this workflow. The binary PDF has therefore **not** been committed. This extracted register is not a replacement for the original PDF. Upload the original file as a binary repository attachment at:

results/sample-audits/2026-05-08-bundled-sample-systems.pdf

After upload, verify that the PDF opens from GitHub and add its SHA-256 checksum here.
