# Building Web Applications with AWS Amplify

In this workshop we'll learn how to build cloud-enabled web applications with React & [AWS Amplify](https://aws-amplify.github.io/).

![](https://imgur.com/IPnnJyf.jpg)

### Topics we'll be covering:

- [Authentication](https://github.com/dabit3/aws-amplify-workshop-web#adding-authentication)
- [GraphQL API with AWS AppSync](https://github.com/dabit3/aws-amplify-workshop-web#adding-a-rest-api)
- [REST API with a Lambda Function](https://github.com/dabit3/aws-amplify-workshop-web#adding-a-graphql-api)
- [Adding Storage with Amazon S3](https://github.com/dabit3/aws-amplify-workshop-web#working-with-storage)
- [Hosting](https://github.com/dabit3/aws-amplify-workshop-web#hosting)
- [Analytics](https://github.com/dabit3/aws-amplify-workshop-web#adding-analytics)
- [Removing / Deleting Services](https://github.com/dabit3/aws-amplify-workshop-web#removing-services)

<!-- ## Redeeming our AWS Credit   

1. Visit the [AWS Console](https://console.aws.amazon.com/console).
2. In the top right corner, click on __My Account__.
![](dashboard1.jpg)
3. In the left menu, click __Credits__.
![](dashboard2.jpg) -->

## Getting Started - Creating the React Application

To get started, we first need to create a new React project & change into the new directory using the [Create React App CLI](https://github.com/facebook/create-react-app).


```bash
npx create-react-app full-stack-aws
```

Now change into the new app directory & install the AWS Amplify & AWS Amplify React libraries:

```bash
cd full-stack-aws
npm install --save aws-amplify @aws-amplify/ui-react
# or
yarn add aws-amplify @aws-amplify/ui-react
```

## Installing the CLI & Initializing a new AWS Amplify Project

### Installing the CLI

Next, we'll install the AWS Amplify CLI:

```bash
npm install -g @aws-amplify/cli
```

Now we need to configure the CLI with our credentials.

> If you'd like to see a video walkthrough of this configuration process, click [here](https://www.youtube.com/watch?v=fWbM5DLh25U).

```bash
amplify configure

- Specify the AWS Region: us-east-1 || us-west-2 || eu-central-1
- Specify the username of the new IAM user: amplify-workshop-user
> In the AWS Console, click Next: Permissions, Next: Tags, Next: Review, & Create User to create the new IAM user. Then return to the command line & press Enter.
- Enter the access key of the newly created user:   
? accessKeyId: (<YOUR_ACCESS_KEY_ID>)  
? secretAccessKey: (<YOUR_SECRET_ACCESS_KEY>)
- Profile Name: amplify-workshop-user
```

### Initializing A New Project

```bash
amplify init

- Enter a name for the project: full-stack-aws
- Enter a name for the environment: dev
- Choose your default editor: Visual Studio Code (or your default editor)
- Please choose the type of app that youre building: javascript
- What javascript framework are you using: react
- Source Directory Path: . (this sets the base directory to the root directory)
- Distribution Directory Path: .next
- Build Command: npm run-script build
- Start Command: npm run-script start
- Do you want to use an AWS profile? Y
- Please choose the profile you want to use: amplify-workshop-user (or your preferred profile)
```

The Amplify CLI has initialized a new project & you will see a new folder: __amplify__ & a new file called __aws-exports.js__ in the root directory. These files hold your project configuration.

To view the sus of the amplify project at any time, you can run the Amplify `status` command:

```sh
$ amplify status
```

To view the amplify project in the Amplify console at any time, run the `console` command:

```sh
$ amplify console
```

## Adding Authentication

To add authentication, we can use the following command:

```sh
$ amplify add auth

? Do you want to use default authentication and security configuration? Default configuration 
? How do you want users to be able to sign in when using your Cognito User Pool? Username
? Do you want to configure advanced settings? No, I am done. 
```

Now, we'll run the push command and the cloud resources will be created in our AWS account.

```bash
amplify push
```

To view the new Cognito authentication service at any time after its creation, you can visit the Amplify Console or run the following command:

```sh
amplify console auth
```

### Configuring the React applicaion

Now, our resources are created & we can start using them!

The first thing we need to do is to configure our React application to be aware of our new AWS Amplify project. We can do this by referencing the auto-generated `aws-exports.js` file that is now in our src folder.

To configure the app, open __src/index.js__ and add the following code below the last import:

```js
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

Now, our app is ready to start using our AWS services.

### Using the withAuthenticator component

To add authentication, we'll go into __src/App.js__ and first import the `withAuthenticator` HOC (Higher Order Component) from `@aws-amplify/ui-react`:

```js
import { withAuthenticator } from '@aws-amplify/ui-react'
```

Next, we'll wrap our default export (the App component) with the `withAuthenticator` HOC:

```js
export default withAuthenticator(App)
```

Now, we can run the app and see that an Authentication flow has been added in front of our App component. This flow gives users the ability to sign up & sign in.

> To view users that have been created in Cognito at any time, visit the Cognito dashboard by running `amplify console auth`.

Next, you can add easily a Sign Out button at any time by using the `AmplifySignOut` component:

```javascript
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

// usage
<AmplifySignOut />
```

### Accessing User Data

We can access the user's info now that they are signed in by calling `Auth.currentAuthenticatedUser()`.

Let's update the component to show the user their profile information:

```js
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    checkUser()
  }, [])
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user)
  }
  if (!user) return null
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
      <h3 className="font-medium text-gray-500 my-2">Username: {user.username}</h3>
      <p className="text-sm text-gray-500 mb-6">Email: {user.attributes.email}</p>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(App)
```

### Custom authentication strategies

The `withAuthenticator` component is a really easy way to get up and running with authentication, but in a real-world application we probably want more control over how our form looks & functions.

Let's look at how we might create our own authentication flow.

To get started, we would probably want to create input fields that would hold user input data in the state. For instance when signing up a new user, we would probably need 4 user inputs to capture the user's username, email, password, & phone number.

To do this, we could create some initial state for these values & create an event handler that we could attach to the form inputs:

```js
// initial state
state = {
  username: '', password: '', email: '', phone_number: ''
}

// event handler
onChange = (event) => {
  this.setState({ [event.target.name]: event.target.value })
}

// example of usage with input
<input
  name='username'
  placeholder='username'
  onChange={this.onChange}
/>
```

We'd also need to have a method that signed up & signed in users. We can us the Auth class to do thi. The Auth class has over 30 methods including things like `signUp`, `signIn`, `confirmSignUp`, `confirmSignIn`, & `forgotPassword`. Thes functions return a promise so they need to be handled asynchronously.

```js
// import the Auth component
import { Auth } from 'aws-amplify'

// Class method to sign up a user
signUp = async() => {
  const { username, password, email, phone_number } = this.state
  try {
    await Auth.signUp({ username, password, attributes: { email, phone_number }})
  } catch (err) {
    console.log('error signing up user...', err)
  }
}
```

## Adding a GraphQL API

To add a GraphQL API, we can use the following command:

```sh
amplify add api
```

Answer the following questions

- Please select from one of the above mentioned services __GraphQL__   
- Provide API name: __AmplifyWorkshopTest__   
- Choose an authorization type for the API __API key__   
- Do you have an annotated GraphQL schema? __N__   
- Do you want a guided schema creation? __Y__   
- What best describes your project: __Single object with fields (e.g. “Todo” with ID, name, description)__   
- Do you want to edit the schema now? (Y/n) __Y__   

> When prompted, update the schema to the following:   

```graphql
type Pet @model {
  id: ID!
  name: String!
  description: String
}
```

> Next, let's push the configuration to our account:

```bash
amplify push
```

> To view the new AWS AppSync API at any time after its creation, go to the dashboard at [https://console.aws.amazon.com/appsync](https://console.aws.amazon.com/appsync). Also be sure that your region is set correctly.

### Adding mutations from within the AWS AppSync Console

In the AWS AppSync console, open your API & then click on Queries.

Execute the following mutation to create a new pet in the API:

```graphql
mutation createPet {
  createPet(input: {
    name: "Zeus"
    description: "Best dog in the western hemisphere"
  }) {
    id
  }
}
```

Now, let's query for the pet:

```graphql
query listPets {
  listPets {
    items {
      id
      name
      description
    }
  }
}
```

We can even add search / filter capabilities when querying:

```graphql
query listPets {
  listPets(filter: {
    description: {
      contains: "dog"
    }
  }) {
    items {
      id
      name
      description
    }
  }
}
```

### Interacting with the GraphQL API from our client application - Querying for data

Now that the GraphQL API is created we can begin interacting with it!

The first thing we'll do is perform a query to fetch data from our API.

To do so, we need to define the query, execute the query, store the data in our state, then list the items in our UI.


```js
// imports from Amplify library
import { API, graphqlOperation } from 'aws-amplify'

// define query
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

// define some state to hold the data returned from the API
state = {
  pets: []
}

// execute the query in componentDidMount
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

// add UI in render method to show data
  {
    this.state.pets.map((pet, index) => (
      <div key={index}>
        <h3>{pet.name}</h3>
        <p>{pet.description}</p>
      </div>
    ))
  }
```

## Performing mutations

 Now, let's look at how we can create mutations.

```js
import { graphqlOperation, API } from 'aws-amplify'

// define the new mutation
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

// create initial state
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

// add UI with event handlers to manage user input
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
```

### GraphQL Subscriptions

Next, let's see how we can create a subscription to subscribe to changes of data in our API.

To do so, we need to define the subscription, listen for the subscription, & update the state whenever a new piece of data comes in through the subscription.

```js
// define the subscription
const SubscribeToNewPets = `subscription {
  onCreatePet {
    id
    name
    description
  }
}`;

// subscribe in componentDidMount
API.graphql(
  graphqlOperation(SubscribeToNewPets)
).subscribe({
    next: (eventData) => {
      console.log('eventData', eventData)
      const pet = eventData.value.data.onCreatePet
      const pets = [
        ...this.state.pets.filter(p => {
          const val1 = p.name + p.description
          const val2 = pet.name + pet.description
          return val1 !== val2
        }),
        pet
      ]
      this.setState({ pets })
    }
});
```

## Adding a REST API

To add a REST API, we can use the following command:

```sh
amplify add api
```

> Answer the following questions

- Please select from one of the above mentioned services __REST__   
- Provide a friendly name for your resource that will be used to label this category in the project: __amplifyrestapi__   
- Provide a path, e.g. /items __/pets__   
- Choose lambda source __Create a new Lambda function__   
- Provide a friendly name for your resource that will be used to label this category in the project: __amplifyrestapilambda__   
- Provide the Lambda function name: __amplifyrestapilambda__   
- Please select the function template you want to use: __Serverless express function (Integration with Amazon API Gateway)__   
- Do you want to edit the local lambda function now? __Y__   

> Update the existing `app.get('/pets') route with the following:
```js
app.get('/pets', function(req, res) {
  // Add your code here
  // Return the API Gateway event and query string parameters for example
  const pets = [
    'Spike', 'Zeus', 'Butch'
  ]
  res.json({
    success: 'get call succeed!',
    url: req.url,
    pets
  });
});
```

- Restrict API access __Y__
- Who should have access? Authenticated users only
- What kind of access do you want for Authenticated users read/write
- Do you want to add another path? (y/N) __N__     

> Now the resources have been created & configured & we can push them to our account: 

```bash
amplify push
```

### Interacting with the new API

Now that the API is created we can start sending requests to it & interacting with it.

Let's request some data from the API:

```js
import { API } from 'aws-amplify'

// create initial state
state = { pets: [] }

// fetch data at componentDidMount
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

// implement into render method
{
  this.state.pets.map((p, i) => (
    <p key={i}>{p}</p>
  ))
}
```

### Fetching data from another API in a Lambda function.

Next, let's configure the REST API to add another endpoint that will fetch data from an external resource.

The first thing we need to do is install `axios` in our Lambda function folder.

Navigate to __amplify/backend/function/<FUNCTION_NAME>/src__ and install __axios__:

```sh
yarn add axios

# or

npm install axios
```

Next, in __amplify/backend/function/<FUNCTION_NAME>/src/app.js__, let's add a new endpoint that will fetch a list of people from the [Star Wars API](https://swapi.co/).

```js
// require axios
var axios = require('axios')

// add new /people endpoint
app.get('/people', function(req, res) {
  axios.get('https://swapi.co/api/people/')
    .then(response => {
      res.json({
        people: response.data.results,
        success: 'get call succeed!',
        url: req.url
      });
    })
    .catch(err => {
      res.json({
        error: 'error fetching data'
      });
    })
});
```

Now we can add a new function called getPeople that will call this API:

```js
getPeople = async() => {
  try {
    const data = await API.get('amplifyrestlamdbaapi', '/people')
    this.setState({ people: data.people })
  } catch (err) {
    console.log('error fetching data..', err)
  }
}
```

## Working with Storage

To add storage, we can use the following command:

```sh
amplify add storage
```

> Answer the following questions   

- Please select from one of the below mentioned services __Content (Images, audio, video, etc.)__
- Please provide a friendly name for your resource that will be used to label this category in the
 project: __YOURAPINAME__
- Please provide bucket name: __YOURUNIQUEBUCKETNAME__
- Who should have access: __Auth users only__
- What kind of access do you want for Authenticated users __read/write__   


```sh
amplify push
```

Now, storage is configured & ready to use.

What we've done above is created configured an Amazon S3 bucket that we can now start using for storing items.

For example, if we wanted to test it out we could store some text in a file like this:

```js
import { Storage } from 'aws-amplify'

// create function to work with Storage
addToStorage = () => {
  Storage.put('javascript/MyReactComponent.js', `
    import React from 'react'
    const App = () => (
      <p>Hello World</p>
    )
    export default App
  `)
    .then (result => {
      console.log('result: ', result)
    })
    .catch(err => console.log('error: ', err));
}

// add click handler
<button onClick={this.addToStorage}>Add To Storage</button>
```

This would create a folder called `javascript` in our S3 bucket & store a file called __MyReactComponent.js__ there with the code we specified in the second argument of `Storage.put`.

If we want to read everything from this folder, we can use `Storage.list`:

```js
readFromStorage = () => {
  Storage.list('javascript/')
    .then(data => console.log('data from S3: ', data))
    .catch(err => console.log('error'))
}
```

If we only want to read the single file, we can use `Storage.get`:

```js
readFromStorage = () => {
  Storage.get('javascript/MyReactComponent.js')
    .then(data => console.log('data from S3: ', data))
    .catch(err => console.log('error'))
}
```

If we wanted to pull down everything, we can use `Storage.list`:

```js
readFromStorage = () => {
  Storage.list('')
    .then(data => console.log('data from S3: ', data))
    .catch(err => console.log('error'))
}
```

### Working with images

Working with images is also easy:

```js
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

```

## Hosting

To deploy & host your app on AWS, we can use the `hosting` category.

```sh
amplify add hosting
```

- Select the environment setup: __DEV (S3 only with HTTP)__
- hosting bucket name __YOURBUCKETNAME__
- index doc for the website __index.html__
- error doc for the website __index.html__

Now, everything is set up & we can publish it:

```sh
amplify publish
```

## Adding Analytics

To add analytics, we can use the following command:

```sh
amplify add analytics
```

> Next, we'll be prompted for the following:

? Provide your pinpoint resource name: __amplifyanalytics__   
? Apps need authorization to send analytics events. Do you want to allow guest/unauthenticated users to send analytics events (recommended when getting started)? __Y__   
? overwrite YOURFILEPATH-cloudformation-template.yml __Y__

### Recording events

Now that the service has been created we can now begin recording events.

To record analytics events, we need to import the `Analytics` class from Amplify & then call `Analytics.record`:

```js
import { Analytics } from 'aws-amplify'

state = {username: ''}

async componentDidMount() {
  try {
    const user = await Auth.currentAuthenticatedUser()
    this.setState({ username: user.username })
  } catch (err) {
    console.log('error getting user: ', err)
  }
}

recordEvent = () => {
  Analytics.record({
    name: 'My test event',
    attributes: {
      username: this.state.username
    }
  })
}

<button onClick={this.recordEvent}>Record Event</button>
```

## Removing Services

If at any time, or at the end of this workshop, you would like to delete a service from your project & your account, you can do this by running the `amplify remove` command:

```sh
amplify remove auth

amplify push
```

If you are unsure of what services you have enabled at any time, you can run the `amplify status` command:

```sh
amplify status
```

`amplify status` will give you the list of resources that are currently enabled in your app.