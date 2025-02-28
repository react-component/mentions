import React from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';
import Mentions, { UnstableContext } from '../src'; // 修改为 Mentions 组件的实际路径
import { expectMeasuring } from './util'; // 假定该模块中有检测测量的函数

describe('Mentions Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should call scrollIntoView when activeIndex changes', async () => {
    const options = [
      { value: 'light', label: 'Light' },
      { value: 'bamboo', label: 'Bamboo' },
      { value: 'cat', label: 'Cat' },
    ];

    // Mock the scrollIntoView method before rendering
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(jest.fn());

    // Render Mentions with open context
    const { container } = render(
      <UnstableContext.Provider value={{ open: true }}>
        <Mentions defaultValue="@cat @" options={options} />
      </UnstableContext.Provider>,
    );

    // Simulate input to trigger the opening of the mentions dropdown
    const textarea = container.querySelector('textarea');
    fireEvent.change(textarea, { target: { value: '@b' } });

    await act(async () => {
      jest.runAllTimers(); // Handle any timing-related effects if applicable
    });

    // Update the active index to simulate selection
    const menuItems = await screen.findAllByRole('menuitem');

    // Simulate mouse enter on the second option to change active index
    fireEvent.mouseEnter(menuItems[2]);

    // Verify scrollIntoView was called correctly
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(2);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });

    expectMeasuring(container); // Verify measuring after interactions if necessary

    // Clean up
    scrollIntoViewMock.mockReset();
    scrollIntoViewMock.mockRestore();
  });
});
