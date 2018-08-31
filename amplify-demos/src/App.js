import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { graphqlOperation, API } from 'aws-amplify'


const ListPets = `
  query {
    listPets {
      items {
        id
        name
        description
      }
    }
  }
`
const CreatePet = `
  mutation($name: String!, $description: String) {
    createPet(input: {
      name: $name, description: $description
    }) {
      id
      name
      description
    }
  }
`

class App extends Component {
  state = {
    name: '', description: '', pets: []
  }
  async componentDidMount() {
    try {
      const pets = await API.graphql(graphqlOperation(ListPets))
      console.log('pets:', pets)
      this.setState({
        pets: pets.data.listPets.items
      })
    } catch (err) {
      console.log('error fetching pets...', err)
    }
  }  
  createPet = async() => {
    const { name, description } = this.state
    if (name === '') return
    let pet = { name }
    if (description !== '') {
      pet = { ...pet, description }
    }
    const updatedPetArray = [...this.state.pets, pet]
    this.setState({ pets: updatedPetArray })
    try {
      await API.graphql(graphqlOperation(CreatePet, pet))
      console.log('item created!')
    } catch (err) {
      console.log('error creating pet...', err)
    }
  }
  // change state then user types into input
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    return (
      <div className="App">
      <input
        name='name'
        onChange={this.onChange}
        value={this.state.name}
      />
      <input
        name='description'
        onChange={this.onChange}
        value={this.state.description}
      />
      <button onClick={this.createPet}>Create Pet</button>
        {
        this.state.pets.map((pet, index) => (
          <div key={index}>
            <h3>{pet.name}</h3>
            <p>{pet.description}</p>
          </div>
        ))
      }
      </div>
    );
  }
}

export default App;
