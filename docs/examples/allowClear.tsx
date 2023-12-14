import Mentions from 'rc-mentions';
import React, { useState } from 'react';

export default function App() {
  const [value, setValue] = useState('hello world');

  return (
    <div>
      <p>Uncontrolled</p>
      <Mentions allowClear />
      <p>controlled</p>
      <Mentions value={value} onChange={setValue} allowClear />
    </div>
  );
}
