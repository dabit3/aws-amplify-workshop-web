# Building Web Applications with AWS Amplify

In this workshop we'll learn how to build cloud-enabled web applications with React & AWS Amplify.

![](https://imgur.com/IPnnJyf.jpg)

### Topics we'll be covering:

- Authentication
- Analytics
- GraphQL API with AWS AppSync
- REST API with a Lambda Function
- Adding Storage with Amazon S3

## Getting Started

To get started, we first need to create a new React project & change into the new directory using the [Create React App CLI](https://github.com/facebook/create-react-app).

If you already have this installed, skip to the next step. If not, either install the CLI & create a new app:

```bash
npm install -g create-react-app
create-react-app my-amplify-app
```

Or use npx (npm 5.2 & later) to create a new app:

```bash
npx create-react-app my-amplify-app
```

Now change into the new app directory & install the AWS Amplify & AWS Amplify React libraries:

```bash
cd my-amplify-app
npm install --save aws-amplify aws-amplify-react
# or
yarn add aws-amplify aws-amplify-react
```

## Initializing a new AWS Amplify Project

Next, we'll install the AWS Amplify CLI:

```bash
npm install -g @aws-amplify/cli
```

Now we'll create a new amplify project:

```bash
amplify init
```

> Next, we'll walk through the `amplify init` setup, but if you'd like to see a video walkthrough of this setup, click [here](https://www.youtube.com/watch?v=xHDDkv0LjUY).

- Please enter a name for the project __amplifyapp__   
- Choose your default editor: __Visual Studio Code # or your default editor__   
- Please choose the type of app that you're building __javascript__   
- What javascript framework are you using __react__   
- Source Directory Path: __src__    \
- Distribution Directory Path: __build__   
- Build Command: __npm run-script build__   
- Start Command: __npm run-script start__   
- Setup new user __Y__

> Next, sign in to your your AWS account, then return to the command line & click Enter 

- Please specify the aws region: __us-east-1 #or eu-central-1__   
- user name: __amplify-cli-user__   
> In the AWS Console, click __Next: Permissions__, __Next: Review__, & __Create User__ to create the new IAM user. Then, return to the command line & press Enter.   

- accessKeyId: __YOURIDHERE__   
- secretAccessKey: __YOURSECRETACCESSKEYHERE__   
- Assign a profile name for this user: __N__   
- Do you want to setup project specific configuration __N__   

Now, the AWS Amplify CLI has iniatilized a new project & you will see a couple of new files & folders: __amplify__ & __.amplifyrc__. These files hold your project configuration.


## Adding Authentication

To add authentication, we can use the following command:

```sh
amplify add auth
```

> When prompted for __Do you want to use default authentication and security configuration?__, choose __Yes__

Now, we'll run the push command and the cloud resources will be created in our AWS account.

```bash
amplify push
```

#### Configuring the React applicaion

Now, our resources are created & we can start using them!

The first thing we need to do is to configure our React application to be aware of our new AWS Amplify project. We can do this by referencing the auto-generated `aws-exports.js` file that is now in our src folder.

To configure the app, open __index.js__ and add the following code below the last import:

```js
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

Now, our app is ready to start using our AWS services.

#### Using the withAuthenticator component

To add authentication, we'll go into our App.js file file and first import the `withAuthenticator` HOC (Higher Order Component) from `aws-amplify-react`:

```js
import { withAuthenticator } from 'aws-amplify-react'
```

Next, we'll wrap our default export (the App component) with the `withAuthenticator` HOC:

```js
export default withAuthenticator(App)
```

Now, we can run the app and see that an Authentication flow has been added in front of our App component. This flow gives users the ability to sign up & sign in.

#### Custom authentication strategies

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


## Adding Analytics

To add analytics, we can use the following command:

```sh
amplify add analytics
```

> Next, we'll be prompted for the following:

? Provide your pinpoint resource name: __amplifyanalytics__   
? Apps need authorization to send analytics events. Do you want to allow guest/unauthenticated users to send analytics events (recommended when getting started)? __Y__   
? overwrite YOURFILEPATH-cloudformation-template.yml __Y__

#### Recording events

Now that the service has been created we can now begin recording events.

To record analytics events, we need to import the `Analytics` class from Amplify & then call `Analytics.record`:

```js
import { Analytics } from 'aws-amplify'

recordEvent = () => {
  Analytics.record({
    name: 'My test event',
    attributes: {
      username: 'naderdabit'
    }
  })
}
```

## Adding a REST API

To add a REST API, we can use the following command:

```sh
amplify add api
```

> Answer the following questions

- Please select from one of the above mentioned services __REST__   
- Please provide a friendly name for your resource that will be used to label this category in the project: __amplifyrestapi__   
- Please provide a path, e.g. /items __/pets__   
- Please select lambda source __Create a new Lambda function__   
- Please provide a friendly name for your resource that will be used to label this category in the project: __amplifyrestapilambda__   
- Please provide the Lambda function name: __amplifyrestapilambda__   
- Please select the function template you want to use: __Serverless express function (Integration with Amazon API Gateway)__   
- Do you want to edit the local lambda function now? __Y__   

> Update `app.get('/pets') with the following:
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

? Do you want to add another path? (y/N) __N__   
? Which kind of privacy your API should have? __Authenticated and Guest users (AWS_IAM with Cognito Identity)__   
? overwrite YOURFILEPATH-cloudformation-template.yml __Y__  

> Now the resources have been created & configured & we can push them to our account: 

```bash
amplify push
```

#### Interacting with the new API

Now that the API is created we can start sending requests to it & interacting with it.

Let's request some data from the API:

```js
import { API } from 'aws-amplify'

getData = async() => {
  try {
    const data = await API.get('amplifyrestapi', '/pets')
    console.log('data:', data)
  } catch (err) {
    console.log('error fetching data..', err)
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
- Do you have an annotated GraphQL schema? __No__   
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

#### Interacting with the GraphQL API - Performing mutations

Now that the GraphQL API is created we can begin interacting with it!

The first thing we would like to do is add items to our database. The way we do this in GraphQL is with mutations.

To create a GraphQL mutation, we'll need to do two things:   
1. Define the mutation
2. Execute the mutation   

Let's look at how we can do this in our React application:


```js
// import graphqlOperation & API from AWS Amplify
import { graphqlOperation, API } from 'aws-amplify'

// define the mutation
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

// execute the mutation
state = {
  name: '', description: ''
}
createPet = async() => {
  const { name, description } = this.state
  const pet = { name, descripton }
  try {
    await API.graphql(graphqlOperation(CreatePet, pet))
    console.log('item created!')
  } catch (err) {
    console.log('error creating pet...', err)
  }
}
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

#### Interacting with the GraphQL API - Querying for data



## Working with Storage

To add storage, we can use the following command:

```sh
amplify add storage
```

> Answer the following questions   

- Please select from one of the below mentioned services __Content (Images, audio, video, etc.)__
- Please provide a friendly name for your resource that will be used to label this category in the
 project: __YOURBUCKETNAME__
- Please provide bucket name: amplifywebworkshops3test
- Who should have access: Auth users only
- What kind of access do you want for Authenticated users read/write   

Now, storage is configured & ready to use.

What we've done above is created configured an Amazon S3 bucket that we can now start using for storing items.

For example, if we wanted to test it out we could store some text in a file like this:

```js
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
```

This would create a folder called `javascript` in our S3 bucket & store a file called __MyReactComponent.js__ there with the code we specified in the second argument of `Storage.put`.

If we wanted to read everything from this folder, we could use this function:

```js
readFromStorage = () => {
  Storage.get('javascript/')
    .then(data => console.log('data from S3: ', data)
    .catch(err => console.log('error'))
}
```

If we only wanted to read the single file, we could use this function:

```js
readFromStorage = () => {
  Storage.get('javascript/MyReactComponent.js')
    .then(data => console.log('data from S3: ', data)
    .catch(err => console.log('error'))
}
```

If we wanted to pull down everything, we could use this function:

```js
readFromStorage = () => {
  Storage.get('')
    .then(data => console.log('data from S3: ', data)
    .catch(err => console.log('error'))
}
```

