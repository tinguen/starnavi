import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { setName, clearBoard } from '../redux/reducers/game'
import ModeDropdown from './mode-dropdown'
import { history } from '../redux'

const Start = (props) => {
  const { className } = props
  const mode = useSelector((s) => s.game.currentMode)
  const name = useSelector((s) => s.game.name)
  const dispatch = useDispatch()
  return (
    <div className={classNames('flex justify-center items-center', className)}>
      <div className="shape flex-auto">
        <div className="shape-l-big" />
        <div className="shape-l-med" />
        <div className="shape-l-small" />
        <div className="shape-l-tiny flex flex-col">
          <ModeDropdown />
          <input
            placeholder="Enter your name"
            className="w-48 shadow appearance-none border rounded py-2 px-3 m-2 text-gray-700 focus:outline-none focus:border-blue-300"
            value={name}
            onChange={(e) => {
              dispatch(setName(e.target?.value))
            }}
          />
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 m-2 rounded focus:outline-none focus:border-blue-300"
            onClick={() => {
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
