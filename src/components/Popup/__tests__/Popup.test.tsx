import React from 'react';
import { cleanup, render, fireEvent, act, waitForDomChange, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tag from '../../../types/Tag';
import Popup from '../Popup';

describe('Popup', () => {
  beforeEach(cleanup);

  const tags: Tag[] = [{ id: 1, color: 'blue', name: 'Person' }, { id: 2, color: 'red', name: 'Animal' }];

  it('Renders without crashing', async () => {
    const { getByTestId, getByText } = render(<Popup tags={tags} annotations={[]} selection={[0, 0]} handleChoice={() => {}} />);

    Object.defineProperty(window.navigator, 'clipboard', {
      get: () => {
        return {
          readText: async () => new Promise((res, _) => res('Some text')),
        };
      },
    });

    await waitForElement(() => getByTestId('tagList'));
    expect(getByText('Animal')).toBeDefined();
  });
});
