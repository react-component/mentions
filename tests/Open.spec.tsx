import React from 'react';
import Mentions from '../src';
import { expectMeasuring } from './util';
import { render } from '@testing-library/react';

const { Option } = Mentions;

describe('Mentions.Open', () => {
  it('force open', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <Mentions open defaultValue="@">
        <Option value="bamboo">Bamboo</Option>
        <Option value="light">Light</Option>
        <Option value="cat">Cat</Option>
      </Mentions>,
    );

    expectMeasuring(container);

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `open` of Mentions is only used for debug usage. Do not use in you production.',
    );
    errorSpy.mockRestore();
  });
});
