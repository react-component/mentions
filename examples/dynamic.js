/* eslint no-console: 0 */

import React from 'react';
import debounce from 'lodash.debounce';
import Mentions from '../src';
import '../assets/index.less';

const { Option } = Mentions;

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.loadGithubUsers = debounce(this.loadGithubUsers, 200);
  }

  state = {
    search: '',
    loading: false,
    users: [],
  };

  onSearch = search => {
    this.setState({ search, loading: true });
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
      .then(({ items }) => {
        console.log('Fecth Users >', items);
        this.setState({
          users: items.slice(0, 10),
          loading: false,
        });
      });
  }

  render() {
    const { users, loading, search } = this.state;
    return (
      <div>
        <Mentions onSearch={this.onSearch} style={{ width: '100%' }} loading={loading} autoFocus>
          {users.map(({ login, avatar_url: avatar }) => (
            <Option key={login} value={login}>
              <img src={avatar} alt={login} />
              {login}
            </Option>
          ))}
        </Mentions>
        search: <code>{search}</code>
      </div>
    );
  }
}

export default Demo;
