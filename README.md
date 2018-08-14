# Building Web Applications with AWS Amplify

In this workshop we'll learn how to build cloud-enabled web applications with React & AWS Amplify.

### Topics we'll be covering:

- Authentication
- Analytics
- GraphQL with AWS AppSync
- Lambda Functions

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

Next, we'll install the AWS Amplify CLI:

```bash
npm i -g amplify-cli
```

Now we'll create a new amplify project:

```bash
amplify init
```

> Next, we'll walk through the `amplify init` setup, but if you'd like to see a video walkthrough of this setup, click [here](https://www.youtube.com/watch?v=xHDDkv0LjUY).

? Please enter a name for the project __amplifyapp__   
? Choose your default editor: __Visual Studio Code # or your default editor__   
? Please choose the type of app that you're building __javascript__   
? What javascript framework are you using __react__   
? Source Directory Path: __src__    \
? Distribution Directory Path: __build__   
? Build Command: __npm run-script build__   
? Start Command: __npm run-script start__   
? Setup new user __Y__
> Next, sign in to your your AWS account, then return to the command line & click Enter   
? Please specify the aws region: __us-east-1 #or eu-central-1__   
? user name: __amplify-cli-user__   
> In the AWS Console, click __Next: Permissions__, __Next: Review__, & __Create User__ to create the new IAM user. Then, return to the command line & press Enter.   
? accessKeyId: __<YourAccessKeyId>__   
? secretAccessKey: __<YourSecretAccessKey>__   
? Assign a profile name for this user: __N__   
? Do you want to setup project specific configuration __N__   



## Adding Authentication

## Adding Analytics

## Adding an API

## Adding GraphQL

## Working with Storage


