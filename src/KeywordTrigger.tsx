import Trigger from 'rc-trigger';
import * as React from 'react';
import DropdownMenu from './DropdownMenu';
import { OptionProps } from './Option';

import { Placement } from './Mentions';

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
  loading?: boolean;
  options: OptionProps[];
  prefixCls?: string;
  placement?: Placement;
  visible?: boolean;
  transitionName?: string;
}

class KeywordTrigger extends React.Component<KeywordTriggerProps, {}> {
  public getDropdownPrefix = () => `${this.props.prefixCls}-dropdown`;

  public getDropdownElement = () => {
    const { options } = this.props;
    return <DropdownMenu prefixCls={this.getDropdownPrefix()} options={options} />;
  };

  public render() {
    const { children, visible, placement, transitionName } = this.props;

    const popupElement = this.getDropdownElement();

    return (
      <Trigger
        prefixCls={this.getDropdownPrefix()}
        popupVisible={visible}
        popup={popupElement}
        popupPlacement={placement === 'top' ? 'topRight' : 'bottomRight'}
        popupTransitionName={transitionName}
        builtinPlacements={BUILT_IN_PLACEMENTS}
      >
        {children}
      </Trigger>
    );
  }
}

export default KeywordTrigger;
