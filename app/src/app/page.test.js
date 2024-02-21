import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { identifyUser } from '../app/apiService';

// Mock the identifyUser function
jest.mock('../app/apiService', () => ({
  identifyUser: jest.fn(),
}));

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Puzzle Team Fun')).toBeInTheDocument();
  });

  it('initially has an anonymous user type', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Puzzle Team Fun')).toBeInTheDocument();
  });

  it('updates email state on input change', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

});
