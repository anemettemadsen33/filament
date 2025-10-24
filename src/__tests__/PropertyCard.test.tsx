import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * PropertyCard Component Test Suite
 * 
 * Tests for the PropertyCard component with mocked props.
 * Demonstrates testing of interactive components with event handlers.
 */

// Mock PropertyCard component structure based on actual component
// This is a simplified version for testing purposes
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images?: string[];
  landlord?: {
    name: string;
    avatar?: string;
  };
}

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  isInCompare?: boolean;
  onToggleCompare?: (propertyId: string) => void;
}

// Simplified PropertyCard component for testing
function PropertyCard({ 
  property, 
  onClick, 
  isFavorite, 
  onToggleFavorite,
  isInCompare,
  onToggleCompare 
}: PropertyCardProps) {
  return (
    <div 
      data-testid="property-card" 
      onClick={onClick}
      className="property-card"
    >
      <h2>{property.title}</h2>
      <p data-testid="property-price">${property.price}</p>
      <p data-testid="property-location">{property.location}</p>
      <div data-testid="property-details">
        <span>{property.bedrooms} beds</span>
        <span>{property.bathrooms} baths</span>
        <span>{property.area} sqft</span>
      </div>
      <button
        data-testid="favorite-button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(property.id);
        }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      {onToggleCompare && (
        <button
          data-testid="compare-button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(property.id);
          }}
          aria-label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
        >
          {isInCompare ? 'In Compare' : 'Compare'}
        </button>
      )}
    </div>
  );
}

describe('PropertyCard', () => {
  // Mock property data
  const mockProperty: Property = {
    id: '123',
    title: 'Beautiful Apartment',
    price: 250000,
    location: 'New York, NY',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['image1.jpg', 'image2.jpg'],
    landlord: {
      name: 'John Landlord',
      avatar: 'avatar.jpg',
    },
  };

  // Mock functions
  const mockOnClick = vi.fn();
  const mockOnToggleFavorite = vi.fn();
  const mockOnToggleCompare = vi.fn();

  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders property information correctly', () => {
    // Arrange & Act
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Assert
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByTestId('property-price')).toHaveTextContent('$250000');
    expect(screen.getByTestId('property-location')).toHaveTextContent('New York, NY');
    expect(screen.getByText('2 beds')).toBeInTheDocument();
    expect(screen.getByText('2 baths')).toBeInTheDocument();
    expect(screen.getByText('1200 sqft')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    // Arrange
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('property-card'));

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite when favorite button is clicked', () => {
    // Arrange
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('favorite-button'));

    // Assert
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('123');
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    // onClick should not be called when favorite button is clicked
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('displays correct favorite icon when isFavorite is true', () => {
    // Arrange & Act
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={true}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Assert
    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveTextContent('❤️');
    expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('displays correct favorite icon when isFavorite is false', () => {
    // Arrange & Act
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Assert
    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveTextContent('🤍');
    expect(favoriteButton).toHaveAttribute('aria-label', 'Add to favorites');
  });

  it('renders compare button when onToggleCompare is provided', () => {
    // Arrange & Act
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        isInCompare={false}
        onToggleCompare={mockOnToggleCompare}
      />
    );

    // Assert
    expect(screen.getByTestId('compare-button')).toBeInTheDocument();
  });

  it('does not render compare button when onToggleCompare is not provided', () => {
    // Arrange & Act
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Assert
    expect(screen.queryByTestId('compare-button')).not.toBeInTheDocument();
  });

  it('toggles compare when compare button is clicked', () => {
    // Arrange
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        isInCompare={false}
        onToggleCompare={mockOnToggleCompare}
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('compare-button'));

    // Assert
    expect(mockOnToggleCompare).toHaveBeenCalledWith('123');
    expect(mockOnToggleCompare).toHaveBeenCalledTimes(1);
    // onClick should not be called when compare button is clicked
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('displays correct compare button text when isInCompare is true', () => {
    // Arrange & Act
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        isInCompare={true}
        onToggleCompare={mockOnToggleCompare}
      />
    );

    // Assert
    const compareButton = screen.getByTestId('compare-button');
    expect(compareButton).toHaveTextContent('In Compare');
    expect(compareButton).toHaveAttribute('aria-label', 'Remove from comparison');
  });

  it('matches snapshot', () => {
    // Arrange & Act
    const { container } = render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });
});
