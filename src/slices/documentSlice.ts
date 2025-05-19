import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { Layer } from "ag-psd"
import { createSelector } from "@reduxjs/toolkit"

import { exampleDocument } from "../utils/exampleDocument"
export interface PsdObject {
  id: number
  artboardId: number | null
  idPath: number[]
  namePath: string[]
  name: string
  type?: "artboard" | "group" | "layer"
  canvas?: string
  //clipping:true means that the element should be clipped to the next sibling (in photoshop layers) - or, what ends up happening in dom - to the previous sibling
  clipping?: boolean
  text?: Layer["text"]
  rect: {
    top: number | undefined
    left: number | undefined
    bottom: number | undefined
    right: number | undefined
  }
  children: PsdObject[]
}

export interface PsdObjectChild {
  object: PsdObject
  // array of IDs of elements that are the elements ancestors
  parentIdPath: number[]
  parentNamePath: string[]
}
// Define the TS type for the counter slice's state
export interface DocumentSliceState {
  artboards: Array<PsdObject> | []
  elements: Array<PsdObject> | []
  thumbnail: string | undefined
}

// Define the initial value for the slice state
const initialState: DocumentSliceState = {
  ...exampleDocument,
  // artboards: [],
  // elements: [],
  // thumbnail: "",
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
        state.elements = [
          ...state.elements
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
      //TODO: add children based on path instead of iterating and looking for the correct id
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
      const stretch = (
        rectToStretch: PsdObject["rect"],
        rectToFit: PsdObject["rect"],
      ): PsdObject["rect"] => {
        const fitRect = {
          top: rectToFit.top,
          right: rectToFit.right,
          bottom: rectToFit.bottom,
          left: rectToFit.left,
        }
        let rectCopy = {
          top: rectToStretch.top,
          right: rectToStretch.right,
          bottom: rectToStretch.bottom,
          left: rectToStretch.left,
        }

        //if there's no child rectangle to fit, return original
        if (
          fitRect.top === undefined ||
          fitRect.right === undefined ||
          fitRect.left === undefined ||
          fitRect.bottom === undefined
        )
          return rectToStretch

        //if group has no size yet, set the size to this child
        if (
          rectToStretch.top === undefined ||
          rectToStretch.right === undefined ||
          rectToStretch.bottom === undefined ||
          rectToStretch.left === undefined
        ) {
          rectCopy.top = fitRect.top
          rectCopy.right = fitRect.right
          rectCopy.bottom = fitRect.bottom
          rectCopy.left = fitRect.left
          return rectCopy
        }

        //if group's size is smaller than the child, stretch!
        if (rectToStretch.top > fitRect.top) rectCopy.top = fitRect.top
        if (rectToStretch.right < fitRect.right) rectCopy.right = fitRect.right
        if (rectToStretch.bottom < fitRect.bottom)
          rectCopy.bottom = fitRect.bottom
        if (rectToStretch.left > fitRect.left) rectCopy.left = fitRect.left

        return rectCopy
      }

      function formatDataWithResize(
        arr: PsdObject[],
        Id: number,
        objectToAdd: PsdObject,
      ) {
        arr.forEach(i => {
          if (i.id === Id) {
            if (i.type !== "artboard")
              i.rect = { ...stretch(i.rect, objectToAdd.rect) }
            //stretch the group when you add child to it

            i.children = [...i.children, objectToAdd]
          } else {
            formatDataWithResize(i.children, Id, objectToAdd)
          }
        })
      }

      formatDataWithResize(
        copy,
        action.payload.parentIdPath[action.payload.parentIdPath.length - 1],
        action.payload.object,
      )

      state.elements = copy

      //argument: id of the element to stretch: action.payload.parentId
      //find parent of parent
      // const parentParentId = state.elements.find(
      //   element => element.id === action.payload.parentPath,
      // )?.parentId

      // console.log("parentId", action.payload.parentPath)
      // console.log("parentParentId", parentParentId)

      // const idToStretch = state.elements.find(
      //   element => element.id === parentParentId,
      // )?.parentId

      // //stretch parent element
      // state.elements = state.elements.map(x =>
      //   x.id === idToStretch
      //     ? { ...x, rect: { ...stretch(x.rect, action.payload.object.rect) } }
      //     : x,
      // )
    },
    setThumbnail: (state, action: PayloadAction<string | undefined>) => {
      state.thumbnail = action.payload
    },
    reset: (state, action: PayloadAction<void>) => {
      state.elements = []
      state.artboards = []
    },
    setDocument: (state, action: PayloadAction<DocumentSliceState>) => {
      Object.assign(state, action.payload)
    },
  },
  selectors: {
    selectDocument: document => document,
    selectElements: document => document.elements,
    selectArtboards: document => document.artboards,
    selectThumbnail: document => document.thumbnail,
    selectArtboardById: (document, id: number) =>
      document.artboards.find(artboard => artboard.id === id),
  },
})

// Export the generated action creators for use in components
export const {
  add,
  remove,
  modify,
  addChild,
  setThumbnail,
  reset,
  setDocument,
} = documentSlice.actions

export const {
  selectDocument,
  selectElements,
  selectArtboards,
  selectThumbnail,
  selectArtboardById,
} = documentSlice.selectors

export const selectElementsFlat = createSelector([selectDocument], document => {
  let elementsFlat: PsdObject[] = []
  const flattenElement = (element: PsdObject) => {
    let flatList: PsdObject[] = []
    element.children.forEach((child: PsdObject) => {
      flatList = flatList.concat(flattenElement(child))
    })

    flatList = flatList.concat({ ...element, children: [] })
    return flatList
  }
  document.elements.forEach(element => {
    elementsFlat = elementsFlat.concat(flattenElement(element))
  })
  return elementsFlat
})
// Export the slice reducer for use in the store configuration
export default documentSlice.reducer
