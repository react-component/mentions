import Menu, { MenuItem } from 'rc-menu';
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
  const menuWrapperRef = useRef<HTMLDivElement>(null);

  // Monitor the changes in ActiveIndex and scroll to the visible area if there are any changes
  useEffect(() => {
    if (activeIndex === -1 || !menuWrapperRef.current) {
      return;
    }
    const selector = `.${prefixCls}-menu-item:nth-child(${activeIndex + 1})`;
    const activeItem = menuWrapperRef.current.querySelector(selector);
    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeIndex, prefixCls]);

  return (
    <div ref={menuWrapperRef}>
      <Menu
        prefixCls={`${prefixCls}-menu`}
        activeKey={activeOption.key}
        onSelect={({ key }) => {
          const option = options.find(
            ({ key: optionKey }) => optionKey === key,
          );
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
    </div>
  );
}

export default DropdownMenu;
