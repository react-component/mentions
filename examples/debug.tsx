/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

export default () => (
  <Mentions
    rows={3}
    defaultValue="Hello @ World @"
    open
    items={[
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
