import React from 'react';
import Mentions, { UnstableContext } from '@rc-component/mentions';
import '../../assets/index.less';
import './onScroll.less';

export default () => (
  <UnstableContext.Provider value={{ open: true }}>
    <Mentions
      rows={3}
      defaultValue="Hello @ World @"
      onPopupScroll={console.log}
      popupClassName="on-scroll"
      options={Array.from({ length: 1000 }).map((_, index) => ({
        value: `item-${index}`,
        label: `item-${index}`,
      }))}
    />
  </UnstableContext.Provider>
);
