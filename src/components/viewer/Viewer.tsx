import { useEffect } from "react"
import { useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  add,
  remove,
  modify,
  addChild,
  selectDocument,
  selectElements,
  selectElementsFlat,
  PsdObject,
} from "../../slices/documentSlice"

import { ViewerElement } from "../viewerElement/ViewerElement"

export const Viewer = () => {
  const document = useAppSelector(selectDocument)
  const elements = useAppSelector(selectElements)

  return (
    <div className="viewer relative overflow-hidden">
      <div className="canvas m-1 relative size-full">
        {elements.map((element, index) => {
          return (
            <ViewerElement key={element.id} element={element}></ViewerElement>
          )
        })}
        {/* {document.artboards.map((element, index) => {
        return (
          <ViewerElement key={element.id} element={element}></ViewerElement>
        )
      })} */}
      </div>
    </div>
  )
}

export type ViewerProps = {
  file: Object | null
}
