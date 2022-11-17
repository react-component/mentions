import React from 'react';
import Mentions from '../src';
import { expectMeasuring } from './util';
import { render } from '@testing-library/react';

describe('Mentions.Open', () => {
  it('force open', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <Mentions
        open
        defaultValue="@cat @"
        options={[
          {
            value: 'light',
            label: 'Light',
          },
          {
            value: 'bamboo',
            label: 'Bamboo',
          },
          {
            value: 'cat',
            label: 'Cat',
          },
        ]}
      />,
    );

    expectMeasuring(container);

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `open` of Mentions is only used for debug usage. Do not use in you production.',
    );
    errorSpy.mockRestore();
  });
});
