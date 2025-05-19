import { MouseEventHandler, useEffect, useRef, useState } from "react"
import {
  add,
  remove,
  modify,
  selectDocument,
  PsdObject,
} from "../../slices/documentSlice"

export type ViewerElementProps = {
  element: PsdObject
  offsetRect: {
    top: number | undefined
    left: number | undefined
  }
  handleClick: MouseEventHandler
}

export const ViewerElement = ({
  element,
  offsetRect,
  handleClick: handleClick,
}: ViewerElementProps) => {
  // const container = useRef(null)
  // useEffect(() => {
  //   if (element.canvas) {
  //     container.current.innerHtml = ""
  //     container.current.append(element.canvas)
  //   }
  // }, [container])

  return (
    <div
      onClick={handleClick}
      className={`element${element.type ? " " + element.type : ""}`}
      data-name={element.name}
      style={
        element.rect && {
          top:
            element.rect.top !== undefined && element.rect.top - offsetRect.top,
          left:
            element.rect.left !== undefined &&
            element.rect.left - offsetRect.left,
          width:
            element.rect.right !== undefined &&
            element.rect.left !== undefined &&
            element.rect.right - element.rect.left,
          height:
            element.rect.bottom !== undefined &&
            element.rect.top !== undefined &&
            element.rect.bottom - element.rect.top,
          backgroundImage: `url("${element.canvas}")`,
        }
      }
    >
      {/* <div
        className="canvas"
        style={{ backgroundImage: `url("${element.canvas}")` }}
      ></div> */}
      {/* <img src={element.canvas}></img> */}

      {/* {element.name} */}
      {element.children?.map(child => (
        <ViewerElement
          key={child.id + child.name}
          element={child}
          offsetRect={{
            top:
              element.rect.top === undefined
                ? offsetRect.top
                : element.rect.top,
            left:
              element.rect.left === undefined
                ? offsetRect.left
                : element.rect.left,
          }}
          handleClick={handleClick}
        ></ViewerElement>
      ))}
    </div>
  )
}
