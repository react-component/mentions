/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

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

    const options = OPTIONS[prefix].map(value => ({
      value,
      key: value,
      label: value,
    }));
    return (
      <div>
        @ for string, # for number
        <Mentions
          prefix={['@', '#']}
          onSearch={this.onSearch}
          style={{ width: '100%', fontSize: 50 }}
          autoFocus
          options={options}
         />
      </div>
    );
  }
}

export default Demo;
