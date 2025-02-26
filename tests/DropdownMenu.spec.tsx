import React from 'react';
import { render, act } from '@testing-library/react';
import DropdownMenu, { DropdownMenuProps } from '../src/DropdownMenu';
import MentionsContext from '../src/MentionsContext';

// Mocking scrollIntoView to prevent actual DOM manipulation
global.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('DropdownMenu useEffect', () => {
  const createMockContext = (overrides = {}) => ({
    activeIndex: -1,
    setActiveIndex: jest.fn(),
    selectOption: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onScroll: jest.fn(),
    notFoundContent: 'No results',
    ...overrides,
  });

  const setup = (
    props: Partial<DropdownMenuProps> = {},
    context = createMockContext(),
  ) => {
    return render(
      <MentionsContext.Provider value={context}>
        <DropdownMenu
          prefixCls="rc-mentions"
          options={[
            { key: '1', label: 'Option 1' },
            { key: '2', label: 'Option 2' },
          ]}
          {...props}
        />
      </MentionsContext.Provider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should scroll to active item when activeIndex changes', async () => {
    const mockContext = createMockContext();
    const { rerender } = setup({}, mockContext);

    // No scroll on initial render with activeIndex -1
    expect(global.HTMLElement.prototype.scrollIntoView).not.toBeCalled();

    await act(async () => {
      // Update context activeIndex
      mockContext.activeIndex = 1;
      // Re-render the component
      rerender(
        <MentionsContext.Provider value={mockContext}>
          <DropdownMenu
            prefixCls="rc-mentions"
            options={[
              { key: '1', label: 'Option 1' },
              { key: '2', label: 'Option 2' },
            ]}
          />
        </MentionsContext.Provider>,
      );
    });

    // Check that scrollIntoView was called
    expect(global.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });
  });
});
