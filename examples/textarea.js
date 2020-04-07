/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';
import './textarea.less';

const { Option } = Mentions;

export default () => (
  <div>
    <Mentions placeholder="disabled" disabled>
      <Option value="light">Light</Option>
      <Option value="bamboo">Bamboo</Option>
      <Option value="cat">Cat</Option>
    </Mentions>

    <Mentions placeholder="readonly" readOnly>
      <Option value="light">Light</Option>
      <Option value="bamboo">Bamboo</Option>
      <Option value="cat">Cat</Option>
    </Mentions>

    <div style={{ paddingTop: 100 }}>
      <Mentions placeholder="placement: top" placement="top" transitionName="motion-zoom">
        <Option value="light">Light</Option>
        <Option value="bamboo">Bamboo</Option>
        <Option value="cat">Cat</Option>
      </Mentions>
    </div>

    <div style={{ padding: '100px 0', width: 200, direction: 'rtl' }}>
      <Mentions placeholder="direction: rtl" direction="rtl" transitionName="motion-zoom">
        <Option value="light">Light</Option>
        <Option value="bamboo">Bamboo</Option>
        <Option value="cat">Cat</Option>
      </Mentions>
    </div>
  </div>
);
