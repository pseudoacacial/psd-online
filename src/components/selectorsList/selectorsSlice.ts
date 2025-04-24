import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface Selector {
  id: string
  cssSelector: string
  psdSelector?: string
}

// Define the TS type for the counter slice's state
export interface SelectorsSliceState {
  selectors: Array<Selector> | []
}

// Define the initial value for the slice state
const initialState: SelectorsSliceState = {
  selectors: [],
}

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const selectorsSlice = createSlice({
  name: "selectors",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    add: (state, action: PayloadAction<Selector>) => {
      state.selectors = [
        ...state.selectors
          //remove object with same id
          .filter(x => x.id !== action.payload.id),
        action.payload,
      ]
    },
    remove: (state, action: PayloadAction<string>) => {
      state.selectors = state.selectors.filter(x => x.id !== action.payload)
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    modify: (state, action: PayloadAction<Selector>) => {
      state.selectors = state.selectors.map(x =>
        x.id === action.payload.id ? action.payload : x,
      )
    },
  },
  selectors: {
    selectSelectors: selector => selector,
  },
})

// Export the generated action creators for use in components
export const { add, remove, modify } = selectorsSlice.actions

export const { selectSelectors } = selectorsSlice.selectors

// Export the slice reducer for use in the store configuration
export default selectorsSlice.reducer
