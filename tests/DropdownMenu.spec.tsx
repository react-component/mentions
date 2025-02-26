import React from 'react';
import { render, act, screen } from '@testing-library/react';
import DropdownMenu, { DropdownMenuProps } from '../src/DropdownMenu';
import MentionsContext from '../src/MentionsContext';
import scrollIntoView from 'scroll-into-view-if-needed';

jest.mock('scroll-into-view-if-needed');

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
    const mockContext = createMockContext();
    const { rerender } = setup({}, mockContext);

    expect(scrollIntoView).not.toHaveBeenCalled();

    await act(async () => {
      mockContext.activeIndex = 1;
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

    const menuItems = await screen.findAllByRole('menuitem');

    const activeItemNode = menuItems.find(
      item =>
        item.textContent === 'Option 2' &&
        item.classList.contains('rc-mentions-dropdown-menu-item-active'),
    );

    expect(scrollIntoView).toHaveBeenCalled();

    expect(scrollIntoView).toHaveBeenCalledWith(activeItemNode, {
      block: 'nearest',
      inline: 'nearest',
      scrollMode: 'if-needed',
    });
  });
});
