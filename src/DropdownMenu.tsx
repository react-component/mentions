import Menu, { MenuItem } from 'rc-menu';
import * as React from 'react';
import type { DataDrivenOptionProps } from './Mentions';
import MentionsContext from './MentionsContext';
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
  } = React.useContext(MentionsContext);

  const { prefixCls, options } = props;
  const activeOption = options[activeIndex] || {};

  return (
    <Menu
      prefixCls={`${prefixCls}-menu`}
      activeKey={activeOption.key}
      onSelect={({ key }) => {
        const option = options.find(({ key: optionKey }) => optionKey === key);
        selectOption(option);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {options.length > 0 ? (
        options.map((option, index) => {
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
        })
      ) : (
        <MenuItem key="not-found" disabled>
          {notFoundContent}
        </MenuItem>
      )}
    </Menu>
  );
}

export default DropdownMenu;
