import Trigger from 'rc-trigger';
import * as React from 'react';
import DropdownMenu from './DropdownMenu';
import { OptionProps } from './Option';

const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

interface KeywordTriggerProps {
  visible?: boolean;
  loading?: boolean;
  prefixCls?: string;
  options: OptionProps[];
  activeIndex: number;
}

class KeywordTrigger extends React.Component<KeywordTriggerProps, {}> {
  public getDropdownPrefix = () => `${this.props.prefixCls}-dropdown`;

  public getDropdownElement = () => {
    const { options, activeIndex } = this.props;
    return (
      <DropdownMenu
        prefixCls={this.getDropdownPrefix()}
        options={options}
        activeIndex={activeIndex}
      />
    );
  };

  public render() {
    const { children, visible } = this.props;

    const popupElement = this.getDropdownElement();

    return (
      <Trigger
        prefixCls={this.getDropdownPrefix()}
        popupVisible={visible}
        popup={popupElement}
        popupPlacement="bottomRight"
        builtinPlacements={BUILT_IN_PLACEMENTS}
      >
        {children}
      </Trigger>
    );
  }
}

export default KeywordTrigger;
