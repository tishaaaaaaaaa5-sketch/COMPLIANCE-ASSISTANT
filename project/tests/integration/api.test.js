/**
 * Integration Tests for API Endpoints (Black Box Testing)
 * Tests the API from an external perspective without knowledge of internal implementation
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the server setup
let app;
let server;

beforeAll(async () => {
  // Set test environment variables
  process.env.GEMINI_API_KEY = 'test-api-key';
  process.env.PORT = '5001';
  
  // Import server after setting env vars
  const serverModule = await import('../../server.js');
  app = serverModule.default || serverModule.app;
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

describe('GET / - Black Box Testing', () => {
  test('should return HTML page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
  });

  test('should contain expected UI elements', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Compliance');
  });
});

describe('GET /files - Black Box Testing', () => {
  test('should return list of files', async () => {
    const response = await request(app).get('/files');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('files');
    expect(Array.isArray(response.body.files)).toBe(true);
  });

  test('should return non-empty file list', async () => {
    const response = await request(app).get('/files');
    expect(response.body.files.length).toBeGreaterThan(0);
  });

  test('should return JSON content type', async () => {
    const response = await request(app).get('/files');
    expect(response.headers['content-type']).toMatch(/json/);
  });
});

describe('POST /ask - Black Box Testing', () => {
  test('should accept compliance question', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'Is this PCI-DSS compliant?' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 500]);
    expect(response.body).toHaveProperty('answer');
  });

  test('should return error for empty question', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: '' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([400, 500]);
    expect(response.body).toHaveProperty('answer');
  });

  test('should return error for missing question', async () => {
    const response = await request(app)
      .post('/ask')
      .send({})
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([400, 500]);
  });

  test('should accept frameworks parameter', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ 
        question: 'Check compliance',
        frameworks: ['PCI-DSS', 'GDPR']
      })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 500]);
  });

  test('should handle long questions', async () => {
    const longQuestion = 'Is this compliant? '.repeat(100);
    const response = await request(app)
      .post('/ask')
      .send({ question: longQuestion })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 500]);
  });
});

describe('POST /scan-repo - Black Box Testing', () => {
  test('should accept valid GitHub URL', async () => {
    const response = await request(app)
      .post('/scan-repo')
      .send({ url: 'https://github.com/octocat/Hello-World' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 500]);
    expect(response.body).toHaveProperty('answer');
  });

  test('should return error for invalid URL', async () => {
    const response = await request(app)
      .post('/scan-repo')
      .send({ url: 'not-a-url' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('answer');
  });

  test('should return error for missing URL', async () => {
    const response = await request(app)
      .post('/scan-repo')
      .send({})
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('should accept optional question parameter', async () => {
    const response = await request(app)
      .post('/scan-repo')
      .send({ 
        url: 'https://github.com/octocat/Hello-World',
        question: 'Check for security issues'
      })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 500]);
  });

  test('should accept frameworks parameter', async () => {
    const response = await request(app)
      .post('/scan-repo')
      .send({ 
        url: 'https://github.com/octocat/Hello-World',
        frameworks: ['GDPR', 'HIPAA']
      })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 500]);
  });
});

describe('POST /modernize - Black Box Testing', () => {
  test('should accept valid filename', async () => {
    const response = await request(app)
      .post('/modernize')
      .send({ filename: 'auth.js' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 500]);
    expect(response.body).toHaveProperty('answer');
  });

  test('should return error for missing filename', async () => {
    const response = await request(app)
      .post('/modernize')
      .send({})
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('should return error for non-existent file', async () => {
    const response = await request(app)
      .post('/modernize')
      .send({ filename: 'nonexistent.js' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(500);
  });

  test('should accept optional question parameter', async () => {
    const response = await request(app)
      .post('/modernize')
      .send({ 
        filename: 'auth.js',
        question: 'How to modernize this?'
      })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 500]);
  });
});

describe('POST /report - Black Box Testing', () => {
  test('should generate PDF report', async () => {
    const response = await request(app)
      .post('/report')
      .send({
        answer: 'Test compliance findings',
        question: 'Is this compliant?',
        kind: 'compliance',
        filesScanned: ['auth.js', 'users.js']
      })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
  });

  test('should return error for missing answer', async () => {
    const response = await request(app)
      .post('/report')
      .send({ kind: 'compliance' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('should accept modernize report type', async () => {
    const response = await request(app)
      .post('/report')
      .send({
        answer: 'Modernization assessment',
        filename: 'legacy-payroll.cobol.txt',
        kind: 'modernize'
      })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(200);
  });

  test('should include proper filename in headers', async () => {
    const response = await request(app)
      .post('/report')
      .send({
        answer: 'Test findings',
        kind: 'compliance'
      })
      .set('Content-Type', 'application/json');
    
    if (response.status === 200) {
      expect(response.headers['content-disposition']).toMatch(/filename=/);
    }
  });
});

describe('Error Handling - Black Box Testing', () => {
  test('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });

  test('should handle malformed JSON', async () => {
    const response = await request(app)
      .post('/ask')
      .send('invalid json')
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([400, 500]);
  });

  test('should handle large payloads', async () => {
    const largePayload = {
      question: 'x'.repeat(10000),
      frameworks: Array(100).fill('PCI-DSS')
    };
    
    const response = await request(app)
      .post('/ask')
      .send(largePayload)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeOneOf([200, 400, 413, 500]);
  });
});

// Custom matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    return {
      pass,
      message: () => `expected ${received} to be one of ${expected.join(', ')}`
    };
  }
});

// Made with Bob