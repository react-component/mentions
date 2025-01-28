import React from 'react';
import Mentions from '@rc-component/mentions';
import '../../assets/index.less';
import './dynamic.less';

const useDebounce = (fn, delay) => {
  const { current } = React.useRef({ fn, timer: null });
  React.useEffect(() => {
    current.fn = fn;
  }, [fn]);
  return React.useCallback(
    (...args) => {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn(...args);
      }, delay);
    },
    [delay],
  );
};

export default () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const searchRef = React.useRef<string>('');

  const loadGithubUsers = useDebounce((key: string) => {
    if (!key) {
      setUsers([]);
      return;
    }

    fetch(`https://api.github.com/search/users?q=${key}`)
      .then(res => res.json())
      .then(({ items = [] }) => {
        if (searchRef.current !== key) {
          console.log('Out Of Date >', key, items);
          return;
        }

        console.log('Fetch Users >', items);
        setUsers(items.slice(0, 10));
        setLoading(false);
      });
  }, 800);

  const onSearch = (text: string) => {
    searchRef.current = text;
    setLoading(!!text);
    setUsers([]);
    console.log('Search:', text);
    loadGithubUsers(text);
  };

  let options;
  if (loading) {
    options = [
      {
        value: searchRef.current,
        disabled: true,
        label: `Searching '${searchRef.current}'...`,
      },
    ];
  } else {
    options = users.map(({ login, avatar_url: avatar }) => ({
      key: login,
      value: login,
      className: 'dynamic-option',
      label: (
        <>
          <img src={avatar} alt={login} />
          <span>{login}</span>
        </>
      ),
    }));
  }

  return (
    <div>
      <Mentions
        onSearch={onSearch}
        style={{ width: '100%' }}
        autoFocus
        options={options}
      />
      search: <code>{searchRef.current}</code>
    </div>
  );
};
