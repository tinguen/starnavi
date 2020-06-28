import axios from 'axios'
import shortid from 'shortid'

// const SERVER_URL = 'starnav-frontend-test-task.herokuapp.com'
export const COMPUTER = 'Computer'
const SERVER_URL = window.location.origin

const SET_NAME = 'SET_NAME'
const INC_PLAYER_SCORE = 'INC_PLAYER_SCORE'
const INC_COMPUTER_SCORE = 'INC_COMPUTER_SCORE'
const SET_CURRENT_MODE = 'SET_CURRENT_MODE'
const FETCH_MODES = 'FETCH_MODES'
const FETCH_WINNERS = 'FETCH_WINNERS'
const SET_WINNER = 'SET_WINNER'
const CLEAR = 'CLEAR'
const UPDATE_TILE_STATE = 'UPDATE_TILE_STATE'
const SET_TIMEOUT_ID = 'SET_TIMEOUT_ID'
const SET_SELECTED = 'SET_SELECTED'
const CHANGE_IS_PLAYING = 'CHANGE_IS_PLAYING'
const FETCH_STATE = 'FETCH_STATE'
const FILTER_MODES = 'FILTER_MODES'

function postWinner(winner) {
  return axios
    .post(`${SERVER_URL}/api/v1/winners`, { winner, date: new Date().toString() })
    .catch(() => {})
}

export const tileColorStates = {
  free: 0,
  selected: 1,
  clicked: 2,
  missed: 3
}

function getRandomTileId(tiles) {
  const items = tiles.filter((it) => it.state === tileColorStates.free)
  return items[Math.floor(Math.random() * items.length)].id
}

const initialState = {
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
    case SET_NAME: {
      return { ...state, name: action.name }
    }
    case INC_COMPUTER_SCORE: {
      return { ...state, computerScore: state.computerScore + 1 }
    }
    case INC_PLAYER_SCORE: {
      return { ...state, playerScore: state.playerScore + 1 }
    }
    case SET_CURRENT_MODE: {
      return {
        ...state,
        currentMode: { name: action.mode, ...state.modes[action.mode] },
        tiles: Array.from(Array(state.allModes[action.mode].field ** 2), () => ({
          id: shortid.generate(),
          state: tileColorStates.free
        }))
      }
    }
    case FETCH_MODES: {
      return { ...state, modes: action.modes, allModes: action.allModes || action.modes }
    }
    case CLEAR: {
      return { ...initialState }
    }
    case FETCH_WINNERS: {
      return { ...state, winners: action.winners }
    }
    case SET_WINNER: {
      return { ...state, winner: action.winner }
    }
    case UPDATE_TILE_STATE: {
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
    case SET_TIMEOUT_ID: {
      return { ...state, timeoutId: action.timeoutId }
    }
    case SET_SELECTED: {
      return { ...state, selected: action.selected }
    }
    case CHANGE_IS_PLAYING: {
      return { ...state, isPlaying: !state.isPlaying }
    }
    case FETCH_STATE: {
      return {
        ...state,
        name: action.name,
        currentMode: action.mode,
        tiles: Array.from(Array(action.mode.field ** 2), () => ({
          id: shortid.generate(),
          state: tileColorStates.free
        }))
      }
    }
    case FILTER_MODES: {
      return { ...state, modes: action.modes }
    }
    default:
      return state
  }
}

export function fetchModes() {
  return async (dispatch) => {
    return axios
      .get(`${SERVER_URL}/api/v1/game-settings`)
      .then(({ data: modes }) => dispatch({ type: 'FETCH_MODES', modes }))
  }
}

export function fetchWinners() {
  return async (dispatch) => {
    return axios
      .get(`${SERVER_URL}/api/v1/winners`)
      .then(({ data: winners }) => dispatch({ type: 'FETCH_WINNERS', winners }))
  }
}

export function clear() {
  return { type: CLEAR }
}

export function setTimeoutId(timeoutId) {
  return { type: SET_TIMEOUT_ID, timeoutId }
}

export function setWinner(winner) {
  if (!(typeof winner === 'string')) return { type: '' }
  return { type: SET_WINNER, winner }
}

export function setName(name) {
  if (!(typeof name === 'string')) return { type: '' }
  return { type: SET_NAME, name }
}

export function setSelected(selected) {
  return { type: SET_SELECTED, selected }
}

export function changeIsPlaying() {
  return (dispatch, getState) => {
    const { isPlaying } = getState().game
    const { tiles } = getState().game
    if (!isPlaying) dispatch(setSelected(getRandomTileId(tiles)))
    return dispatch({ type: CHANGE_IS_PLAYING })
  }
}

export function incPlayerScore() {
  return (dispatch, getState) => {
    const { field } = getState().game.currentMode
    const score = getState().game.playerScore
    if (score + 1 >= Math.ceil(field ** 2 / 2)) {
      const { name } = getState().game
      dispatch({ type: INC_PLAYER_SCORE })
      dispatch(setWinner(name))
      dispatch(changeIsPlaying())
      return postWinner(name).then(() => {
        return dispatch(fetchWinners())
      })
    }
    return dispatch({ type: INC_PLAYER_SCORE })
  }
}

export function incComputerScore() {
  return (dispatch, getState) => {
    const { field } = getState().game.currentMode
    const score = getState().game.computerScore
    if (score + 1 >= Math.ceil(field ** 2 / 2)) {
      dispatch({ type: INC_COMPUTER_SCORE })
      dispatch(setWinner(COMPUTER))
      dispatch(changeIsPlaying())
      return postWinner(COMPUTER).then(() => {
        return dispatch(fetchWinners())
      })
    }
    return dispatch({ type: INC_COMPUTER_SCORE })
  }
}

export function clearBoard() {
  return (dispatch, getState) => {
    const { modes, winners, name, currentMode, timeoutId, allModes } = getState().game
    clearTimeout(timeoutId)
    dispatch(clear())
    dispatch({ type: FETCH_MODES, modes, allModes })
    dispatch({ type: FETCH_WINNERS, winners })
    if (currentMode.name) dispatch({ type: SET_CURRENT_MODE, mode: currentMode.name })
    dispatch({ type: SET_NAME, name })
  }
}

export function setCurrentMode(mode) {
  return (dispatch, getState) => {
    const { modes } = getState().game
    if (!(mode in modes)) return dispatch({ type: '' })
    dispatch(clearBoard())
    return dispatch({ type: SET_CURRENT_MODE, mode })
  }
}

export function setTileState(id, newState) {
  return (dispatch, getState) => {
    const { state } = getState().game.tiles.filter((it) => it.id === id)[0]
    switch (state) {
      case tileColorStates.free: {
        if (newState === tileColorStates.selected)
          return dispatch({ type: UPDATE_TILE_STATE, id, state: newState })
        break
      }
      case tileColorStates.selected: {
        if (newState === tileColorStates.clicked || newState === tileColorStates.missed) {
          if (newState === tileColorStates.clicked) dispatch(incPlayerScore())
          else dispatch(incComputerScore())

          const { timeoutId } = getState().game
          clearTimeout(timeoutId)
          dispatch(setTimeoutId(null))

          const { tiles } = getState().game
          const { isPlaying } = getState().game
          const { winner } = getState().game
          if (isPlaying && !winner) dispatch(setSelected(getRandomTileId(tiles)))
          return dispatch({ type: UPDATE_TILE_STATE, id, state: newState })
        }
        break
      }
      default:
        return dispatch({ type: '' })
    }
    return dispatch({ type: '' })
  }
}

export function fetchState() {
  return (dispatch, getState) => {
    const name = localStorage.getItem('name')
    const modeName = localStorage.getItem('modeName')
    if (!name && typeof name !== 'string') {
      return { type: '' }
    }
    if (!modeName && typeof modeName !== 'string') {
      return { type: '' }
    }
    const { modes } = getState().game
    if (modeName in Object.keys(modes)) {
      dispatch({ type: SET_CURRENT_MODE, mode: modeName })
    }
    return dispatch({ type: SET_NAME, name })
  }
}

export function addToModes(name, mode) {
  return (dispatch, getState) => {
    const modes = { ...getState().game.modes }
    modes[name] = mode
    return dispatch({ type: FILTER_MODES, modes })
  }
}

export function removeFromModes(name) {
  return (dispatch, getState) => {
    const modes = { ...getState().game.modes }
    delete modes[name]
    return dispatch({ type: FILTER_MODES, modes })
  }
}
