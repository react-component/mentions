import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Mentions, { UnstableContext } from '../src';

describe('DropdownMenu', () => {
  // Generate 20 options for testing scrolling behavior
  const generateOptions = Array.from({ length: 20 }).map((_, index) => ({
    value: `item-${index}`,
    label: `item-${index}`,
  }));

  // Setup component with UnstableContext for testing dropdown behavior
  const setup = () => {
    return render(
      <UnstableContext.Provider value={{ open: true }}>
        <Mentions defaultValue="@" options={generateOptions} />
      </UnstableContext.Provider>,
    );
  };

  it('should scroll into view when navigating with keyboard', () => {
    // Mock scrollIntoView since it's not implemented in JSDOM
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    setup();

    // Press ArrowDown multiple times to make options overflow the visible area
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    }

    // Verify if scrollIntoView was called
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });

    // Press ArrowUp to verify scrolling up
    for (let i = 0; i < 5; i++) {
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    }

    // Verify if scrollIntoView was called again
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });

    scrollIntoViewMock.mockReset();
    scrollIntoViewMock.mockRestore();
  });
});
