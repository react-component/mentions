import React from 'react';
import Mentions from 'rc-mentions';
import '../../assets/index.less';

export default () => (
  <Mentions
    rows={3}
    defaultValue="Hello @ World @"
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
