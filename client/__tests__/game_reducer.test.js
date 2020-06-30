import * as types from '../redux/reducers/action-types'
import reducer, { initialState } from '../redux/reducers/game'
import state from './test-data'

describe('game reducer', () => {
  it('should set initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should set name', () => {
    const name = 'test'
    expect(reducer(undefined, { type: types.SET_NAME, name })).toEqual({ ...initialState, name })
  })

  it('should inc playerScore', () => {
    expect(reducer(undefined, { type: types.INC_PLAYER_SCORE })).toEqual({
      ...initialState,
      playerScore: initialState.playerScore + 1
    })
  })

  it('should inc computerScore', () => {
    expect(reducer(undefined, { type: types.INC_COMPUTER_SCORE })).toEqual({
      ...initialState,
      computerScore: initialState.computerScore + 1
    })
  })

  it('should set currentMode', () => {
    const mode = Object.keys(state.game.allModes)[0]
    expect(
      reducer(state.game, {
        type: types.SET_CURRENT_MODE,
        mode
      })
    ).toEqual({
      ...state.game,
      tiles: expect.any(Array),
      currentMode: { name: mode, ...state.game.allModes[mode] }
    })

    expect(
      reducer(state.game, {
        type: types.SET_CURRENT_MODE,
        mode
      }).tiles
    ).toHaveLength(state.game.allModes[mode].field ** 2)
  })

  it('should fetch modes', () => {
    const modes = { hard: {} }
    const allModes = { easy: {} }
    expect(
      reducer(undefined, {
        type: types.FETCH_MODES,
        modes,
        allModes
      })
    ).toEqual({
      ...initialState,
      modes,
      allModes
    })
  })

  it('should clear', () => {
    expect(
      reducer(undefined, {
        type: types.CLEAR
      })
    ).toEqual({
      ...initialState
    })
  })

  it('should fetch winners', () => {
    const winners = []
    expect(
      reducer(undefined, {
        type: types.FETCH_WINNERS,
        winners
      })
    ).toEqual({
      ...initialState,
      winners
    })
  })

  it('should set winner', () => {
    const winner = 'test'
    expect(
      reducer(undefined, {
        type: types.SET_WINNER,
        winner
      })
    ).toEqual({
      ...initialState,
      winner
    })
  })

  it('should update tile state', () => {
    const { id } = state.game.tiles[0]
    const newState = 'test'
    const updatedTiles = [...state.game.tiles]
    updatedTiles[0].state = newState
    expect(
      reducer(state.game, {
        type: types.UPDATE_TILE_STATE,
        id,
        state: newState
      })
    ).toEqual({
      ...state.game,
      tiles: updatedTiles
    })
  })

  it('should set timeoutId', () => {
    const timeoutId = 50
    expect(
      reducer(undefined, {
        type: types.SET_TIMEOUT_ID,
        timeoutId
      })
    ).toEqual({
      ...initialState,
      timeoutId
    })
  })

  it('should set selected', () => {
    const selected = 'test'
    expect(
      reducer(undefined, {
        type: types.SET_SELECTED,
        selected
      })
    ).toEqual({
      ...initialState,
      selected
    })
  })

  it('should change isPlaying', () => {
    expect(
      reducer(undefined, {
        type: types.CHANGE_IS_PLAYING
      })
    ).toEqual({
      ...initialState,
      isPlaying: !initialState.isPlaying
    })

    expect(
      reducer(
        { ...initialState, isPlaying: !state.isPlaying },
        {
          type: types.CHANGE_IS_PLAYING
        }
      )
    ).toEqual({
      ...initialState,
      isPlaying: initialState.isPlaying
    })
  })

  it('should filter modes', () => {
    const modes = { easy: {} }
    expect(
      reducer(undefined, {
        type: types.FILTER_MODES,
        modes
      })
    ).toEqual({
      ...initialState,
      modes
    })
  })
})
