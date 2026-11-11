#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  askCompliance,
  modernizeFile,
  scanGithubRepo,
  listSampleRepoFiles,
  readSampleRepoFile,
} from './lib/compliance.js';

const server = new McpServer({
  name: 'compliance-assistant',
  version: '1.0.0',
});

server.registerTool(
  'ask_compliance',
  {
    title: 'Ask the Compliance Assistant',
    description:
      'Ask a plain-English compliance question (PCI-DSS, GDPR, HIPAA, secrets, data handling). The assistant scans the bundled sample-repo and answers in regulatory language for non-technical reviewers. Requires GEMINI_API_KEY environment variable.',
    inputSchema: {
      question: z
        .string()
        .min(1)
        .describe('A plain-English compliance question about the codebase.'),
    },
  },
  async ({ question }) => {
    const result = await askCompliance(question);
    const header = result.ok
      ? `Files scanned: ${result.filesScanned.join(', ')}\n\n`
      : '';
    return {
      content: [{ type: 'text', text: header + result.answer }],
      isError: !result.ok,
    };
  },
);

server.registerTool(
  'list_codebase_files',
  {
    title: 'List codebase files in scope',
    description:
      'List the source files that the Compliance Assistant scans (the bundled sample-repo).',
    inputSchema: {},
  },
  async () => {
    const files = listSampleRepoFiles();
    return {
      content: [
        {
          type: 'text',
          text: files.length
            ? files.map((f) => `- ${f}`).join('\n')
            : 'No files found in sample-repo.',
        },
      ],
    };
  },
);

server.registerTool(
  'get_codebase_file',
  {
    title: 'Get the contents of a codebase file',
    description:
      'Read the full contents of one file from the bundled sample-repo (use list_codebase_files to see what is available).',
    inputSchema: {
      filename: z
        .string()
        .min(1)
        .describe(
          'The bare filename inside sample-repo (e.g. "checkout.js"). No paths.',
        ),
    },
  },
  async ({ filename }) => {
    try {
      const contents = readSampleRepoFile(filename);
      return {
        content: [
          { type: 'text', text: `=== ${filename} ===\n${contents}` },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  },
);

server.registerTool(
  'modernize_file',
  {
    title: 'Modernize a legacy or undocumented file',
    description:
      'Reverse-engineer a legacy or undocumented file (COBOL, RPG, mainframe JCL, or cryptic JS/Java/Python) and return a plain-English explanation, hidden risks, and potential modernization options and validation steps. Requires GEMINI_API_KEY environment variable.',
    inputSchema: {
      filename: z
        .string()
        .min(1)
        .describe(
          'The bare filename inside sample-repo (e.g. "legacy-payroll.cobol.txt").',
        ),
      question: z
        .string()
        .optional()
        .describe(
          'Optional focused question (e.g. "What does CALC-PARA do?"). Defaults to a full modernization review.',
        ),
    },
  },
  async ({ filename, question }) => {
    const result = await modernizeFile(filename, question);
    return {
      content: [{ type: 'text', text: result.answer }],
      isError: !result.ok,
    };
  },
);

server.registerTool(
  'scan_github_repo',
  {
    title: 'Scan a public GitHub repository for compliance risks',
    description:
      'Fetch a public GitHub repository (by URL or "owner/repo") and run a preliminary AI-assisted source-code review against the most relevant source files. Findings require human verification. Skips vendored/generated/test paths, prioritizes auth/payment/user/config files, and caps the prompt at ~80KB. Requires GEMINI_API_KEY. Optionally set GITHUB_TOKEN to lift the unauthenticated GitHub rate limit.',
    inputSchema: {
      url: z
        .string()
        .min(1)
        .describe(
          'Public GitHub repo URL (e.g. https://github.com/expressjs/express) or "owner/repo".',
        ),
      question: z
        .string()
        .optional()
        .describe(
          'Optional focused question. Defaults to a full PCI-DSS / GDPR / HIPAA / secrets review.',
        ),
    },
  },
  async ({ url, question }) => {
    const result = await scanGithubRepo(url, question);
    const header =
      result.ok && result.filesScanned
        ? `Repo: ${result.repo}@${result.branch}\nFiles scanned (${result.filesScanned.length}): ${result.filesScanned.join(', ')}\n\n`
        : '';
    return {
      content: [{ type: 'text', text: header + result.answer }],
      isError: !result.ok,
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('compliance-assistant MCP server ready (stdio)');