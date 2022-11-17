/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

class Demo extends React.Component {
  onSelect = (option, prefix) => {
    console.log('Select:', prefix, '-', option.value);
  };

  onFocus = () => {
    console.log('onFocus');
  };

  onBlur = () => {
    console.log('onBlur');
  };

  render() {
    return (
      <div>
        <Mentions
          autoFocus
          rows={3}
          defaultValue="Hello World"
          onSelect={this.onSelect}
          onFocus={this.onFocus}
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
      </div>
    );
  }
}

export default Demo;
