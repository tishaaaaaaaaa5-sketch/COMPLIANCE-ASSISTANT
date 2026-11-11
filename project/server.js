import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  askCompliance,
  modernizeFile,
  scanGithubRepo,
  listSampleRepoFiles,
} from './lib/compliance.js';
import { buildAuditReport } from './lib/report.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY not set!');
  console.warn('📝 Please add your Google Gemini API key to the .env file.');
  console.warn('💡 Get your API key from: https://aistudio.google.com/app/apikey');
  console.warn('💡 See .env.example for the required format.');
}

const app = express();
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(PUBLIC_DIR));

app.get('/', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/files', (_req, res) => {
  res.json({ files: listSampleRepoFiles() });
});

app.post('/ask', async (req, res) => {
  const { question, frameworks } = req.body || {};
  const result = await askCompliance(question, frameworks);
  if (!result.ok) {
    return res.status(result.answer.startsWith('Please') ? 400 : 500).json({
      answer: result.answer,
    });
  }
  return res.json({ answer: result.answer, filesScanned: result.filesScanned });
});

app.post('/modernize', async (req, res) => {
  const { filename, question } = req.body || {};
  if (!filename) {
    return res.status(400).json({ answer: 'Please specify a filename to modernize.' });
  }
  const result = await modernizeFile(filename, question);
  if (!result.ok) {
    return res.status(500).json({ answer: result.answer });
  }
  return res.json({ answer: result.answer, filename: result.filename });
});

app.post('/scan-repo', async (req, res) => {
  const { url, question, frameworks } = req.body || {};
  if (!url) {
    return res.status(400).json({ answer: 'Please provide a GitHub repository URL.' });
  }
  const result = await scanGithubRepo(url, question, frameworks);
  if (!result.ok) {
    return res.status(400).json({ answer: result.answer });
  }
  return res.json({
    answer: result.answer,
    repo: result.repo,
    branch: result.branch,
    filesScanned: result.filesScanned,
  });
});

function slugify(s) {
  return (s || 'compliance')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'compliance';
}

app.post('/report', async (req, res) => {
  const {
    answer,
    question,
    repo,
    branch,
    filesScanned,
    filename,
    kind,
    frameworks,
  } = req.body || {};

  if (!answer || typeof answer !== 'string') {
    return res.status(400).json({ error: 'Missing answer text.' });
  }

  const subject = repo
    ? `Repository: ${repo}`
    : filename
      ? `Legacy System: ${filename}`
      : 'Bundled Sample Systems';

  try {
    const pdf = await buildAuditReport({
      title:
        kind === 'modernize'
          ? 'Legacy System Assessment Report'
          : 'Compliance Audit Report',
      subject,
      question,
      answer,
      repo,
      branch,
      filesScanned,
      frameworks: Array.isArray(frameworks) ? frameworks : [],
      kind: kind === 'modernize' ? 'modernize' : 'compliance',
    });

    const stamp = new Date().toISOString().slice(0, 10);
    const slug = repo
      ? slugify(repo.replace('/', '-'))
      : filename
        ? slugify(filename)
        : 'sample-systems';
    const fname = `${kind === 'modernize' ? 'assessment' : 'audit'}-${slug}-${stamp}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
    res.send(pdf);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'PDF generation failed: ' + err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Compliance Assistant listening on port ${PORT}`);
});