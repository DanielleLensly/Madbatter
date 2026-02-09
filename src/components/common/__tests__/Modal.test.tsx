import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="My Modal Title">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText('My Modal Title')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test">
        <div>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </div>
      </Modal>
    );

    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render without title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content without title</div>
      </Modal>
    );

    expect(screen.getByText('Content without title')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
