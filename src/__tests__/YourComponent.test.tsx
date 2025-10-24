import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * YourComponent Test Suite
 * 
 * Example test for a simple React component using Vitest and React Testing Library.
 * This demonstrates the basic test structure for component testing.
 */

// Simple example component for testing
function YourComponent({ title, description }: { title: string; description?: string }) {
  return (
    <div data-testid="your-component">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

describe('YourComponent', () => {
  it('renders with title prop', () => {
    // Arrange & Act
    render(<YourComponent title="Hello World" />);
    
    // Assert
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    // Arrange & Act
    render(
      <YourComponent 
        title="Test Title" 
        description="Test Description" 
      />
    );
    
    // Assert
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    // Arrange & Act
    render(<YourComponent title="Only Title" />);
    
    // Assert
    const component = screen.getByTestId('your-component');
    expect(component).toBeInTheDocument();
    expect(component.querySelector('p')).not.toBeInTheDocument();
  });

  it('has correct structure', () => {
    // Arrange & Act
    const { container } = render(
      <YourComponent title="Structure Test" description="Description" />
    );
    
    // Assert
    const h1 = container.querySelector('h1');
    const p = container.querySelector('p');
    
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Structure Test');
    expect(p).toBeInTheDocument();
    expect(p).toHaveTextContent('Description');
  });

  it('matches snapshot', () => {
    // Arrange & Act
    const { container } = render(
      <YourComponent title="Snapshot Test" description="For snapshot" />
    );
    
    // Assert - snapshot testing for regression detection
    expect(container.firstChild).toMatchSnapshot();
  });
});
