import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { fetchModes, fetchWinners } from '../redux/reducers/game'

const Startup = (props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchModes())
    dispatch(fetchWinners())
  }, [dispatch])

  return props.children
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Startup
