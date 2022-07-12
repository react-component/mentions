import { render } from '@testing-library/react';
import React from 'react';
import Mentions from '../src';

const { Option } = Mentions;

describe('Option', () => {
  // Option is a placeholder component. It should render nothing.
  it('should be empty', () => {
    const { container } = render(<Option>Nothing</Option>);
    expect(container.childElementCount).toBe(0);
  });
});
