## REST API

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { API } from 'aws-amplify'

class App extends Component {
  state = {
    pets: []
  }
  componentDidMount() {
    this.getData()
  }
  getData = async() => {
    try {
      const data = await API.get('apif8f4b7fe', '/pets')
      this.setState({ pets: data.pets })
    } catch (err) {
      console.log('error fetching data..', err)
    }
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
       {
         this.state.pets.map((p, i) => (
           <p key={i}>{p}</p>
         ))
       }
      </div>
    );
  }
}

export default App;

```