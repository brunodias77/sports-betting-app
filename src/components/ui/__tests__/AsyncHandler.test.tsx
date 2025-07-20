import React from 'react';
import { render, screen } from '@testing-library/react';
import AsyncHandler from '../AsyncHandler';

describe('AsyncHandler', () => {
  const mockChildren = <div>Content loaded</div>;

  it('should render children when not loading and no error', () => {
    render(
      <AsyncHandler loading={false} error={null}>
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(
      <AsyncHandler loading={true} error={null}>
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
  });

  it('should render custom loading component', () => {
    const customLoading = <div>Custom loading...</div>;

    render(
      <AsyncHandler loading={true} error={null} loadingComponent={customLoading}>
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });

  it('should render error state', () => {
    render(
      <AsyncHandler loading={false} error="Test error">
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
  });

  it('should render custom error component', () => {
    const customError = <div>Custom error message</div>;

    render(
      <AsyncHandler loading={false} error="Test error" errorComponent={customError}>
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });

  it('should render empty state when isEmpty is true', () => {
    const emptyState = <div>No data available</div>;

    render(
      <AsyncHandler loading={false} error={null} isEmpty={true} emptyState={emptyState}>
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
  });

  it('should prioritize loading over error', () => {
    render(
      <AsyncHandler loading={true} error="Test error">
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });

  it('should prioritize error over empty state', () => {
    const emptyState = <div>No data available</div>;

    render(
      <AsyncHandler loading={false} error="Test error" isEmpty={true} emptyState={emptyState}>
        {mockChildren}
      </AsyncHandler>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('should apply custom className to loading state', () => {
    const { container } = render(
      <AsyncHandler loading={true} error={null} className="custom-class">
        {mockChildren}
      </AsyncHandler>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});