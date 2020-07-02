import axios from 'axios'
import shortid from 'shortid'
import * as actionTypes from './action-types'

// const SERVER_URL = 'starnav-frontend-test-task.herokuapp.com'
export const COMPUTER = 'Computer'
export const SERVER_URL = 'https://starnavi-frontend-test-task.herokuapp.com'

export const tileColorStates = {
  free: 0,
  selected: 1,
  clicked: 2,
  missed: 3
}

function postWinner(winner) {
  const date = new Date()
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date)
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  const time = new Intl.DateTimeFormat('ru', { hour: 'numeric', minute: 'numeric' }).format(date)
  return axios
    .post(`${SERVER_URL}/winners`, { winner, date: `${time}; ${day} ${month} ${year}` })
    .catch(() => {})
}

function getRandomTileId(tiles) {
  const items = tiles.filter((it) => it.state === tileColorStates.free)
  return items[Math.floor(Math.random() * items.length)].id
}

export const initialState = {
  tiles: [],
  currentMode: {},
  name: '',
  playerScore: 0,
  computerScore: 0,
  modes: {},
  allModes: {},
  winners: [],
  winner: '',
  timeoutId: null,
  selected: null,
  isPlaying: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_NAME: {
      return { ...state, name: action.name }
    }
    case actionTypes.INC_COMPUTER_SCORE: {
      return { ...state, computerScore: state.computerScore + 1 }
    }
    case actionTypes.INC_PLAYER_SCORE: {
      return { ...state, playerScore: state.playerScore + 1 }
    }
    case actionTypes.SET_CURRENT_MODE: {
      return {
        ...state,
        currentMode: { name: action.mode, ...state.modes[action.mode] },
        tiles: Array.from(Array(state.allModes[action.mode].field ** 2), () => ({
          id: shortid.generate(),
          state: tileColorStates.free
        }))
      }
    }
    case actionTypes.FETCH_MODES: {
      return { ...state, modes: action.modes, allModes: action.allModes || action.modes }
    }
    case actionTypes.CLEAR: {
      return { ...initialState }
    }
    case actionTypes.FETCH_WINNERS: {
      return { ...state, winners: action.winners }
    }
    case actionTypes.SET_WINNER: {
      return { ...state, winner: action.winner }
    }
    case actionTypes.UPDATE_TILE_STATE: {
      return {
        ...state,
        tiles: state.tiles.map((it) => {
          return {
            ...it,
            state: it.id === action.id ? action.state : it.state
          }
        })
      }
    }
    case actionTypes.SET_TIMEOUT_ID: {
      return { ...state, timeoutId: action.timeoutId }
    }
    case actionTypes.SET_SELECTED: {
      return { ...state, selected: action.selected }
    }
    case actionTypes.CHANGE_IS_PLAYING: {
      return { ...state, isPlaying: !state.isPlaying }
    }
    case actionTypes.FILTER_MODES: {
      return { ...state, modes: action.modes }
    }
    default:
      return state
  }
}

export function fetchModes() {
  return async (dispatch) => {
    return axios
      .get(`${SERVER_URL}/game-settings`)
      .then(({ data: modes }) => dispatch({ type: 'FETCH_MODES', modes }))
      .catch(() => dispatch({ type: '' }))
  }
}

export function fetchWinners() {
  return (dispatch) => {
    return axios
      .get(`${SERVER_URL}/winners`)
      .then(({ data: winners }) =>
        dispatch({
          type: 'FETCH_WINNERS',
          winners: winners.reverse().map((winner) => ({ ...winner, id: shortid.generate() }))
        })
      )
      .catch(() => dispatch({ type: '' }))
  }
}

export function clear() {
  return { type: actionTypes.CLEAR }
}

export function setTimeoutId(timeoutId) {
  return { type: actionTypes.SET_TIMEOUT_ID, timeoutId }
}

export function setWinner(winner) {
  if (typeof winner !== 'string') return { type: '' }
  return { type: actionTypes.SET_WINNER, winner }
}

export function setName(name) {
  if (!(typeof name === 'string')) return { type: '' }
  return { type: actionTypes.SET_NAME, name }
}

export function setSelected(selected) {
  return { type: actionTypes.SET_SELECTED, selected }
}

export function changeIsPlaying() {
  return (dispatch, getState) => {
    const { isPlaying, tiles } = getState().game
    if (!isPlaying) dispatch(setSelected(getRandomTileId(tiles)))
    return dispatch({ type: actionTypes.CHANGE_IS_PLAYING })
  }
}

export function incPlayerScore() {
  return (dispatch, getState) => {
    const { field } = getState().game.currentMode
    const score = getState().game.playerScore
    if (score + 1 >= Math.ceil(field ** 2 / 2)) {
      const { name } = getState().game
      dispatch({ type: actionTypes.INC_PLAYER_SCORE })
      dispatch(setWinner(name))
      dispatch(changeIsPlaying())
      return postWinner(name).then(() => {
        return dispatch(fetchWinners())
      })
    }
    return dispatch({ type: actionTypes.INC_PLAYER_SCORE })
  }
}

export function incComputerScore() {
  return (dispatch, getState) => {
    const { field } = getState().game.currentMode
    const score = getState().game.computerScore
    if (score + 1 >= Math.ceil(field ** 2 / 2)) {
      dispatch({ type: actionTypes.INC_COMPUTER_SCORE })
      dispatch(setWinner(COMPUTER))
      dispatch(changeIsPlaying())
      return postWinner(COMPUTER).then(() => {
        return dispatch(fetchWinners())
      })
    }
    return dispatch({ type: actionTypes.INC_COMPUTER_SCORE })
  }
}

export function clearBoard() {
  return (dispatch, getState) => {
    const { modes, winners, name, currentMode, timeoutId, allModes } = getState().game
    clearTimeout(timeoutId)
    dispatch(clear())
    dispatch({ type: actionTypes.FETCH_MODES, modes, allModes })
    dispatch({ type: actionTypes.FETCH_WINNERS, winners })
    if (currentMode.name) dispatch({ type: actionTypes.SET_CURRENT_MODE, mode: currentMode.name })
    dispatch({ type: actionTypes.SET_NAME, name })
  }
}

export function setCurrentMode(mode) {
  return (dispatch, getState) => {
    const { modes } = getState().game
    if (!(mode in modes)) return dispatch({ type: '' })
    dispatch(clearBoard())
    return dispatch({ type: actionTypes.SET_CURRENT_MODE, mode })
  }
}

export function setTileState(id, newState) {
  return (dispatch, getState) => {
    const { state } = getState().game.tiles.filter((it) => it.id === id)[0]
    switch (state) {
      case tileColorStates.free: {
        if (newState === tileColorStates.selected)
          return dispatch({ type: actionTypes.UPDATE_TILE_STATE, id, state: newState })
        break
      }
      case tileColorStates.selected: {
        if (newState === tileColorStates.clicked || newState === tileColorStates.missed) {
          if (newState === tileColorStates.clicked) dispatch(incPlayerScore())
          else dispatch(incComputerScore())

          const { timeoutId, tiles, isPlaying, winner } = getState().game
          clearTimeout(timeoutId)
          dispatch(setTimeoutId(null))

          if (isPlaying && !winner) dispatch(setSelected(getRandomTileId(tiles)))
          return dispatch({ type: actionTypes.UPDATE_TILE_STATE, id, state: newState })
        }
        break
      }
      default:
        return dispatch({ type: '' })
    }
    return dispatch({ type: '' })
  }
}

export function addToModes(name, mode) {
  return (dispatch, getState) => {
    const modes = { ...getState().game.modes }
    modes[name] = mode
    return dispatch({ type: actionTypes.FILTER_MODES, modes })
  }
}

export function removeFromModes(name) {
  return (dispatch, getState) => {
    const modes = { ...getState().game.modes }
    delete modes[name]
    return dispatch({ type: actionTypes.FILTER_MODES, modes })
  }
}
