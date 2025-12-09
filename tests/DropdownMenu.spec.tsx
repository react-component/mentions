import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Mentions from '../src';
import { simulateInput } from './util';

describe('DropdownMenu', () => {
  const generateOptions = Array.from({ length: 20 }).map((_, index) => ({
    value: `item-${index}`,
    label: `item-${index}`,
  }));

  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should scroll into view when navigating with keyboard (Focused)', async () => {
    const { container } = render(
      <Mentions defaultValue="" options={generateOptions} />,
    );

    const textarea = container.querySelector('textarea');
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    await act(async () => {
      textarea.focus();

      simulateInput(container, '@');

      jest.runAllTimers();
    });

    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'ArrowDown', code: 'ArrowDown' });
      jest.runAllTimers();
    });

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });

    scrollIntoViewMock.mockRestore();
  });

  it('should NOT scroll into view when input is NOT focused', async () => {
    const { container } = render(
      <Mentions defaultValue="" options={generateOptions} />,
    );

    const textarea = container.querySelector('textarea');
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    await act(async () => {
      textarea.focus();
      simulateInput(container, '@');
      jest.runAllTimers();
    });

    scrollIntoViewMock.mockClear();

    await act(async () => {
      fireEvent.blur(textarea);
      jest.runAllTimers();
    });

    await act(async () => {
      const menuItems = document.querySelectorAll('.rc-mentions-menu-item');
      if (menuItems.length > 1) {
        fireEvent.mouseEnter(menuItems[1]);
        jest.runAllTimers();
      }
    });

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    scrollIntoViewMock.mockRestore();
  });
});
