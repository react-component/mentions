/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

function validateSearch(text) {
  return text.length <= 5;
}

class Demo extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <h1>Customize Split Logic</h1>
        <p>Only validate string length less than 5</p>
        <Mentions
          style={{ width: '100%', fontSize: 50 }}
          split=""
          validateSearch={validateSearch}
          autoFocus
        >
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
          <Option value="cat">Cat</Option>
        </Mentions>
      </div>
    );
  }
}

export default Demo;
