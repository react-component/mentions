import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import Mentions, { UnstableContext } from '../src';
import { expectMeasuring, simulateInput } from './util';

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

  it('should scroll into view when navigating with keyboard', () => {
    // Setup component with UnstableContext for testing dropdown behavior
    const { container } = render(
      <UnstableContext.Provider value={{ open: true }}>
        <Mentions defaultValue="@" options={generateOptions} />
      </UnstableContext.Provider>,
    );

    // Mock scrollIntoView since it's not implemented in JSDOM
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    const textarea = container.querySelector('textarea')!;

    act(() => {
      // First trigger the measuring state by typing @
      simulateInput(container, '@');
      jest.runAllTimers();
    });

    // Verify we're in measuring state
    expectMeasuring(container, true);

    act(() => {
      // Press ArrowDown multiple times to make options overflow the visible area
      for (let i = 0; i < 10; i++) {
        fireEvent.keyDown(textarea, {
          keyCode: KeyCode.DOWN,
          which: KeyCode.DOWN,
        });
      }
      jest.runAllTimers();
    });

    // Verify if scrollIntoView was called
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });
    scrollIntoViewMock.mockClear();

    act(() => {
      // Press ArrowUp to verify scrolling up
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(textarea, {
          keyCode: KeyCode.UP,
          which: KeyCode.UP,
        });
      }
      jest.runAllTimers();
    });

    // Verify if scrollIntoView was called again
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });

    scrollIntoViewMock.mockRestore();
  });
});
