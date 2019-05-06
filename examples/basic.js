/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

class Demo extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <Mentions autoFocus defaultValue="Hello World">
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
          <Option value="cat">Cat</Option>
        </Mentions>
      </div>
    );
  }
}

export default Demo;
