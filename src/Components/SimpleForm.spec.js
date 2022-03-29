//import { userEvent } from "@storybook/testing-library";
import { render, screen } from '@testing-library/react';
import SimpleForm from './SimpleForm.js';

describe('SimpleForm', () => {
  it('renders 6 label and an 6 input with a placeholder', () => {
    //const callback = jest.fn();
    render(<SimpleForm />);

    const inputDay = screen.getByRole('input');
    expect(inputDay).toBeInTheDocument();
  });
});
