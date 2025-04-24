import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface PsdObject {
  id: number
  name: string
  type?: string
  rect?: {
    top: string
    left: string
    bottom: string
    right: string
  }
  children: PsdObject[]
}

export interface PsdObjectChild {
  object: PsdObject
  // array of IDs of elements that are the elements ancestors
  parentId: number
}
// Define the TS type for the counter slice's state
export interface DocumentSliceState {
  artboards: Array<PsdObject> | []
  elements: Array<PsdObject> | []
}

// Define the initial value for the slice state
const initialState: DocumentSliceState = {
  artboards: [],
  elements: [],
}

// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const documentSlice = createSlice({
  name: "document",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    add: (state, action: PayloadAction<PsdObject>) => {
      if (action.payload.type === "artboard") {
        state.artboards = [
          ...state.artboards
            //remove object with same id
            .filter(x => x.id !== action.payload.id),
          action.payload,
        ]
      } else {
        state.elements = [
          ...state.elements
            //remove object with same id
            .filter(x => x.id !== action.payload.id),
          action.payload,
        ]
      }
    },
    remove: (state, action: PayloadAction<number>) => {
      state.artboards = state.artboards.filter(x => x.id !== action.payload)
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    modify: (state, action: PayloadAction<PsdObject>) => {
      state.artboards = state.artboards.map(x =>
        x.id === action.payload.id ? action.payload : x,
      )
    },
    addChild: (state, action: PayloadAction<PsdObjectChild>) => {
      let copy = state.elements

      function formatData(
        arr: PsdObject[],
        Id: number,
        objectToAdd: PsdObject,
      ) {
        arr.forEach(i => {
          if (i.id === Id) {
            i.children = [...i.children, objectToAdd]
          } else {
            formatData(i.children, Id, objectToAdd)
          }
        })
      }

      formatData(copy, action.payload.parentId, action.payload.object)

      state.elements = copy
    },
  },
  selectors: {
    selectDocument: document => document,
  },
})

// Export the generated action creators for use in components
export const { add, remove, modify, addChild } = documentSlice.actions

export const { selectDocument } = documentSlice.selectors

// Export the slice reducer for use in the store configuration
export default documentSlice.reducer
