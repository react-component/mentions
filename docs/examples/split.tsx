import React from 'react';
import Mentions from '@rc-component/mentions';
import '../../assets/index.less';

const { Option } = Mentions;

function validateSearch(text) {
  console.log('~~>', text);
  return text.length <= 3;
}

export default () => (
  <div>
    <h1>Customize Split Logic</h1>
    <p>Only validate string length less than 3</p>
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
