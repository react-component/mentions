/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

class Demo extends React.Component {
  onResize = value => {
    const { width, height } = value;
    console.log(`width: ${width},height:${height}`);
  };

  render() {
    return (
      <div>
        <p>autoSize can be a boolean</p>
        <Mentions autoFocus autoSize defaultValue="Hello World" onResize={this.onResize}>
          <Option value="light">Light</Option>
          <Option value="bamboo">Bamboo</Option>
          <Option value="cat">Cat</Option>
        </Mentions>
        <p>
          <span>autoSize can also be an object to specify </span>
          <code>minRows</code> and <code>maxRows</code>
        </p>
        <Mentions
          autoSize={{ minRows: 3, maxRows: 6 }}
          defaultValue="Hello World"
          onResize={this.onResize}
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
