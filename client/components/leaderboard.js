import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Leaderboard = (props) => {
  const { className } = props
  const winners = useSelector((s) => s.game.winners)
  return (
    <div className={classNames(className)}>
      <h1 className="p-4 text-gray-500 font-bold">Leaderboard</h1>
      {winners.map((winner) => {
        return (
          <div
            key={winner.winner + winner.date}
            className="px-4 py-2 my-px w-48 flex justify-between rounded bg-gray-300 hover:bg-gray-400"
          >
            <span className="text-left">{winner.winner}</span>
            <span className="text-right">
              {new Date(winner.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )
      })}
    </div>
  )
}

Leaderboard.propTypes = {
  className: PropTypes.string
}

Leaderboard.defaultProps = {
  className: ''
}

export default Leaderboard
