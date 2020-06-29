import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Head from './head'
import Game from './game'
import Leaderboard from './leaderboard'
import DummyView from './dummy-view'
import Start from './start'

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
