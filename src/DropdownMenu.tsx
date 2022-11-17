import Menu, { MenuItem } from 'rc-menu';
import * as React from 'react';
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
