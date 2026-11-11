import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SAMPLE_REPO_DIR = path.resolve(__dirname, '..', 'sample-repo');

const SCANNABLE_EXTENSIONS = ['.js', '.ts', '.py', '.txt', '.cobol', '.cbl', '.rpg', '.java'];

const GITHUB_MAX_FILES = 25;
const GITHUB_MAX_FILE_BYTES = 50 * 1024;
const GITHUB_MAX_TOTAL_BYTES = 80 * 1024;

const SCAN_PRIORITY_KEYWORDS = [
  'auth', 'login', 'password', 'secret', 'token', 'jwt', 'session',
  'payment', 'checkout', 'card', 'billing', 'stripe',
  'user', 'account', 'profile', 'register', 'signup',
  'log', 'audit', 'config', 'env', 'settings',
  'api', 'route', 'controller', 'handler', 'middleware',
  'crypto', 'encrypt', 'hash', 'cookie', 'cors',
];

const SCAN_SKIP_PATH_FRAGMENTS = [
  'node_modules/', 'vendor/', 'dist/', 'build/', '.git/',
  'target/', '__pycache__/', '.next/', '.nuxt/', 'coverage/',
  '.cache/', 'public/build/', 'out/', 'bin/', 'obj/',
  'venv/', '.venv/', 'env/', '.idea/', '.vscode/',
  'test/', 'tests/', '__tests__/', 'spec/', 'fixtures/',
  'docs/', 'examples/', 'sample/', 'samples/',
];

const SCAN_FILE_EXTENSIONS = [
  '.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs',
  '.py', '.java', '.go', '.rb', '.php', '.cs', '.kt',
  '.swift', '.rs', '.scala', '.cobol', '.cbl', '.rpg',
];

const COMPLIANCE_SYSTEM_PROMPT =
  'You are an AI-assisted source-code triage tool, not a regulator, lawyer, auditor, or compliance certifier. Treat every issue as a candidate finding that requires human validation. Never declare an organization or system compliant or non-compliant based only on source files. For each candidate finding: (1) name the exact file and code evidence supplied; (2) describe the observed behavior without assuming runtime execution; (3) map to a framework requirement only when the mapping is supported, and label uncertain mappings as needing reviewer verification; (4) separate technical impact from legal or business consequences; (5) assign a provisional severity with a short rationale; (6) suggest a remediation and a test to verify it. Do not invent line numbers, framework clauses, fines, lawsuits, processing suspensions, breach notifications, or remediation deadlines. Do not claim a breach or exploit occurred unless evidence explicitly establishes it. If evidence is missing, say so. State that the output is preliminary and requires qualified human review.';

const MODERNIZATION_SYSTEM_PROMPT =
  'You are a legacy system assessment specialist. Your audience is non-technical stakeholders who need to understand business risks and modernization options. Analyze the legacy system and structure your assessment in four sections: 1) BUSINESS FUNCTION (what business process this system supports), 2) TECHNICAL OVERVIEW (how it works, in plain English), 3) COMPLIANCE & RISK ASSESSMENT (security vulnerabilities, regulatory risks, maintainability issues, business continuity risks), 4) MODERNIZATION STRATEGY (specific, validated approach with timeline and risk mitigation). Assign overall RISK LEVEL (Critical/High/Medium/Low). Use business language, not technical jargon.';

export function listSampleRepoFiles() {
  return fs
    .readdirSync(SAMPLE_REPO_DIR)
    .filter((f) => SCANNABLE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
    .sort();
}

export function readSampleRepoFile(filename) {
  if (filename.includes('/') || filename.includes('\\') || filename.startsWith('.')) {
    throw new Error('Invalid filename');
  }
  const fullPath = path.join(SAMPLE_REPO_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filename}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function readSampleRepo() {
  return listSampleRepoFiles().map((filename) => ({
    filename,
    contents: readSampleRepoFile(filename),
  }));
}

function buildPrompt(systemPrompt, body, question, frameworks) {
  let frameworkContext = '';
  if (frameworks && frameworks.length > 0) {
    frameworkContext = `\n\nFocus on these compliance frameworks: ${frameworks.join(', ')}. Map findings to specific requirements in these frameworks.`;
  }
  return `System: ${systemPrompt}${frameworkContext}

${body}

Question: ${question}

Answer:`;
}

function buildCompliancePrompt(question, files, frameworks) {
  const codebase = files
    .map((f) => `=== SYSTEM MODULE: ${f.filename} ===\n${f.contents}`)
    .join('\n\n');
  return buildPrompt(COMPLIANCE_SYSTEM_PROMPT, `Systems Under Review:\n${codebase}`, question, frameworks);
}

function buildModernizationPrompt(filename, contents, question) {
  const body = `Legacy System Under Assessment: ${filename}\n\n=== ${filename} ===\n${contents}`;
  return buildPrompt(MODERNIZATION_SYSTEM_PROMPT, body, question, null);
}

export async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });
  
  return response.text || '';
}

function missingCredentialsAnswer() {
  return {
    ok: false,
    answer:
      'This Compliance Assistant is not configured yet. Please add your GEMINI_API_KEY to the .env file. Get your API key from https://aistudio.google.com/app/apikey',
  };
}

async function generate(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return missingCredentialsAnswer();

  try {
    const answer = await callGemini(prompt);
    return { ok: true, answer: answer.trim() };
  } catch (err) {
    return {
      ok: false,
      answer:
        'The assistant could not complete the analysis. Please verify the service configuration and try again. No compliance conclusion should be drawn from this failed request.',
    };
  }
}

export async function askCompliance(question, frameworks) {
  const trimmed = (question || '').toString().trim();
  if (!trimmed) return { ok: false, answer: 'Please enter a question.' };

  const files = readSampleRepo();
  const result = await generate(buildCompliancePrompt(trimmed, files, frameworks));
  return result.ok
    ? { ...result, filesScanned: files.map((f) => f.filename) }
    : result;
}

export function parseGithubUrl(input) {
  const raw = (input || '').toString().trim();
  if (!raw) throw new Error('Please provide a GitHub repository URL.');

  let owner;
  let repo;
  let ref;

  const shortMatch = raw.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  if (shortMatch && !raw.includes('://') && !raw.includes('github.com')) {
    owner = shortMatch[1];
    repo = shortMatch[2];
  } else {
    let url;
    try {
      url = new URL(raw.startsWith('http') ? raw : 'https://' + raw);
    } catch {
      throw new Error('That does not look like a valid GitHub URL.');
    }
    if (!/github\.com$/i.test(url.hostname)) {
      throw new Error('Only github.com URLs are supported.');
    }
    const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) throw new Error('URL must include owner/repo.');
    owner = parts[0];
    repo = parts[1].replace(/\.git$/, '');
    if (parts[2] === 'tree' && parts[3]) ref = parts[3];
  }

  // Only accept GitHub path components. This prevents shell metacharacters,
  // whitespace, query fragments, and other URL payloads from being treated as
  // repository identifiers and later interpolated into API paths.
  const safeSegment = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
  if (!owner || !repo || !safeSegment.test(owner) || !safeSegment.test(repo)) {
    throw new Error('GitHub owner and repository names contain invalid characters.');
  }
  if (owner === '.' || owner === '..' || repo === '.' || repo === '..') {
    throw new Error('Invalid GitHub repository path.');
  }
  return { owner, repo, ref };
}

function shouldScanPath(p) {
  const lower = p.toLowerCase();
  if (SCAN_SKIP_PATH_FRAGMENTS.some((s) => lower.includes(s))) return false;
  if (lower.split('/').some((seg) => seg.startsWith('.'))) return false;
  return SCAN_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function priorityScore(p) {
  const lower = p.toLowerCase();
  let score = 0;
  for (const kw of SCAN_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) score += 10;
  }
  const depth = p.split('/').length;
  score -= depth;
  if (lower.includes('/src/') || lower.startsWith('src/')) score += 3;
  return score;
}

async function githubGet(url, accept = 'application/vnd.github+json') {
  const headers = { Accept: accept, 'User-Agent': 'compliance-assistant' };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return axios.get(url, { headers, timeout: 30000 });
}

async function fetchRepoFiles({ owner, repo, ref }) {
  let branch = ref;
  if (!branch) {
    const repoInfo = await githubGet(
      `https://api.github.com/repos/${owner}/${repo}`,
    );
    branch = repoInfo.data.default_branch;
  }

  const tree = await githubGet(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  );

  if (!tree.data.tree) {
    throw new Error('Could not read the repository tree.');
  }

  const candidates = tree.data.tree
    .filter((node) => node.type === 'blob' && shouldScanPath(node.path))
    .filter((node) => !node.size || node.size <= GITHUB_MAX_FILE_BYTES)
    .map((node) => ({
      path: node.path,
      size: node.size || 0,
      score: priorityScore(node.path),
    }))
    .sort((a, b) => b.score - a.score);

  const selected = [];
  let totalBytes = 0;
  for (const c of candidates) {
    if (selected.length >= GITHUB_MAX_FILES) break;
    if (totalBytes + c.size > GITHUB_MAX_TOTAL_BYTES) continue;
    selected.push(c);
    totalBytes += c.size;
  }

  const files = [];
  for (const c of selected) {
    try {
      const raw = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${c.path
          .split('/')
          .map(encodeURIComponent)
          .join('/')}`,
        {
          responseType: 'text',
          transformResponse: [(d) => d],
          timeout: 30000,
          headers: { 'User-Agent': 'compliance-assistant' },
        },
      );
      const text = (raw.data || '').toString();
      if (text.length > GITHUB_MAX_FILE_BYTES) continue;
      files.push({ filename: c.path, contents: text });
    } catch {
      // skip files we can't fetch
    }
  }

  return { branch, files };
}

export async function scanGithubRepo(url, question, frameworks) {
  let parsed;
  try {
    parsed = parseGithubUrl(url);
  } catch (err) {
    return { ok: false, answer: err.message };
  }

  const frameworkList = frameworks && frameworks.length > 0
    ? frameworks.join(', ')
    : 'no framework selected';

  const defaultQuestion = frameworks && frameworks.length > 0
    ? `Perform a preliminary source-code review with reference to ${frameworkList}. Identify candidate control gaps, cite the exact supplied file evidence, explain uncertain mappings, and recommend human verification and remediation tests. Do not make an organization-wide compliance determination.`
    : 'Perform a preliminary source-code security and privacy review. Identify candidate risks with exact file evidence, explain uncertainty, and recommend human verification and remediation tests. Do not make an organization-wide compliance determination.';
  const trimmedQ = (question || '').toString().trim() || defaultQuestion;

  let fetched;
  try {
    fetched = await fetchRepoFiles(parsed);
  } catch (err) {
    const status = err.response && err.response.status;
    if (status === 404) {
      return {
        ok: false,
        answer: `Could not find ${parsed.owner}/${parsed.repo}. Make sure the repository is public and the URL is correct.`,
      };
    }
    if (status === 403) {
      return {
        ok: false,
        answer:
          'GitHub rate-limited the request. Wait an hour, or set a GITHUB_TOKEN secret to lift the unauthenticated 60/hour limit.',
      };
    }
    return {
      ok: false,
      answer:
        'Could not load the repository: ' + (err.message || 'unknown error'),
    };
  }

  if (!fetched.files.length) {
    return {
      ok: false,
      answer:
        'No scannable source files were found in this repository (after skipping vendored, generated, and test paths).',
    };
  }

  const result = await generate(buildCompliancePrompt(trimmedQ, fetched.files, frameworks));
  if (!result.ok) return result;

  return {
    ok: true,
    answer: result.answer,
    repo: `${parsed.owner}/${parsed.repo}`,
    branch: fetched.branch,
    filesScanned: fetched.files.map((f) => f.filename),
  };
}

export async function modernizeFile(filename, question) {
  let contents;
  try {
    contents = readSampleRepoFile(filename);
  } catch (err) {
    return { ok: false, answer: err.message };
  }

  const ask =
    (question || '').toString().trim() ||
    'Provide a preliminary explanation of the business function, technical observations, potential security/privacy/operational risks, and modernization options. Separate visible code facts from assumptions and list checks required before implementation.';

  const result = await generate(buildModernizationPrompt(filename, contents, ask));
  return result.ok ? { ...result, filename } : result;
}