import React from 'react';
import Mentions, { UnstableContext } from '@rc-component/mentions';
import '../../assets/index.less';

export default () => (
  <UnstableContext.Provider value={{ open: true }}>
    <Mentions
      rows={3}
      defaultValue="Hello @ World @"
      onScroll={e => {
        console.log(e);
      }}
      options={[
        {
          value: 'light',
          label: 'Light',
        },
        {
          value: 'bamboo',
          label: 'Bamboo',
        },
        {
          value: 'cat',
          label: 'Cat',
        },
      ]}
    />
  </UnstableContext.Provider>
);
