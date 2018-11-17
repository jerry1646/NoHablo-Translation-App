import React, {Component} from 'react';

class Users extends Component {
  constructor(){
    super()
    this.state = {
      users: []
    }
  }

  componentDidMount(){
    console.log("fetching data..");
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(users => this.setState({users}, () => console.log("Users fetched", users)))
  }

  render(){
    return (
      <div>
        <h2>Users</h2>
        <ul>
          {this.state.users.map(user =>
            <li key={user.id}>{user.name}</li>
          )}
        </ul>
      </div>
    )
  }

}

export default Users
