## Storage

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Storage } from 'aws-amplify'

class S3ImageUpload extends React.Component {
  onChange(e) {
      const file = e.target.files[0];
      Storage.put('example.png', file, {
          contentType: 'image/png'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
  }

  render() {
      return (
          <input
              type="file" accept='image/png'
              onChange={(e) => this.onChange(e)}
          />
      )
  }
}

export default S3ImageUpload;

```