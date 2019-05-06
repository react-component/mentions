import Menu, { MenuItem } from 'rc-menu';
import * as React from 'react';
import { OptionProps } from './Option';

interface DropdownMenuProps {
  prefixCls?: string;
  options: OptionProps[];
  activeIndex: number;
}

/**
 * We only use Menu to display the candidate.
 * The focus is controlled by textarea to make accessibility easy.
 */
class DropdownMenu extends React.Component<DropdownMenuProps, {}> {
  public render() {
    const { prefixCls, options, activeIndex } = this.props;
    const activeOption = options[activeIndex] || {};

    return (
      <Menu prefixCls={`${prefixCls}-menu`} activeKey={activeOption.value}>
        {options.map(({ value, disabled }) => (
          <MenuItem key={value} disabled={disabled}>
            {value}
          </MenuItem>
        ))}

        {!options.length && <MenuItem disabled={true}>Nothing match!</MenuItem>}
      </Menu>
    );
  }
}

export default DropdownMenu;
