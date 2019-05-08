/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

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
        <Mentions style={{ width: '100%', fontSize: 30 }} filterOption={filterOption} autoFocus>
          <Option value="light" id="1128">
            Light (ID: 1128)
          </Option>
          <Option value="bamboo" id="903">
            Bamboo (ID: 903)
          </Option>
          <Option value="cat" id="1706">
            Cat (ID: 1706)
          </Option>
        </Mentions>
      </div>
    );
  }
}

export default Demo;
