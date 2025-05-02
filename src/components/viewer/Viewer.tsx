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

  const [disabledLayers, setDisabledLayers] = useState<HTMLElement[]>([])

  const handleDigThroughLayers = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement
    if (event.ctrlKey) {
      setDisabledLayers([...disabledLayers, element])
      element.style.pointerEvents = "none"
    }
  }

  const handleUnhideLayers = (event: React.MouseEvent) => {
    if (event.shiftKey && disabledLayers.length > 0) {
      disabledLayers.slice(-1)[0].style.pointerEvents = ""
      setDisabledLayers(disabledLayers.slice(0, -1))
    }
  }

  return (
    <div className="viewer relative overflow-scroll">
      <div
        className="canvas m-1 relative size-full"
        onClick={handleUnhideLayers}
      >
        {elements.map((element, index) => {
          return (
            <ViewerElement
              key={element.id}
              element={element}
              digThroughLayers={handleDigThroughLayers}
            ></ViewerElement>
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
