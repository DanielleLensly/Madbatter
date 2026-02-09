import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('should render with children text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render with primary variant by default', () => {
    render(<Button>Primary</Button>);

    const button = screen.getByText('Primary');
    expect(button.className).toContain('primary');
  });

  it('should render with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByText('Outline');
    expect(button.className).toContain('outline');
  });

  it('should render with danger variant', () => {
    render(<Button variant="danger">Danger</Button>);

    const button = screen.getByText('Danger');
    expect(button.className).toContain('danger');
  });

  it('should render with small size', () => {
    render(<Button size="small">Small</Button>);

    const button = screen.getByText('Small');
    expect(button.className).toContain('small');
  });

  it('should render with large size', () => {
    render(<Button size="large">Large</Button>);

    const button = screen.getByText('Large');
    expect(button.className).toContain('large');
  });

  it('should render full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);

    const button = screen.getByText('Full Width');
    expect(button.className).toContain('fullWidth');
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    await user.click(screen.getByText('Disabled'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render as submit type when type is submit', () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
