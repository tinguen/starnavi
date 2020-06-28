import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Head from './head'
import Game from './game'
import Leaderboard from './leaderboard'
import DummyView from './dummy-view'
import Start from './start'

// const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
//   const func = (props) =>
//     !!rest.user && !!rest.user.name && !!rest.token ? (
//       <Redirect to={{ pathname: '/' }} />
//     ) : (
//       <Component {...props} />
//     )
//   return <Route {...rest} render={func} />
// }

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const func = (props) =>
//     !!rest.user && !!rest.user.name && !!rest.token ? (
//       <Component {...props} />
//     ) : (
//       <Redirect
//         to={{
//           pathname: '/login'
//         }}
//       />
//     )
//   return <Route {...rest} render={func} />
// }

// const types = {
//   component: PropTypes.func.isRequired,
//   location: PropTypes.shape({
//     pathname: PropTypes.string
//   }),
//   user: PropTypes.shape({
//     name: PropTypes.string,
//     email: PropTypes.string
//   }),
//   token: PropTypes.string
// }

// const defaults = {
//   location: {
//     pathname: ''
//   },
//   user: null,
//   token: ''
// }

// OnlyAnonymousRoute.propTypes = types
// PrivateRoute.propTypes = types

// PrivateRoute.defaultProps = defaults
// OnlyAnonymousRoute.defaultProps = defaults

const Home = () => {
  return (
    <div className="flex flex-column justify-center min-h-screen">
      <Head title="Game" />
      <Switch>
        <Route exact path="/">
          <Start />
        </Route>
        <Route exact path="/game">
          <Game />
        </Route>
        <Route exact path="/leaderboard">
          <Leaderboard />
        </Route>
        <Route exact path="/*">
          <DummyView />
        </Route>
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
