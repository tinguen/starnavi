import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import * as actions from '../redux/reducers/game'
import * as types from '../redux/reducers/action-types'
import state from './test-data'

const createStore = configureMockStore([thunk])

describe('actions', () => {
  it('should create an action to clear', () => {
    const expectedAction = {
      type: types.CLEAR
    }
    expect(actions.clear()).toEqual(expectedAction)
  })

  it('should create an action to set timeout', () => {
    const expectedAction = {
      type: types.SET_TIMEOUT_ID,
      timeoutId: 50
    }
    expect(actions.setTimeoutId(50)).toEqual(expectedAction)
  })

  it('should create an action to set winner', () => {
    const winner = 'abcd'
    const expectedAction = {
      type: types.SET_WINNER,
      winner
    }
    expect(actions.setWinner(winner)).toEqual(expectedAction)
  })

  it('should not create an action to set winner', () => {
    const winner = {}
    const expectedAction = {
      type: ''
    }
    expect(actions.setWinner(winner)).toEqual(expectedAction)
  })

  it('should create an action to set name', () => {
    const name = 'abcd'
    const expectedAction = {
      type: types.SET_NAME,
      name
    }
    expect(actions.setName(name)).toEqual(expectedAction)
  })

  it('should not create an action to set name', () => {
    const name = {}
    const expectedAction = {
      type: ''
    }
    expect(actions.setName(name)).toEqual(expectedAction)
  })

  it('should create an action to set selected', () => {
    const selected = 'abcd'
    const expectedAction = {
      type: types.SET_SELECTED,
      selected
    }
    expect(actions.setSelected(selected)).toEqual(expectedAction)
  })
})

describe('async actions', () => {
  it('should create FETCH_MODES when fetching modes has been done', () => {
    const ENDPOINT = `${actions.SERVER_URL}/game-settings`
    const modes = {
      easyMode: { field: 5, delay: 2000 },
      normalMode: { field: 10, delay: 1000 },
      hardMode: { field: 15, delay: 900 }
    }

    jest.mock('axios', () => jest.fn())

    axios.get = jest.fn(() => Promise.resolve({ data: modes }))

    const expectedActions = [{ type: types.FETCH_MODES, modes }]
    const store = createStore(actions.initialState)

    return store.dispatch(actions.fetchModes()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toHaveBeenCalledWith(ENDPOINT)
    })
  })

  it('should create nothing when fetching modes has not been done', () => {
    const ENDPOINT = `${actions.SERVER_URL}/game-settings`

    jest.mock('axios', () => jest.fn())

    axios.get = jest.fn(() => Promise.reject())

    const expectedActions = [{ type: '' }]
    const store = createStore(actions.initialState)

    return store.dispatch(actions.fetchModes()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toHaveBeenCalledWith(ENDPOINT)
    })
  })

  it('should create FETCH_WINNERS when fetching winners has been done', () => {
    const ENDPOINT = `${actions.SERVER_URL}/winners`
    const winners = [{ winner: 'winner', date: 'date' }]

    jest.mock('axios', () => jest.fn())

    axios.get = jest.fn(() => Promise.resolve({ data: winners }))

    const expectedActions = [
      {
        type: types.FETCH_WINNERS,
        winners: winners.reverse().map((winner) => ({ ...winner, id: expect.any(String) }))
      }
    ]
    const store = createStore(actions.initialState)

    return store.dispatch(actions.fetchWinners()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toHaveBeenCalledWith(ENDPOINT)
    })
  })

  it('should create nothing when fetching winners has not been done', () => {
    const ENDPOINT = `${actions.SERVER_URL}/winners`

    jest.mock('axios', () => jest.fn())

    axios.get = jest.fn(() => Promise.reject())

    const expectedActions = [{ type: '' }]
    const store = createStore(actions.initialState)

    return store.dispatch(actions.fetchWinners()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toHaveBeenCalledWith(ENDPOINT)
    })
  })

  it('should create SET_SELECTED when changing isPlaying', () => {
    const expectedActions = [
      { selected: expect.any(String), type: types.SET_SELECTED },
      { type: types.CHANGE_IS_PLAYING }
    ]
    const store = createStore(state)

    store.dispatch(actions.changeIsPlaying())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should create nothing when changing isPlaying', () => {
    const expectedActions = [{ type: types.CHANGE_IS_PLAYING }]
    state.game.isPlaying = true
    const store = createStore(state)

    store.dispatch(actions.changeIsPlaying())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should inc player score', () => {
    const expectedActions = [{ type: types.INC_PLAYER_SCORE }]
    const store = createStore(state)

    store.dispatch(actions.incPlayerScore())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should inc player score - winner', () => {
    const expectedActions = [
      { type: types.INC_PLAYER_SCORE },
      { type: types.SET_WINNER, winner: state.game.name },
      { type: types.CHANGE_IS_PLAYING }
    ]

    const store = createStore({ game: { ...state.game, playerScore: 12 } })

    store.dispatch(actions.incPlayerScore())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should post winner - player', () => {
    const ENDPOINT = `${actions.SERVER_URL}/winners`

    jest.mock('axios', () => jest.fn())

    axios.get = jest.fn(() => Promise.resolve({ data: [] }))
    axios.post = jest.fn(() => Promise.resolve({ data: {} }))

    const expectedActions = [
      { type: types.INC_PLAYER_SCORE },
      { type: types.SET_WINNER, winner: state.game.name },
      { type: types.CHANGE_IS_PLAYING },
      { type: types.FETCH_WINNERS, winners: [] }
    ]
    const store = createStore({ game: { ...state.game, playerScore: 12 } })

    return store.dispatch(actions.incPlayerScore()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toHaveBeenCalledWith(ENDPOINT)
      expect(axios.post).toHaveBeenCalledWith(ENDPOINT, {
        date: expect.any(String),
        winner: state.game.name
      })
    })
  })

  it('should inc computer score', () => {
    const expectedActions = [{ type: types.INC_COMPUTER_SCORE }]
    const store = createStore(state)
    store.dispatch(actions.incComputerScore())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should inc computer score - winner', () => {
    const expectedActions = [
      { type: types.INC_COMPUTER_SCORE },
      { type: types.SET_WINNER, winner: actions.COMPUTER },
      { type: types.CHANGE_IS_PLAYING }
    ]
    const store = createStore({ game: { ...state.game, computerScore: 12 } })

    store.dispatch(actions.incComputerScore())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should post winner - computer', () => {
    const ENDPOINT = `${actions.SERVER_URL}/winners`

    jest.mock('axios', () => jest.fn())

    axios.get = jest.fn(() => Promise.resolve({ data: [] }))
    axios.post = jest.fn(() => Promise.resolve({ data: {} }))

    const expectedActions = [
      { type: types.INC_COMPUTER_SCORE },
      { type: types.SET_WINNER, winner: actions.COMPUTER },
      { type: types.CHANGE_IS_PLAYING },
      { type: types.FETCH_WINNERS, winners: [] }
    ]
    const store = createStore({ game: { ...state.game, computerScore: 12 } })

    return store.dispatch(actions.incComputerScore()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.get).toHaveBeenCalledWith(ENDPOINT)
      expect(axios.post).toHaveBeenCalledWith(ENDPOINT, {
        date: expect.any(String),
        winner: actions.COMPUTER
      })
    })
  })

  it('should clear board', () => {
    const expectedActions = [
      { type: types.CLEAR },
      { type: types.FETCH_MODES, modes: state.game.modes, allModes: state.game.allModes },
      { type: types.FETCH_WINNERS, winners: state.game.winners },
      { type: types.SET_CURRENT_MODE, mode: state.game.currentMode.name },
      { type: types.SET_NAME, name: state.game.name }
    ]
    const store = createStore(state)

    store.dispatch(actions.clearBoard())
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set current mode', () => {
    const expectedActions = [{ type: '' }]
    const store = createStore(state)

    store.dispatch(actions.setCurrentMode({}))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should set current mode', () => {
    const expectedActions = [{ type: types.SET_CURRENT_MODE, mode: state.game.currentMode.name }]
    const store = createStore(state)

    store.dispatch(actions.setCurrentMode(state.game.currentMode.name))
    expect([store.getActions()[store.getActions().length - 1]]).toEqual(expectedActions)
    return undefined
  })

  it('should set tile state to selected', () => {
    const { id } = state.game.tiles[0]
    const expectedActions = [
      { type: types.UPDATE_TILE_STATE, id, state: actions.tileColorStates.selected }
    ]
    const store = createStore(state)

    store.dispatch(actions.setTileState(id, actions.tileColorStates.selected))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to selected from selected', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.selected
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.selected))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to selected from missed', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.missed
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.selected))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should set tile state to clicked', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.selected
    const expectedActions = [
      { type: types.INC_PLAYER_SCORE },
      { type: types.SET_TIMEOUT_ID, timeoutId: null },
      { type: types.SET_SELECTED, selected: expect.any(String) },
      { type: types.UPDATE_TILE_STATE, id, state: actions.tileColorStates.clicked }
    ]
    const store = createStore({ game: { ...state.game, tiles } })
    store.dispatch(actions.setTileState(id, actions.tileColorStates.clicked))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to clicked from free', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.free
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.clicked))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to clicked from missed', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.missed
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.clicked))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to clicked from clicked', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.clicked
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.clicked))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should set tile state to missed', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.selected
    const expectedActions = [
      { type: types.INC_COMPUTER_SCORE },
      { type: types.SET_TIMEOUT_ID, timeoutId: null },
      { type: types.SET_SELECTED, selected: expect.any(String) },
      { type: types.UPDATE_TILE_STATE, id, state: actions.tileColorStates.missed }
    ]
    const store = createStore({ game: { ...state.game, tiles } })
    store.dispatch(actions.setTileState(id, actions.tileColorStates.missed))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to missed from free', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.free
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.missed))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to missed from missed', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.missed
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.missed))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should not set tile state to missed from clicked', () => {
    const { id } = state.game.tiles[0]
    const tiles = [...state.game.tiles]
    tiles[0].state = actions.tileColorStates.clicked
    const expectedActions = [{ type: '' }]
    const store = createStore({ game: { ...state.game, tiles } })

    store.dispatch(actions.setTileState(id, actions.tileColorStates.missed))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should add to modes', () => {
    const expectedActions = [{ type: types.FILTER_MODES, modes: state.game.modes }]
    const name = Object.keys(state.game.modes)[0]
    const mode = state.game.modes[name]
    const modes = { ...state.game.modes }
    delete modes[name]
    const store = createStore({ game: { ...state.game, modes } })

    store.dispatch(actions.addToModes(name, mode))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })

  it('should remove from modes', () => {
    const name = Object.keys(state.game.modes)[0]
    const modes = { ...state.game.modes }
    delete modes[name]
    const expectedActions = [{ type: types.FILTER_MODES, modes }]
    const store = createStore(state)

    store.dispatch(actions.removeFromModes(name))
    expect(store.getActions()).toEqual(expectedActions)
    return undefined
  })
})
