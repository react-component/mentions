/* eslint no-console: 0 */

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

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
          inputComponent={TextareaAutosize}
          inputRefKey="inputRef"
          autoFocus
          rows={3}
          defaultValue="Hello World"
          onSelect={this.onSelect}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
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
