import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchModes,
  fetchWinners,
  clearBoard,
  setCurrentMode,
  addToModes,
  removeFromModes
} from '../redux/reducers/game'

const Startup = (props) => {
  const dispatch = useDispatch()
  const allModes = useSelector((s) => s.game.allModes)
  useEffect(() => {
    dispatch(fetchModes())
    dispatch(fetchWinners())
  }, [dispatch])

  useEffect(() => {
    const ms = Object.entries(allModes)
    if (ms.length) {
      const cleanupFuncs = ms.map((mode) => {
        const handleListener = (e) => {
          if (!e.matches) {
            dispatch(removeFromModes(mode[0]))
            dispatch(clearBoard())
            dispatch(setCurrentMode(Object.keys(allModes)[0]))
          } else dispatch(addToModes(mode[0], mode[1]))
        }
        const mql = window.matchMedia(`(min-width: ${mode[1].field * 2 + 5}rem)`)
        mql.addListener(handleListener)
        return () => mql.removeListener(handleListener)
      })
      return () => {
        cleanupFuncs.forEach((func) => func())
      }
    }
    return () => {}
  }, [dispatch, allModes])

  useEffect(() => {
    const ms = Object.entries(allModes)
    ms.forEach((mode) => {
      const mql = window.matchMedia(`(min-width: ${mode[1].field * 2 + 5}rem)`)
      if (!mql.matches) {
        dispatch(removeFromModes(mode[0], mode[1]))
        dispatch(clearBoard())
        dispatch(setCurrentMode(Object.keys(allModes)[0]))
      }
    })
    return () => {}
  }, [dispatch, allModes])

  return props.children
}

Startup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export default Startup
