import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { setName, clearBoard, changeIsPlaying } from '../redux/reducers/game'
import ModeDropdown from './mode-dropdown'

const GameConfig = (props) => {
  const { className } = props
  const [nameErr, setNameErr] = useState(false)
  const [dropdownErr, setDropdownErr] = useState(false)
  const mode = useSelector((s) => s.game.currentMode)
  const name = useSelector((s) => s.game.name)
  const winner = useSelector((s) => s.game.winner)
  const isPlaying = useSelector((s) => s.game.isPlaying)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!(Object.keys(mode).length === 0 && mode.constructor === Object)) setDropdownErr(false)
  }, [mode])

  return (
    <div
      className={classNames(
        className,
        'flex flex-col content-start sm:flex sm:flex-row sm:items-start'
      )}
    >
      <div className="flex-auto inline-block">
        <ModeDropdown className="flex-auto" />
        <p className={`text-red-500 ml-2 text-xs italic ${dropdownErr ? 'block' : 'hidden'}`}>
          Please choose game mode!
        </p>
      </div>
      <div className="inline-block">
        <input
          placeholder="Enter your name"
          className="w-48 shadow appearance-none border rounded py-2 px-3 m-2 text-gray-700 focus:outline-none focus:border-blue-300 order-first sm:order-none"
          value={name}
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              if (e.target.value) setNameErr(false)
              dispatch(setName(e.target.value))
            } else {
              setNameErr(true)
            }
          }}
        />
        <p className={`text-red-500 ml-2 text-xs italic ${nameErr ? 'block' : 'hidden'}`}>
          Please enter your name
        </p>
        <p className={`text-red-500 ml-2 text-xs italic ${nameErr ? 'block' : 'hidden'}`}>
          (less than 10 characters)
        </p>
      </div>
      <button
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 m-2 rounded border-solid border focus:outline-none focus:border-blue-300"
        onClick={() => {
          if (!name) setNameErr(true)
          if (Object.keys(mode).length === 0 && mode.constructor === Object) setDropdownErr(true)
          else if (winner) dispatch(clearBoard())
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
