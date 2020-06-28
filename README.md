# StarNavi test task

## Quick start

1. Clone this repo using:
  ```shell
  $ git clone git@github.com:tinguen/starnavi.git
  ```

2. To install dependencies and clean the git repo run:

  ```shell
  $ yarn install
  ```

  *We recommend using `yarn` for installing packages, but you can use `npm` instead*:

  ```shell
  $ npm install
  ```
3. Create first build

  ```shell
  $ yarn run build:prod
  ```
4. Define .env file from .env.example

5. Run project in Dev mode

  ```shell
  $ yarn run dev
  ```

## Project Structure

#### `client/`

You will write your app in this folder. You will spend most of your time in here.

#### `client/components`

This folder contains all your components

#### `dist/assets`
This directory contains compiled project files

#### `webpack.development.config.js` `and webpack.production.config.js`
Project environment configs. Webpack uses proper config depending on defined application environment.
By default `webpack.development.config.js` is used unless you build the application with --config webpack.production.frontend.config.js variable.


## Command Line Commands

#### Installation

```Shell
yarn install
```
Installs the dependencies.

#### Development

```Shell
yarn run dev
```

Starts the development server running on `http://localhost:8087` using the webpack.development.config.js with Hot Module Replacement (HMR) (Changes in the application code will be hot-reloaded)

```Shell
yarn run dev:server
```

Starts the development server and makes your application accessible at http://localhost:8087.

```Shell
yarn run clean
```
Removes a directory "dist" from a project

#### Building

```Shell
yarn build:prod
```

Prepares your app for deployment to production environment (using the webpack.production.config.js). Optimizes and minifies all files, piping them to the `dist` folder.

#### Linting

```Shell
yarn run lint
```
Will analyse your code for potential errors. Will check both: `./client/**/**.js` and `./server/**/**.js` files.
Code linting is a type of static analysis that is frequently used to find problematic patterns or code that doesn’t adhere to certain style guidelines.


```Shell
yarn run lint:server
```

Will analyse only  `server/**/**.js` files