import { useEffect, useRef } from "react"
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

import { addQuery, QueryClass } from "../../slices/querySlice"

import { ViewerElement } from "../viewerElement/ViewerElement"

export const Viewer = () => {
  const document = useAppSelector(selectDocument)
  const elements = useAppSelector(selectElements)
  const dispatch = useAppDispatch()

  const [disabledLayers, setDisabledLayers] = useState<HTMLElement[]>([])
  const [zoom, setZoom] = useState(1)

  const handleClick = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement
    //dig through layers on ctrl click
    if (event.ctrlKey) {
      setDisabledLayers([...disabledLayers, element])
      element.style.pointerEvents = "none"
      //unhide layers on shift click
    } else if (event.shiftKey) {
      if (disabledLayers.length > 0) {
        disabledLayers.slice(-1)[0].style.pointerEvents = ""
        setDisabledLayers(disabledLayers.slice(0, -1))
      }
      //add a new query on normal click
    } else {
      const newQuery = { ...new QueryClass(self.crypto.randomUUID()) }
      if (event.target instanceof HTMLElement && event.target.dataset.name)
        dispatch(
          addQuery({
            ...newQuery,
            psdSelector: `^${event.target.dataset.name}$`,
          }),
        )
      event.stopPropagation()
    }
  }

  const handleWheel = (event: React.WheelEvent) => {
    if (event.ctrlKey) {
      if (event.deltaY < 0) {
        setZoom(zoom + 0.1)
      }
      if (event.deltaY > 0) {
        setZoom(Math.max(zoom - 0.1, 0.1))
      }
    }
  }
  const viewerRef = useRef<HTMLElement>(null)

  //"React binds all events at the root element (not the document), and the wheel event is binded internally using true option, and I quote MDN:
  //A Boolean that, if true, indicates that the function specified by listener will never call preventDefault()."
  useEffect(() => {
    viewerRef.current?.addEventListener("wheel", event => {
      event.ctrlKey && event.preventDefault()
    })
    return () => {
      viewerRef.current?.removeEventListener("wheel", event => {
        event.ctrlKey && event.preventDefault()
      })
    }
  }, [])

  return (
    <div
      className="viewer relative overflow-scroll"
      ref={viewerRef}
      onWheel={handleWheel}
    >
      <div
        className="canvas m-1 relative size-full transition-transform"
        style={{ transform: `scale(${zoom})` }}
      >
        {elements.map((element, index) => {
          return (
            <ViewerElement
              key={element.id}
              element={element}
              handleClick={handleClick}
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
