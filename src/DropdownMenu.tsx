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
  const itemRefs = useRef<HTMLElement[]>([]);

  // Monitor the changes in ActiveIndex and scroll to the visible area if there are any changes
  const scrollToActiveOption = (index: number) => {
    if (index === -1 || !itemRefs.current[index]) return;
    const activeRef = itemRefs.current[index];
    activeRef.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const handleSelect = (key: string) => {
    const option = options.find(({ key: optionKey }) => optionKey === key);
    selectOption(option);
  };

  const getMenuItemRef = (node: HTMLElement | null, index: number) => {
    if (node) {
      itemRefs.current[index] = node;
    }
  };

  useEffect(() => {
    scrollToActiveOption(activeIndex);
  }, [activeIndex]);

  return (
    <Menu
      prefixCls={`${prefixCls}-menu`}
      activeKey={activeOption.key}
      onSelect={({ key }) => handleSelect(key)}
      onFocus={onFocus}
      onBlur={onBlur}
      onScroll={onScroll}
    >
      {options.map((option, index) => {
        const { key, disabled, className, style, label } = option;
        return (
          <MenuItem
            key={key}
            ref={node => getMenuItemRef(node, index)}
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
