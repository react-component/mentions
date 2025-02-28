import React from 'react';
import Mentions, { UnstableContext } from '../src';
import { expectMeasuring } from './util';
import { render } from '@testing-library/react';

describe('Mentions.Open', () => {
  it('force open', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <UnstableContext.Provider value={{ open: true }}>
        <Mentions
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
        />
      </UnstableContext.Provider>,
    );

    expectMeasuring(container);

    errorSpy.mockRestore();
  });
});
