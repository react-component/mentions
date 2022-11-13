/* eslint-disable no-console, no-undef */

import React from 'react';
import debounce from 'lodash.debounce';
import Mentions from '../src';
import '../assets/index.less';
import './dynamic.less';

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.loadGithubUsers = debounce(this.loadGithubUsers, 800);
  }

  state = {
    search: '',
    loading: false,
    users: [],
  };

  onSearch = search => {
    this.setState({ search, loading: !!search, users: [] });
    console.log('Search:', search);
    this.loadGithubUsers(search);
  };

  loadGithubUsers(key) {
    if (!key) {
      this.setState({
        users: [],
      });
      return;
    }

    fetch(`https://api.github.com/search/users?q=${key}`)
      .then(res => res.json())
      .then(({ items = [] }) => {
        const { search } = this.state;
        if (search !== key) {
          console.log('Out Of Date >', key, items);
          return;
        }

        console.log('Fetch Users >', items);
        this.setState({
          users: items.slice(0, 10),
          loading: false,
        });
      });
  }

  render() {
    const { users, loading, search } = this.state;

    let items;
    if (loading) {
      items = [
        {
          value: search,
          disabled: true,
          label: `Searching '${search}'...`,
        },
      ];
    } else {
      items = users.map(({ login, avatar_url: avatar }) => ({
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
          onSearch={this.onSearch}
          style={{ width: '100%' }}
          autoFocus
          items={items}
        />
        search: <code>{search}</code>
      </div>
    );
  }
}

export default Demo;
