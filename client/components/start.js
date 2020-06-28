import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { setName, clearBoard } from '../redux/reducers/game'
import ModeDropdown from './mode-dropdown'
import { history } from '../redux'

const Start = (props) => {
  const { className } = props
  const [nameErr, setNameErr] = useState(false)
  const [dropdownErr, setDropdownErr] = useState(false)
  const mode = useSelector((s) => s.game.currentMode)
  const name = useSelector((s) => s.game.name)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!(Object.keys(mode).length === 0 && mode.constructor === Object)) setDropdownErr(false)
  }, [mode])

  return (
    <div className={classNames('flex justify-center items-center flex-auto', className)}>
      <div className="shape">
        <div className="shape-l-big" />
        <div className="shape-l-med" />
        <div className="shape-l-small" />
        <div className="shape-l-tiny flex flex-col">
          <ModeDropdown />
          <p className={`text-red-500 text-xs italic ${dropdownErr ? 'block' : 'hidden'}`}>
            Please choose game mode!
          </p>
          <input
            placeholder="Enter your name"
            className={`w-48 shadow appearance-none border rounded py-2 px-3 m-2 text-gray-700 focus:outline-none ${
              nameErr ? 'focut:border-red-500 border-red-500' : 'focus:border-blue-300'
            }`}
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
          <p className={`text-red-500 text-xs italic ${nameErr ? 'block' : 'hidden'}`}>
            Please enter your name
          </p>
          <p className={`text-red-500 text-xs italic ${nameErr ? 'block' : 'hidden'}`}>
            (less than 10 characters)!
          </p>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 m-2 rounded focus:outline-none focus:border-blue-300"
            onClick={() => {
              if (!name) setNameErr(true)
              if (Object.keys(mode).length === 0 && mode.constructor === Object)
                setDropdownErr(true)
              if (name && !(Object.keys(mode).length === 0 && mode.constructor === Object)) {
                dispatch(clearBoard())
                history.push('/game')
              }
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}

Start.propTypes = {
  className: PropTypes.string
}

Start.defaultProps = {
  className: ''
}

export default Start
