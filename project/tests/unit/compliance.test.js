/**
 * Unit Tests for compliance.js (White Box Testing)
 * Tests internal logic and individual functions
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
  parseGithubUrl,
  listSampleRepoFiles,
  readSampleRepoFile,
} from '../../lib/compliance.js';

describe('parseGithubUrl - White Box Testing', () => {
  test('should parse standard GitHub URL', () => {
    const result = parseGithubUrl('https://github.com/user/repo');
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      ref: undefined,
    });
  });

  test('should parse GitHub URL with .git extension', () => {
    const result = parseGithubUrl('https://github.com/user/repo.git');
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      ref: undefined,
    });
  });

  test('should parse GitHub URL with branch', () => {
    const result = parseGithubUrl('https://github.com/user/repo/tree/main');
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      ref: 'main',
    });
  });

  test('should parse short format (owner/repo)', () => {
    const result = parseGithubUrl('user/repo');
    expect(result).toEqual({
      owner: 'user',
      repo: 'repo',
      ref: undefined,
    });
  });

  test('should throw error for empty URL', () => {
    expect(() => parseGithubUrl('')).toThrow('Please provide a GitHub repository URL');
  });

  test('should throw error for invalid URL', () => {
    expect(() => parseGithubUrl('not-a-url')).toThrow();
  });

  test('should throw error for non-GitHub URL', () => {
    expect(() => parseGithubUrl('https://gitlab.com/user/repo')).toThrow('Only github.com URLs are supported');
  });

  test('should throw error for URL without repo', () => {
    expect(() => parseGithubUrl('https://github.com/user')).toThrow('URL must include owner/repo');
  });
});

describe('listSampleRepoFiles - White Box Testing', () => {
  test('should return array of files', () => {
    const files = listSampleRepoFiles();
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
  });

  test('should only include scannable extensions', () => {
    const files = listSampleRepoFiles();
    const validExtensions = ['.js', '.ts', '.py', '.txt', '.cobol', '.cbl', '.rpg', '.java'];
    
    files.forEach(file => {
      const hasValidExtension = validExtensions.some(ext => 
        file.toLowerCase().endsWith(ext)
      );
      expect(hasValidExtension).toBe(true);
    });
  });

  test('should return sorted files', () => {
    const files = listSampleRepoFiles();
    const sortedFiles = [...files].sort();
    expect(files).toEqual(sortedFiles);
  });

  test('should include expected sample files', () => {
    const files = listSampleRepoFiles();
    expect(files).toContain('auth.js');
    expect(files).toContain('checkout.js');
    expect(files).toContain('users.js');
  });
});

describe('readSampleRepoFile - White Box Testing', () => {
  test('should read existing file', () => {
    const content = readSampleRepoFile('auth.js');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  test('should throw error for non-existent file', () => {
    expect(() => readSampleRepoFile('nonexistent.js')).toThrow('File not found');
  });

  test('should reject path traversal attempts', () => {
    expect(() => readSampleRepoFile('../../../etc/passwd')).toThrow('Invalid filename');
  });

  test('should reject absolute paths', () => {
    expect(() => readSampleRepoFile('/etc/passwd')).toThrow('Invalid filename');
  });

  test('should reject hidden files', () => {
    expect(() => readSampleRepoFile('.env')).toThrow('Invalid filename');
  });

  test('should read file with correct content', () => {
    const content = readSampleRepoFile('auth.js');
    expect(content).toContain('password'); // auth.js should contain password logic
  });
});

describe('Edge Cases - White Box Testing', () => {
  test('parseGithubUrl should handle URLs with trailing slashes', () => {
    const result = parseGithubUrl('https://github.com/user/repo/');
    expect(result.owner).toBe('user');
    expect(result.repo).toBe('repo');
  });

  test('parseGithubUrl should handle URLs with www', () => {
    const result = parseGithubUrl('https://www.github.com/user/repo');
    expect(result.owner).toBe('user');
    expect(result.repo).toBe('repo');
  });

  test('readSampleRepoFile should handle files with special characters in content', () => {
    const files = listSampleRepoFiles();
    if (files.length > 0) {
      const content = readSampleRepoFile(files[0]);
      expect(content).toBeDefined();
    }
  });
});

describe('Input Validation - White Box Testing', () => {
  test('parseGithubUrl should handle null input', () => {
    expect(() => parseGithubUrl(null)).toThrow();
  });

  test('parseGithubUrl should handle undefined input', () => {
    expect(() => parseGithubUrl(undefined)).toThrow();
  });

  test('readSampleRepoFile should handle empty string', () => {
    expect(() => readSampleRepoFile('')).toThrow();
  });

  test('readSampleRepoFile should handle whitespace-only filename', () => {
    expect(() => readSampleRepoFile('   ')).toThrow();
  });
});

// Made with Bob