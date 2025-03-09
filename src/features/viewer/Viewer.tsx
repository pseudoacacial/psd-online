import { useEffect } from "react"
import { useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { add, remove, modify, selectDocument, PsdObject } from "./documentSlice"

export const Viewer = ({ file }: ViewerProps) => {
  const dispatch = useAppDispatch()
  const document = useAppSelector(selectDocument)
  const checkChildren = (object: { children?: {} }) => {
    draw(object)

    if (object.children === undefined) {
    } else {
      object.children.forEach(child => {
        checkChildren(child)
      })
    }
  }

  const draw = (object: Object) => {
    if (object.artboard !== undefined) {
      dispatch(add({ id: object.name, rect: object.artboard.rect }))
    }

    console.log("drawing")
  }

  useEffect(() => {
    checkChildren(file)
  }, [file])

  return (
    <div className="viewer">
      {/* {elements.map((element, index) => {
        return (
          <div
            className="element"
            style={{
              top: element.rect.top,
              left: element.rect.left,
              width: element.rect.right - element.rect.left,
              height: element.rect.bottom - element.rect.top,
            }}
          ></div>
        )
      })} */}
      {document.map((element, index) => {
        return (
          <div
            className="element"
            style={{
              top: element.rect.top,
              left: element.rect.left,
              width: element.rect.right - element.rect.left,
              height: element.rect.bottom - element.rect.top,
            }}
          >
            {/* {{ element.id }} */}
          </div>
        )
      })}
    </div>
  )
}

export type ViewerProps = {
  file: Object
}
