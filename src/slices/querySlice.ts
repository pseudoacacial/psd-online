import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Query {
  id: string
  cssSelector?: string
  psdSelector: string
  showPosition?: boolean
  showSize?: boolean
  showFontSize?: boolean
  export?: boolean
  exportName?: string
  exportCrop?: boolean
  frame?: boolean
  framePsdSelector?: string
  matchIndex: number
}

export class QueryClass {
  query: Query
  constructor(id?: string) {
    this.query = {
      id: id || self.crypto.randomUUID().toString(),
      psdSelector: "",
      cssSelector: "",
      showPosition: true,
      showSize: true,
      showFontSize: true,
      export: false,
      frame: false,
      matchIndex: 0,
    }
  }
}

// Define the TS type for the counter slice's state
export interface QuerySliceState {
  queries: Array<Query> | []
}

// Define the initial value for the slice state
const initialState: QuerySliceState = {
  queries: [],
}

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const QuerySlice = createSlice({
  name: "queries",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addQuery: (state, action: PayloadAction<Query>) => {
      state.queries = [
        ...state.queries
          //remove object with same id
          .filter(x => x.id !== action.payload.id),
        action.payload,
      ]
    },
    remove: (state, action: PayloadAction<string>) => {
      state.queries = state.queries.filter(x => x.id !== action.payload)
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    modify: (state, action: PayloadAction<Query>) => {
      state.queries = state.queries.map(x =>
        x.id === action.payload.id ? action.payload : x,
      )
    },
    reset: (state, action: PayloadAction<void>) => {
      state.queries = []
    },
  },
  selectors: {
    selectQueries: queries => queries.queries,
  },
})

// Export the generated action creators for use in components
export const { addQuery, remove, modify, reset } = QuerySlice.actions

export const { selectQueries: selectQueries } = QuerySlice.selectors

// Export the slice reducer for use in the store configuration
export default QuerySlice.reducer
