export type SearchState = {
  query: string
  scroll: string
  total: number
  results: { id: string; name: string; iconUrl: string }[]
}

export const SearchActions = {
  Cancel: 'SearchAction:cancel',
  SetQuery: 'SearchAction:setQuery',
  SetResults: 'SearchAction:setResults',
  AppendResults: 'SearchAction:appendResults'
} as const

type SeachResult = {
  id: string
  name: string
  iconUrl: string
}

export type SearchAction =
  | { type: typeof SearchActions.Cancel }
  | {
      type: typeof SearchActions.SetQuery
      payload: { query: string }
    }
  | {
      type: typeof SearchActions.SetResults
      payload: { scroll: string | null; total: number; results: SeachResult[] }
    }
  | {
      type: typeof SearchActions.AppendResults
      payload: { scroll: string | null; total: number; results: SeachResult[] }
    }
