import Menu, { MenuItem, MenuRef } from 'rc-menu';
import React, { useEffect, useRef } from 'react';
import MentionsContext from './MentionsContext';
import type { DataDrivenOptionProps } from './Mentions';
interface DropdownMenuProps {
  prefixCls?: string;
  options: DataDrivenOptionProps[];
}

/**
 * We only use Menu to display the candidate.
 * The focus is controlled by textarea to make accessibility easy.
 */
function DropdownMenu(props: DropdownMenuProps) {
  const {
    notFoundContent,
    activeIndex,
    setActiveIndex,
    selectOption,
    onFocus,
    onBlur,
    onScroll,
  } = React.useContext(MentionsContext);

  const { prefixCls, options } = props;
  const activeOption = options[activeIndex] || {};
  const menuRef = useRef<MenuRef>(null);

  // Monitor the changes in ActiveIndex and scroll to the visible area if there are any changes
  useEffect(() => {
    if (activeIndex === -1 || !menuRef.current?.list) {
      return;
    }
    const selector = `.${prefixCls}-menu-item:nth-child(${activeIndex + 1})`;
    const activeItem = menuRef.current?.list.querySelector(selector);
    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeIndex, prefixCls]);

  return (
    <Menu
      ref={menuRef}
      prefixCls={`${prefixCls}-menu`}
      activeKey={activeOption.key}
      onSelect={({ key }) => {
        const option = options.find(({ key: optionKey }) => optionKey === key);
        selectOption(option);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      onScroll={onScroll}
    >
      {options.map((option, index) => {
        const { key, disabled, className, style, label } = option;
        return (
          <MenuItem
            key={key}
            disabled={disabled}
            className={className}
            style={style}
            onMouseEnter={() => {
              setActiveIndex(index);
            }}
          >
            {label}
          </MenuItem>
        );
      })}

      {!options.length && <MenuItem disabled>{notFoundContent}</MenuItem>}
    </Menu>
  );
}

export default DropdownMenu;
