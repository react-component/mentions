/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

const OPTIONS = {
  '@': ['light', 'bamboo', 'cat'],
  '#': ['123', '456', '7890'],
};

class Demo extends React.Component {
  state = {
    prefix: '@',
  };

  onSearch = (_, prefix) => {
    this.setState({ prefix });
  };

  render() {
    const { prefix } = this.state;

    return (
      <div>
        @ for string, # for number
        <Mentions
          prefix={['@', '#']}
          onSearch={this.onSearch}
          style={{ width: '100%', fontSize: 50 }}
          autoFocus
        >
          {OPTIONS[prefix].map(value => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Mentions>
      </div>
    );
  }
}

export default Demo;
