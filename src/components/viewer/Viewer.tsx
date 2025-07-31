import { useEffect, useRef, useState } from "react"

import { FaObjectGroup, FaObjectUngroup } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  selectDocument,
  selectElements,
  selectThumbnail,
} from "../../slices/documentSlice"

import { addQuery, QueryClass } from "../../slices/querySlice"

import { ViewerElement } from "../viewerElement/ViewerElement"

export const Viewer = () => {
  const document = useAppSelector(selectDocument)
  const elements = useAppSelector(selectElements)
  const thumbnail = useAppSelector(selectThumbnail)
  const dispatch = useAppDispatch()

  const [disabledLayers, setDisabledLayers] = useState<HTMLElement[]>([])
  const [zoom, setZoom] = useState(1)
  const [selectGroups, setSelectGroups] = useState(false)

  const handleClick = (event: React.MouseEvent) => {
    const escapeRegex = (query: QueryClass[keyof QueryClass]) => {
      const REGEXP_SPECIAL_CHAR = /[\(\)]/g

      return typeof query === "string"
        ? query.replace(REGEXP_SPECIAL_CHAR, String.fromCharCode(92) + "$&")
        : query
    }
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
      const newQuery = new QueryClass().query
      if (event.target instanceof HTMLElement && event.target.dataset.name)
        dispatch(
          addQuery({
            ...newQuery,
            psdSelector: `^${escapeRegex(event.target.dataset.name)}$`,
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

  const handleSelectGroupsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSelectGroups(!selectGroups)
    event.stopPropagation()
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
      className="viewer relative overflow-hidden bg-bg-2 size-full min-h-[1000px]"
      ref={viewerRef}
      onWheel={handleWheel}
    >
      {/* show state as JSON, for development only */}
      {/* <textarea value={JSON.stringify(document)}></textarea> */}
      <style>
        {`.viewer .group {
        pointer-events:${selectGroups ? "all" : "none"};
      }`}
      </style>

      <div className="relative size-full overflow-scroll">
        <div
          className="canvas m-1 relative size-0 transition-transform"
          style={{
            transform: `scale(${zoom})`,
            // backgroundImage: `url("${thumbnail}")`,
          }}
        >
          <img src={thumbnail} className="max-w-none" />
          {elements.map((element, index) => {
            return (
              <ViewerElement
                key={element.id}
                element={element}
                offsetRect={{ top: 0, left: 0 }}
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
      <div className="absolute top-0 right-0 cursor-pointer">
        <button
          title="allow selecting groups"
          onMouseDown={handleSelectGroupsClick}
          className="cursor-pointer border-main border rounded w-6 h-6 relative
    flex justify-center items-center p-[3px] "
        >
          {/* <div
            className={`rounded-full bg-main h-4/5 aspect-square border-slate-80 top-1/2 absolute transition-all duration-500  -translate-y-1/2 left-[2px] ${selectGroups && "left-[calc(100%-2px)] -translate-x-full"}`}
          ></div> */}
          <FaObjectGroup
            className={`absolute transition-all text-main mt-px ${selectGroups ? "opacity-100" : "opacity-0"}`}
          />
          <FaObjectUngroup
            className={`absolute transition-all text-main ${selectGroups ? "opacity-0" : "opacity-100"}`}
          />
        </button>
      </div>
    </div>
  )
}

export type ViewerProps = {
  file: Object | null
}
