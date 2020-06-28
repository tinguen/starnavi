import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { setCurrentMode } from '../redux/reducers/game'

const ModeDropdown = (props) => {
  const { className } = props
  const [isOpen, setIsOpen] = useState(false)
  const currentMode = useSelector((s) => s.game.currentMode)
  const modes = useSelector((s) => s.game.modes)
  const dispatch = useDispatch()
  const modeNames = {
    easyMode: 'Easy',
    normalMode: 'Normal',
    hardMode: 'Hard'
  }
  return (
    <div className={classNames('relative inline-block text-left p-2', className)}>
      <div>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            id="options-menu"
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            aria-haspopup="true"
            aria-expanded="true"
          >
            {currentMode.name ? modeNames[currentMode.name] || currentMode.name : 'Pick game mode'}
            <svg className="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      <div
        className={`origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg ${
          isOpen ? 'inline-block' : 'hidden'
        }`}
      >
        <div className="rounded-md bg-white shadow-xs">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {Object.keys(modes).map((mode) => {
              return (
                <button
                  key={mode}
                  type="button"
                  className="block w-full px-2 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                  onClick={() => {
                    dispatch(setCurrentMode(mode))
                    setIsOpen(false)
                  }}
                >
                  {mode in modeNames ? modeNames[mode] : mode}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

ModeDropdown.propTypes = {
  className: PropTypes.string
}

ModeDropdown.defaultProps = {
  className: ''
}

export default ModeDropdown
