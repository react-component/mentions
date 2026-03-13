import React from 'react';
import { render, act } from '@testing-library/react';
import Mentions, { UnstableContext } from '../src';
import { simulateInput } from './util';

describe('DropdownMenu', () => {
  // Generate 20 options for testing scrolling behavior
  const generateOptions = Array.from({ length: 20 }).map((_, index) => ({
    value: `item-${index}`,
    label: `item-${index}`,
  }));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should scroll into view when navigating with keyboard', async () => {
    // Setup component with UnstableContext for testing dropdown behavior
    const { container } = render(
      <UnstableContext.Provider value={{ open: true }}>
        <Mentions autoFocus defaultValue="@" options={generateOptions} />
      </UnstableContext.Provider>,
    );

    // Mock scrollIntoView since it's not implemented in JSDOM
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    // Trigger should not scroll
    simulateInput(container, '@');
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      });
    }

    // Verify if scrollIntoView was called
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });

    scrollIntoViewMock.mockRestore();
  });

  it('should NOT scroll into view when navigating without focus', async () => {
    const { container } = render(
      <UnstableContext.Provider value={{ open: true }}>
        <Mentions defaultValue="@" options={generateOptions} />
      </UnstableContext.Provider>,
    );

    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    simulateInput(container, '@');

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      });
    }

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    scrollIntoViewMock.mockRestore();
  });
});
