import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { setName, clearBoard, changeIsPlaying } from '../redux/reducers/game'
import ModeDropdown from './mode-dropdown'

const GameConfig = (props) => {
  const { className } = props
  const mode = useSelector((s) => s.game.currentMode)
  const name = useSelector((s) => s.game.name)
  const winner = useSelector((s) => s.game.winner)
  const isPlaying = useSelector((s) => s.game.isPlaying)
  const dispatch = useDispatch()
  return (
    <div className={classNames(className, 'flex flex-col sm:block')}>
      <ModeDropdown className="flex-auto" />
      <input
        placeholder="Enter your name"
        className="w-48 shadow appearance-none border rounded py-2 px-3 m-2 text-gray-700 focus:outline-none focus:border-blue-300 order-first sm:order-none"
        value={name}
        onChange={(e) => {
          dispatch(setName(e.target?.value))
        }}
      />
      <button
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 m-2 rounded border-solid border focus:outline-none focus:border-blue-300"
        onClick={() => {
          if (winner) dispatch(clearBoard())
          if (name && !(Object.keys(mode).length === 0 && mode.constructor === Object)) {
            if (isPlaying) {
              dispatch(changeIsPlaying())
              dispatch(clearBoard())
              dispatch(changeIsPlaying())
            } else dispatch(changeIsPlaying())
          }
        }}
      >
        {winner ? 'Play again' : 'Play'}
      </button>
    </div>
  )
}

GameConfig.propTypes = {
  className: PropTypes.string
}

GameConfig.defaultProps = {
  className: ''
}

export default GameConfig
