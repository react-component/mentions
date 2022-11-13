/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

function filterOption(input, { id }) {
  return id.indexOf(input) !== -1;
}

class Demo extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <h1>Customize Filter</h1>
        <p>Option has `id` and filter only hit by `id`</p>
        <Mentions
          style={{ width: '100%', fontSize: 30 }}
          filterOption={filterOption}
          autoFocus
          items={[
            {
              value: 'light',
              id: '1128',
              label: 'Light (ID: 1128)',
            },
            {
              value: 'bamboo',
              id: '903',
              label: 'Bamboo (ID: 903)',
            },
            {
              value: 'light',
              id: '1706',
              label: 'Cat (ID: 1706)',
            },
          ]}
        />
      </div>
    );
  }
}

export default Demo;
