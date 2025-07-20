import React from 'react';
import { render, screen } from '@testing-library/react';
import FormLoadingOverlay from '../FormLoadingOverlay';

describe('FormLoadingOverlay', () => {
  const mockChildren = <div>Form content</div>;

  it('should render children when not loading', () => {
    render(
      <FormLoadingOverlay isLoading={false}>
        {mockChildren}
      </FormLoadingOverlay>
    );

    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.queryByText('Processando...')).not.toBeInTheDocument();
  });

  it('should render loading overlay when loading', () => {
    render(
      <FormLoadingOverlay isLoading={true}>
        {mockChildren}
      </FormLoadingOverlay>
    );

    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.getByText('Processando...')).toBeInTheDocument();
  });

  it('should render custom loading message', () => {
    render(
      <FormLoadingOverlay isLoading={true} message="Custom loading message">
        {mockChildren}
      </FormLoadingOverlay>
    );

    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    expect(screen.queryByText('Processando...')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormLoadingOverlay isLoading={false} className="custom-class">
        {mockChildren}
      </FormLoadingOverlay>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have proper overlay styling when loading', () => {
    render(
      <FormLoadingOverlay isLoading={true}>
        {mockChildren}
      </FormLoadingOverlay>
    );

    const overlay = screen.getByText('Processando...').closest('div');
    expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-white', 'bg-opacity-75');
  });

  it('should render loading spinner when loading', () => {
    render(
      <FormLoadingOverlay isLoading={true}>
        {mockChildren}
      </FormLoadingOverlay>
    );

    // The LoadingSpinner component should be rendered
    const loadingContainer = screen.getByText('Processando...').parentElement;
    expect(loadingContainer).toHaveClass('flex', 'flex-col', 'items-center', 'space-y-3');
  });
});