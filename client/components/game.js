import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo, faHome } from '@fortawesome/free-solid-svg-icons'
import { history } from '../redux'
import {
  tileColorStates,
  setTileState,
  setTimeoutId,
  clearBoard,
  COMPUTER
} from '../redux/reducers/game'
import Leaderboard from './leaderboard'
import GameConfig from './game-config'

const Game = () => {
  const mode = useSelector((s) => s.game.currentMode)
  const tiles = useSelector((s) => s.game.tiles)
  const selected = useSelector((s) => s.game.selected)
  const isPlaying = useSelector((s) => s.game.isPlaying)
  const playerScore = useSelector((s) => s.game.playerScore)
  const computerScore = useSelector((s) => s.game.computerScore)
  const winner = useSelector((s) => s.game.winner)
  const { field, delay } = mode
  const dispatch = useDispatch()

  useEffect(() => {
    function nextRound(id) {
      const tid = setTimeout(() => {
        dispatch(setTileState(id, tileColorStates.missed))
      }, delay)
      dispatch(setTimeoutId(tid))
    }
    if (isPlaying) {
      dispatch(setTileState(selected, tileColorStates.selected))
      nextRound(selected)
    }
  }, [delay, dispatch, isPlaying, selected])

  return (
    <div
      className={`flex justify-center content-start flex-auto flex-wrap py-8 px-4 ${
        winner && winner === COMPUTER ? 'bg-red-300' : ''
      } ${winner && winner !== COMPUTER ? 'bg-green-300' : ''}`}
    >
      <div className="flex flex-col items-center px-4">
        <GameConfig />
        <div
          className={`${winner ? 'block' : 'hidden'} ${
            winner === COMPUTER ? 'bg-red-500' : 'bg-green-500'
          } p-2 rounded m-2`}
        >
          {`${winner} won!`}
        </div>
        <div className="flex">
          <div className="m-2 text-gray-600 font-bold">You: {playerScore}</div>
          <div className="m-2 text-gray-600 font-bold">Computer: {computerScore}</div>
        </div>
        <div>
          <div
            className="flex flex-wrap border-solid border-2 border-gray-300 box-content m-2 "
            style={{ width: `${(field || 0) * 2}rem` }}
          >
            {tiles.map((tile) => {
              let color
              if (tile.state === tileColorStates.free) color = 'bg-gray-200'
              if (tile.state === tileColorStates.selected) color = 'bg-blue-300'
              if (tile.state === tileColorStates.clicked) color = 'bg-green-300'
              if (tile.state === tileColorStates.missed) color = 'bg-red-300'
              return (
                <button
                  type="button"
                  key={tile.id}
                  aria-label="click"
                  className={`${color} flex-auto h-8 w-8 border-solid border-2 border-gray-300 focus:outline-none`}
                  onClick={() => {
                    dispatch(setTileState(tile.id, tileColorStates.clicked))
                  }}
                />
              )
            })}
          </div>
          <div className="flex justify-between flex-auto">
            <button
              type="button"
              className="px-2 py-1 m-2 bg-green-500 rounded hover:bg-green-600 focus:outline-none border-solid border focus:border-green-900"
              onClick={() => {
                history.push('/')
              }}
            >
              <FontAwesomeIcon icon={faHome} className="text-white" />
            </button>
            <button
              type="button"
              className="px-2 py-1 m-2 bg-green-500 rounded hover:bg-green-600 focus:outline-none border-solid border focus:border-green-900"
              onClick={() => {
                dispatch(clearBoard())
              }}
            >
              <FontAwesomeIcon icon={faRedo} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <Leaderboard className="min-w-1/4 px-4" />
    </div>
  )
}

Game.propTypes = {}

export default Game
