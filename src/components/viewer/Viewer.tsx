import { useEffect } from "react"
import { useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  add,
  remove,
  modify,
  addChild,
  selectDocument,
  selectElementsFlat,
  PsdObject,
} from "../../slices/documentSlice"

import { ViewerElement } from "../viewerElement/ViewerElement"

export const Viewer = () => {
  const document = useAppSelector(selectDocument)
  const elements = useAppSelector(selectElementsFlat)

  return (
    <div className="viewer relative overflow-hidden">
      {elements.map((element, index) => {
        return (
          <ViewerElement key={element.id} element={element}></ViewerElement>
        )
      })}
      {document.artboards.map((element, index) => {
        return (
          <ViewerElement key={element.id} element={element}></ViewerElement>
        )
      })}
    </div>
  )
}

export type ViewerProps = {
  file: Object | null
}
