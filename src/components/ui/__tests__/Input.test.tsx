import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('should render with default size', () => {
    render(<Input label="Test" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('px-3', 'py-2', 'text-base');
  });

  it('should render with small size', () => {
    render(<Input label="Test" size="sm" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('px-2', 'py-1', 'text-sm');
  });

  it('should render with large size', () => {
    render(<Input label="Test" size="lg" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('px-4', 'py-3', 'text-lg');
  });

  it('should show required indicator', () => {
    render(<Input label="Required Field" required />);
    
    const requiredIndicator = screen.getByLabelText('required');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('should display error message', () => {
    render(<Input label="Test" error="This field is required" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('This field is required');
    
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('border-danger-500', 'focus:ring-danger-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should display helper text when no error', () => {
    render(<Input label="Test" helperText="This is helper text" />);
    
    const helperText = screen.getByText('This is helper text');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('should not display helper text when error is present', () => {
    render(
      <Input 
        label="Test" 
        error="Error message" 
        helperText="Helper text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    render(<Input label="Disabled" disabled />);
    
    const input = screen.getByLabelText('Disabled');
    const label = screen.getByText('Disabled');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
    expect(label).toHaveClass('text-gray-500');
  });

  it('should handle different input types', () => {
    const { rerender } = render(<Input label="Email" type="email" />);
    let input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input label="Number" type="number" />);
    input = screen.getByLabelText('Number');
    expect(input).toHaveAttribute('type', 'number');

    rerender(<Input label="Password" type="password" />);
    input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should handle value and onChange', () => {
    const handleChange = vi.fn();
    render(<Input label="Test" value="test value" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test');
    expect(input).toHaveValue('test value');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Input label="Test" className="custom-class" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Input label="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<Input label="Test" error="Error message" />);
    
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    
    const errorId = input.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId!);
    expect(errorElement).toHaveTextContent('Error message');
  });

  it('should have unique IDs for multiple inputs', () => {
    render(
      <div>
        <Input label="First" />
        <Input label="Second" />
      </div>
    );
    
    const firstInput = screen.getByLabelText('First');
    const secondInput = screen.getByLabelText('Second');
    
    expect(firstInput.id).not.toBe(secondInput.id);
  });

  it('should use provided ID', () => {
    render(<Input label="Test" id="custom-id" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('should handle placeholder', () => {
    render(<Input label="Test" placeholder="Enter text here" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input label="Test" onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByLabelText('Test');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });
});