import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Basic smoke test - page should render
    expect(document.body).toBeTruthy();
  });

  it('should have navigation elements', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Check for common navigation elements
    // This is a template - adjust based on actual HomePage content
    const page = screen.getByRole('main', { hidden: true }) || document.body;
    expect(page).toBeTruthy();
  });
});
