import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Analytics, Auth } from 'aws-amplify'
import {withAuthenticator} from 'aws-amplify-react'

class App extends Component {
  state = {
    username: ''
  }
  async componentDidMount() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      console.log('user: ', user)
      this.setState({ username: user.username })
    } catch (err) {
      console.log('error getting user: ', err)
    }
  }
  recordEvent = () => {
    console.log('about to record event!')
    Analytics.record({
      name: 'My test event',
      attributes: {
        username: this.state.username
      }
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button
          onClick={this.recordEvent}
        >Record Event</button>
      </div>
    );
  }
}

export default withAuthenticator(App);
