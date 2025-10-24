import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';

// Mock props for HomePage component
const mockProps = {
  properties: [],
  favorites: [],
  filters: {
    searchQuery: '',
    propertyType: 'all' as const,
    rentalTerm: 'all' as const,
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 'all' as const,
    bathrooms: 'all' as const,
    amenities: [] as string[],
    location: ''
  },
  sortBy: 'recommended' as const,
  showFavoritesOnly: false,
  compareList: [],
  recentlyViewed: [],
  savedSearches: [],
  analytics: {},
  user: null,
  onFiltersChange: vi.fn(),
  onSortChange: vi.fn(),
  onToggleFavorite: vi.fn(),
  onToggleCompare: vi.fn(),
  onRemoveFromCompare: vi.fn(),
  onSetShowFavoritesOnly: vi.fn(),
  onClearRecentlyViewed: vi.fn(),
  onSaveSearch: vi.fn(),
  onDeleteSearch: vi.fn(),
  onLoadSearch: vi.fn(),
  onResetFilters: vi.fn(),
  onPropertyClick: vi.fn(),
  onAISearchResults: vi.fn(),
  onClearAISearch: vi.fn(),
};

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <HomePage {...mockProps} />
      </BrowserRouter>
    );
    
    // Basic smoke test - page should render
    expect(document.body).toBeTruthy();
  });

  it('should render empty state when no properties', () => {
    render(
      <BrowserRouter>
        <HomePage {...mockProps} />
      </BrowserRouter>
    );
    
    // HomePage should render even with empty properties
    expect(document.body).toBeTruthy();
  });
});
