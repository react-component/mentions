import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import Mentions from '../src';
import { simulateInput } from './util';

describe('DropdownMenu', () => {
  const generateOptions = Array.from({ length: 20 }).map((_, index) => ({
    value: `item-${index}`,
    label: `item-${index}`,
  }));

  let originResizeObserver: any;
  beforeAll(() => {
    originResizeObserver = (global as any).ResizeObserver;
    (global as any).ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterAll(() => {
    (global as any).ResizeObserver = originResizeObserver;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
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

  it('should NOT scroll and hit the return statement when input blurs but menu is arguably open', async () => {
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

    await waitFor(() => {
      const menuItems = document.querySelectorAll(
        '.rc-mentions-dropdown-menu-item',
      );
      expect(menuItems.length).toBeGreaterThan(1);
    });

    const menuItems = document.querySelectorAll(
      '.rc-mentions-dropdown-menu-item',
    );

    await act(async () => {
      fireEvent.mouseEnter(menuItems[1]);

      fireEvent.blur(textarea);
      jest.runAllTimers();
    });

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    scrollIntoViewMock.mockRestore();
  });
});
