/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

export default () => (
  <Mentions rows={3} defaultValue="Hello World" open>
    <Option value="light">Light</Option>
    <Option value="bamboo">Bamboo</Option>
    <Option value="cat">Cat</Option>
  </Mentions>
);
