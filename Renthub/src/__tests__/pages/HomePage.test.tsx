import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';

// Mock props for HomePage
const mockProps = {
  properties: [],
  favorites: [],
  filters: {
    location: '',
    priceRange: [0, 5000],
    propertyType: [],
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    dateRange: { start: null, end: null },
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
    const { container } = render(
      <BrowserRouter>
        <HomePage {...mockProps} />
      </BrowserRouter>
    );
    
    // Basic smoke test - page should render
    expect(container).toBeTruthy();
  });

  it('renders with empty properties list', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage {...mockProps} properties={[]} />
      </BrowserRouter>
    );
    
    expect(container).toBeTruthy();
  });
});
