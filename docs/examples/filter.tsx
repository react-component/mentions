import React from 'react';
import Mentions from '@rc-component/mentions';
import '../../assets/index.less';

function filterOption(input, { key }) {
  return key.indexOf(input) !== -1;
}

export default () => (
  <Mentions
    style={{ width: '100%', fontSize: 30 }}
    filterOption={filterOption}
    autoFocus
    options={[
      {
        value: 'light',
        key: '1128',
        label: 'Light (ID: 1128)',
      },
      {
        value: 'bamboo',
        key: '903',
        label: 'Bamboo (ID: 903)',
      },
      {
        value: 'light',
        key: '1706',
        label: 'Cat (ID: 1706)',
      },
    ]}
  />
);
