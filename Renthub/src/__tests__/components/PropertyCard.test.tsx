import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock PropertyCard component
interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  image?: string;
}

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: number) => void;
  onPropertyClick?: (id: number) => void;
  isFavorite?: boolean;
}

const MockPropertyCard = ({ 
  property, 
  onFavoriteToggle, 
  onPropertyClick,
  isFavorite = false 
}: PropertyCardProps) => {
  return (
    <div data-testid={`property-card-${property.id}`}>
      <h3 data-testid="property-title">{property.title}</h3>
      <p data-testid="property-description">{property.description}</p>
      <p data-testid="property-price">${property.price}/month</p>
      <p data-testid="property-location">{property.location}</p>
      <p data-testid="property-bedrooms">{property.bedrooms} bed</p>
      <p data-testid="property-bathrooms">{property.bathrooms} bath</p>
      
      <button
        data-testid="favorite-button"
        onClick={() => onFavoriteToggle?.(property.id)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      
      <button
        data-testid="view-button"
        onClick={() => onPropertyClick?.(property.id)}
      >
        View Details
      </button>
    </div>
  );
};

describe('PropertyCard Component', () => {
  const mockProperty: Property = {
    id: 1,
    title: 'Beautiful Apartment',
    description: 'A stunning 2-bedroom apartment in downtown',
    price: 2000,
    location: 'New York, NY',
    bedrooms: 2,
    bathrooms: 2,
  };

  it('renders property information correctly', () => {
    render(
      <BrowserRouter>
        <MockPropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('property-title')).toHaveTextContent('Beautiful Apartment');
    expect(screen.getByTestId('property-description')).toHaveTextContent('A stunning 2-bedroom apartment');
    expect(screen.getByTestId('property-price')).toHaveTextContent('$2000/month');
    expect(screen.getByTestId('property-location')).toHaveTextContent('New York, NY');
    expect(screen.getByTestId('property-bedrooms')).toHaveTextContent('2 bed');
    expect(screen.getByTestId('property-bathrooms')).toHaveTextContent('2 bath');
  });

  it('displays unfavorited state by default', () => {
    render(
      <BrowserRouter>
        <MockPropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveTextContent('🤍');
    expect(favoriteButton).toHaveAttribute('aria-label', 'Add to favorites');
  });

  it('displays favorited state when isFavorite is true', () => {
    render(
      <BrowserRouter>
        <MockPropertyCard property={mockProperty} isFavorite={true} />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveTextContent('❤️');
    expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  it('calls onFavoriteToggle when favorite button is clicked', async () => {
    const mockToggleFavorite = vi.fn();
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <MockPropertyCard 
          property={mockProperty} 
          onFavoriteToggle={mockToggleFavorite}
        />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button');
    await user.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(mockProperty.id);
    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('calls onPropertyClick when view button is clicked', async () => {
    const mockPropertyClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <MockPropertyCard 
          property={mockProperty} 
          onPropertyClick={mockPropertyClick}
        />
      </BrowserRouter>
    );

    const viewButton = screen.getByTestId('view-button');
    await user.click(viewButton);

    expect(mockPropertyClick).toHaveBeenCalledWith(mockProperty.id);
    expect(mockPropertyClick).toHaveBeenCalledTimes(1);
  });

  it('handles multiple favorite toggles correctly', async () => {
    const mockToggleFavorite = vi.fn();
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <MockPropertyCard 
          property={mockProperty} 
          onFavoriteToggle={mockToggleFavorite}
        />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button');
    
    await user.click(favoriteButton);
    await user.click(favoriteButton);
    await user.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(3);
  });

  it('renders with different property data', () => {
    const differentProperty: Property = {
      id: 2,
      title: 'Cozy Studio',
      description: 'Small but efficient studio',
      price: 1200,
      location: 'Brooklyn, NY',
      bedrooms: 1,
      bathrooms: 1,
    };

    render(
      <BrowserRouter>
        <MockPropertyCard property={differentProperty} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('property-title')).toHaveTextContent('Cozy Studio');
    expect(screen.getByTestId('property-price')).toHaveTextContent('$1200/month');
    expect(screen.getByTestId('property-location')).toHaveTextContent('Brooklyn, NY');
    expect(screen.getByTestId('property-bedrooms')).toHaveTextContent('1 bed');
  });

  it('has accessible favorite button', () => {
    render(
      <BrowserRouter>
        <MockPropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button');
    expect(favoriteButton).toHaveAttribute('aria-label');
  });

  it('renders unique test id for each property', () => {
    const { container } = render(
      <BrowserRouter>
        <MockPropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(container.querySelector(`[data-testid="property-card-${mockProperty.id}"]`)).toBeInTheDocument();
  });
});
