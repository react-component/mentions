import React from 'react';
import Mentions from 'rc-mentions';
import '../../assets/index.less';
import './onScroll.less';

export default () => (
  <Mentions
    rows={3}
    defaultValue="Hello @ World @"
    onPopupScroll={console.log}
    dropdownClassName="on-scroll"
    open
    options={Array.from({ length: 1000 }).map((_, index) => ({
      value: `item-${index}`,
      label: `item-${index}`,
    }))}
  />
);
