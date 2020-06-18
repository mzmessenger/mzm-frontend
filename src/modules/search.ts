import { Dispatch } from 'redux'
import { State } from './index'
import { SearchState, SearchAction, SearchActions } from './search.types'

export const initState: SearchState = {
  query: '',
  scroll: null,
  total: 0,
  results: []
}

export const reducer = (
  state: SearchState = initState,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case SearchActions.Cancel:
      return { ...state, query: '', scroll: null, results: [], total: 0 }
    case SearchActions.SetQuery:
      return { ...state, query: action.payload.query }
    case SearchActions.SetResults:
      return {
        ...state,
        results: action.payload.results,
        scroll: action.payload.scroll,
        total: action.payload.total
      }
    case SearchActions.AppendResults:
      return {
        ...state,
        results: [...state.results, ...action.payload.results],
        scroll: action.payload.scroll,
        total: action.payload.total
      }
    default:
      return state
  }
}

export const cancel = () => {
  return { type: SearchActions.Cancel }
}

export const search = (query: string) => {
  return async (dispatch: Dispatch<SearchAction>) => {
    dispatch({ type: SearchActions.SetQuery, payload: { query } })
    const params = new URLSearchParams([['query', query]])

    const res = await fetch(`/api/rooms/search?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

    if (res.ok) {
      const { hits, scroll, total } = await res.json()
      dispatch({
        type: SearchActions.SetResults,
        payload: { results: hits, scroll, total }
      })
    }

    return res
  }
}

export const searchNext = () => {
  return async (dispatch: Dispatch<SearchAction>, getState: () => State) => {
    const { query, scroll } = getState().search
    if (!query || !scroll) {
      return
    }
    const params = new URLSearchParams([
      ['query', query],
      ['scroll', scroll]
    ])

    const res = await fetch(`/api/rooms/search?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

    if (res.ok) {
      const { hits, scroll, total } = await res.json()
      dispatch({
        type: SearchActions.AppendResults,
        payload: { results: hits, scroll, total }
      })
    }

    return res
  }
}
