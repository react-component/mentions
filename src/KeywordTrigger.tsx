import Trigger from 'rc-trigger';
import * as React from 'react';
import { FC, useMemo } from 'react';
import DropdownMenu from './DropdownMenu';
import type { DataDrivenOptionProps, Direction, Placement } from './Mentions';

const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomLeft: {
    points: ['tr', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['br', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

interface KeywordTriggerProps {
  loading?: boolean;
  options: DataDrivenOptionProps[];
  prefixCls?: string;
  placement?: Placement;
  direction?: Direction;
  visible?: boolean;
  transitionName?: string;
  children?: React.ReactElement;
  getPopupContainer?: () => HTMLElement;
  dropdownClassName?: string;
}

const KeywordTrigger: FC<KeywordTriggerProps> = props => {
  const {
    prefixCls,
    options,
    children,
    visible,
    transitionName,
    getPopupContainer,
    dropdownClassName,
    direction,
    placement,
  } = props;

  const dropdownPrefix = `${prefixCls}-dropdown`;

  const dropdownElement = (
    <DropdownMenu prefixCls={dropdownPrefix} options={options} />
  );

  const dropdownPlacement = useMemo(() => {
    let popupPlacement;
    if (direction === 'rtl') {
      popupPlacement = placement === 'top' ? 'topLeft' : 'bottomLeft';
    } else {
      popupPlacement = placement === 'top' ? 'topRight' : 'bottomRight';
    }
    return popupPlacement;
  }, [direction, placement]);

  return (
    <Trigger
      prefixCls={dropdownPrefix}
      popupVisible={visible}
      popup={dropdownElement}
      popupPlacement={dropdownPlacement}
      popupTransitionName={transitionName}
      builtinPlacements={BUILT_IN_PLACEMENTS}
      getPopupContainer={getPopupContainer}
      popupClassName={dropdownClassName}
    >
      {children}
    </Trigger>
  );
};

export default KeywordTrigger;
