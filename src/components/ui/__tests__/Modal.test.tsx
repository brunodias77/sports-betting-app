import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Modal from '../Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = 'unset';
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    
    const title = screen.getByText('Test Modal');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('should close when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should close when backdrop is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div data-testid="modal-content">Modal content</div>
      </Modal>
    );
    
    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should close when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when other keys are pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render with small size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="sm">
        Modal content
      </Modal>
    );
    
    const modalContent = screen.getByText('Modal content').closest('div');
    expect(modalContent?.parentElement).toHaveClass('max-w-sm');
  });

  it('should render with medium size by default', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    const modalContent = screen.getByText('Modal content').closest('div');
    expect(modalContent?.parentElement).toHaveClass('max-w-md');
  });

  it('should render with large size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="lg">
        Modal content
      </Modal>
    );
    
    const modalContent = screen.getByText('Modal content').closest('div');
    expect(modalContent?.parentElement).toHaveClass('max-w-lg');
  });

  it('should render with extra large size', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="xl">
        Modal content
      </Modal>
    );
    
    const modalContent = screen.getByText('Modal content').closest('div');
    expect(modalContent?.parentElement).toHaveClass('max-w-xl');
  });

  it('should prevent body scroll when open', () => {
    // Store original overflow value
    const originalOverflow = document.body.style.overflow;
    
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    // Restore original value
    document.body.style.overflow = originalOverflow;
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should render complex content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Complex Modal">
        <form>
          <input type="text" placeholder="Name" />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    );
    
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});