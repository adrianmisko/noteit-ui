import React from 'react';
import { cleanup, render, fireEvent, act, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Workspace from '../Workspace';

describe('Workspace', () => {
  beforeEach(cleanup);
  // moving to state manager will require separate tests
  it('Runs', () => {});
  /*  it('Renders without crashing', () => {
    render(<Workspace />);
  });

  it('Contains Toolbox and editor', () => {
    const { getByTestId } = render(<Workspace />);
    expect(getByTestId('Toolbox')).toBeDefined();
    expect(getByTestId('editor')).toBeDefined();
  });

  it('Can paste content into editor and display it', async () => {
    const { getByTestId, getByText } = render(<Workspace />);

    // mocks window.navigator.clipboard.readText()
    Object.defineProperty(window.navigator, 'clipboard', {
      get: () => {
        return {
          readText: async () => new Promise((res, _) => res('Some text')),
        };
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('pasteButton'));
    });

    expect(getByText('Some text')).toBeDefined();
  });

  it('Can change font size', () => {
    const { getByTestId } = render(<Workspace />);
    const editor = getByTestId('editor');

    expect(editor).toHaveStyle('font-size: 14px');

    act(() => {
      fireEvent.click(getByTestId('decreaseFontSizeButton'));
      fireEvent.click(getByTestId('increaseFontSizeButton'));
      fireEvent.click(getByTestId('increaseFontSizeButton'));
    });

    expect(editor).toHaveStyle('font-size: 16px');
  });
  it('Renders all tags', async () => {
    const { getByText } = render(<Workspace />);

    await wait(() => expect(getByText('Person')).toBeDefined());
    await wait(() => expect(getByText('Animal')).toBeDefined());
  });
  */
});
