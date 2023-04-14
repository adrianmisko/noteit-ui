import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Button } from '@material-ui/core';
import Toolbox from '../Toolbox';

describe('Toolbox component', () => {
  beforeEach(cleanup);

  it('Renders without crashing given no options', () => {
    render(<Toolbox />);
  });

  it('Renders without crashing given a button', () => {
    const button = <Button id="aButton">A button</Button>;
    const { getByText } = render(<Toolbox items={[button]} />);
    expect(getByText('A button')).toBeDefined();
  });
});
