import Menu, { MenuItem } from 'rc-menu';
import * as React from 'react';
import { MentionsContextConsumer, MentionsContextProps } from './MentionsContext';
import { OptionProps } from './Option';

interface DropdownMenuProps {
  prefixCls?: string;
  options: OptionProps[];
}

/**
 * We only use Menu to display the candidate.
 * The focus is controlled by textarea to make accessibility easy.
 */
class DropdownMenu extends React.Component<DropdownMenuProps, {}> {
  public renderDropdown = ({
    notFoundContent,
    activeIndex,
    setActiveIndex,
    selectOption,
    onFocus,
    onBlur,
  }: MentionsContextProps) => {
    const { prefixCls, options } = this.props;
    const activeOption = options[activeIndex] || {};

    return (
      <Menu
        prefixCls={`${prefixCls}-menu`}
        activeKey={activeOption.value}
        onSelect={({ key }: { key: string }) => {
          const option = options.find(({ value }) => value === key);
          selectOption(option);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {options.map((option, index) => {
          const { value, disabled, children, className, style } = option;
          return (
            <MenuItem
              key={value}
              disabled={disabled}
              className={className}
              style={style}
              onMouseEnter={() => {
                setActiveIndex(index);
              }}
            >
              {children}
            </MenuItem>
          );
        })}

        {!options.length && <MenuItem disabled>{notFoundContent}</MenuItem>}
      </Menu>
    );
  };

  public render() {
    return <MentionsContextConsumer>{this.renderDropdown}</MentionsContextConsumer>;
  }
}

export default DropdownMenu;
