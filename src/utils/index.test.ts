import { describe, it, expect } from 'vitest';
import { getInitialsFromName } from './index';

describe('getInitialsFromName', () => {
  it('returns initials for typical two-word names', () => {
    expect(getInitialsFromName('John Doe')).toBe('JD');
  });

  it('handles single-word names', () => {
    expect(getInitialsFromName('Madonna')).toBe('M');
  });

  it('returns empty string for empty input', () => {
    expect(getInitialsFromName('')).toBe('');
  });
});
