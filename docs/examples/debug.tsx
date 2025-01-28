import React from 'react';
import Mentions from '@rc-component/mentions';
import '../../assets/index.less';

export default () => (
  <Mentions
    rows={3}
    defaultValue="Hello @ World @"
    onScroll={e => {
      console.log(e);
    }}
    open
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
);
