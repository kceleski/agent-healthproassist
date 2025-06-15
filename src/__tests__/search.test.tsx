
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SearchPage from '@/pages/SearchPage';

describe('SearchPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<SearchPage />);
    expect(container).toBeDefined();
  });
});
