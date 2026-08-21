import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { useAuth } from '@banking360/auth-client';

vi.mock('@banking360/auth-client', () => ({
  useAuth: vi.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      verifyOtp: vi.fn(),
      logout: vi.fn(),
      authState: {
        isAuthenticated: false,
        customer: null,
        isLoading: false,
        error: null,
      },
      isMfaRequired: false,
    } as unknown as ReturnType<typeof useAuth>);
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
  });

  it('renders the login form with default mobile value', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Welcome to Banking360/i)).toBeInTheDocument();
    const input = screen.getByLabelText<HTMLInputElement>(/Mobile Number/i);
    expect(input.value).toBe('9999999999');
  });

  it('shows a validation error for an invalid mobile number', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const input = screen.getByLabelText(/Mobile Number/i);
    await user.clear(input);
    await user.type(input, '123');
    await user.click(screen.getByRole('button', { name: /Send OTP/i }));
    expect(await screen.findByText(/Mobile number must be 10 digits/i)).toBeInTheDocument();
  });

  it('calls login on successful submit and shows no error', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByRole('button', { name: /Send OTP/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('9999999999'));
    expect(screen.queryByText(/Failed to send OTP/i)).not.toBeInTheDocument();
  });

  it('displays an error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Failed to send OTP'));
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByRole('button', { name: /Send OTP/i }));
    expect(await screen.findByText(/Failed to send OTP/i)).toBeInTheDocument();
  });

  it('disables the submit button while loading', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByRole('button', { name: /Send OTP/i }));
    expect(await screen.findByText(/Sending OTP/i)).toBeInTheDocument();
  });
});