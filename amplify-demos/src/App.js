import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react'
import { Auth } from 'aws-amplify'

// using the withAuthenticator component, use the class as is
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

// export default withAuthenticator(App);

// using the Auth class
class App extends Component {
  state = { username: '', password: '', email: '', phone_number: '', confirmationCode: '' }
  signUp = async() => {
    console.log('state:', this.state)
    const { username, password, email, phone_number } = this.state
    try {
      await Auth.signUp({
        username, password, attributes: { email, phone_number }
      })
      console.log('user successfully created')
    } catch (err) {
      console.log('error creating user', err)
    }
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  confirmSignUp = async() => {
    const { username, confirmationCode } = this.state
    try {
      await Auth.confirmSignUp(username, confirmationCode)
      console.log('user successfully confirmed')
    } catch (err) {
      console.log('error: ', err)
    }
  }
  render() {
    return (
      <div className="App">
        <input name='username' onChange={this.onChange} placeholder='username' />
        <input type='password' name='password' onChange={this.onChange} placeholder='password' />
        <input name='email' onChange={this.onChange} placeholder='email' />
        <input name='phone_number' onChange={this.onChange} placeholder='phone number' />
        <button onClick={this.signUp}>Sign Up</button>
        <input name='confirmationCode' onChange={this.onChange} placeholder='confirmation code' />
        <button onClick={this.confirmSignUp}>Confirm Sign Up</button>
      </div>
    );
  }
}

export default App