import React from 'react';
import Mentions from '@rc-component/mentions';
import '../../assets/index.less';

const OPTIONS = {
  '@': ['light', 'bamboo', 'cat'],
  '#': ['123', '456', '7890'],
};

export default () => {
  const [prefix, setPrefix] = React.useState<string>('@');

  const onSearch = (_, prefix) => {
    setPrefix(prefix);
  };

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
        onSearch={onSearch}
        style={{ width: '100%', fontSize: 50 }}
        autoFocus
        options={options}
      />
    </div>
  );
};
