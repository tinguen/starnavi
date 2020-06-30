import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Leaderboard = (props) => {
  const { className } = props
  const winners = useSelector((s) => s.game.winners)
  return (
    <div className={classNames(className)}>
      <h1 className="p-4 text-gray-500 font-bold text-center">Leaderboard</h1>
      {winners.map((winner) => {
        return (
          <div
            key={winner.winner + winner.date}
            className="px-4 py-2 my-px flex flex-grow justify-between rounded bg-gray-300 hover:bg-gray-400"
          >
            <span className="text-left mr-10">{winner.winner}</span>
            <span className="text-right">{winner.date}</span>
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
