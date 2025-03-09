import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface PsdObject {
  id: number
}
// Define the TS type for the counter slice's state
export interface DocumentSliceState {
  value: Array<PsdObject> | []
}

// Define the initial value for the slice state
const initialState: DocumentSliceState = {
  value: [],
}

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const documentSlice = createSlice({
  name: "document",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    add: (state, action: PayloadAction<PsdObject>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = [...state.value, action.payload]
    },
    remove: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter(x => x.id !== action.payload)
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    modify: (state, action: PayloadAction<PsdObject>) => {
      state.value = state.value.map(x =>
        x.id === action.payload.id ? action.payload : x,
      )
    },
  },
})

// Export the generated action creators for use in components
export const { add, remove, modify } = documentSlice.actions

// Export the slice reducer for use in the store configuration
export default documentSlice.reducer
