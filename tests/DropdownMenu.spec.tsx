import React from 'react';
import { render, act, screen } from '@testing-library/react';
import DropdownMenu, { DropdownMenuProps } from '../src/DropdownMenu';
import MentionsContext from '../src/MentionsContext';

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

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks(); // Restore original implementations
  });

  const setup = (
    props: Partial<DropdownMenuProps> = {},
    context = createMockContext(),
  ) => {
    return render(
      <MentionsContext.Provider value={context}>
        <DropdownMenu
          prefixCls="rc-mentions-dropdown"
          options={[
            { key: '1', label: 'Option 1' },
            { key: '2', label: 'Option 2' },
          ]}
          {...props}
        />
      </MentionsContext.Provider>,
    );
  };

  it('should scroll to active item when activeIndex changes', async () => {
    // Create the spy and mock the scrollIntoView method
    const scrollIntoViewMock = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockReset();

    const mockContext = createMockContext();
    const { rerender } = setup({}, mockContext);

    // Update active index
    await act(async () => {
      mockContext.activeIndex = 1; // Change to the second option
      rerender(
        <MentionsContext.Provider value={mockContext}>
          <DropdownMenu
            prefixCls="rc-mentions-dropdown"
            options={[
              { key: '1', label: 'Option 1' },
              { key: '2', label: 'Option 2' },
            ]}
          />
        </MentionsContext.Provider>,
      );
    });

    // Find all menu items
    const menuItems = await screen.findAllByRole('menuitem');

    // Check if the active item is the second one
    const activeItemNode = menuItems.find(
      item =>
        item.textContent === 'Option 2' &&
        item.classList.contains('rc-mentions-dropdown-menu-item-active'),
    );

    expect(activeItemNode.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(activeItemNode.scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    });
  });
});
