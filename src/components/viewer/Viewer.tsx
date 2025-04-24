import { useEffect } from "react"
import { useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  add,
  remove,
  modify,
  addChild,
  selectDocument,
  PsdObject,
} from "./documentSlice"

import { ViewerElement } from "../viewerElement/ViewerElement"

export type FileElement = {
  artboard?: {
    rect: {
      top: string
      left: string
      bottom: string
      right: string
    }
  }
  children?: {}
  id: number
  name: string
  left: string
  right: string
  top: string
  bottom: string
}

export const Viewer = ({ file }: ViewerProps) => {
  const dispatch = useAppDispatch()
  const document = useAppSelector(selectDocument)

  const checkChildren = (object: FileElement, parentId: number) => {
    if (object.artboard !== undefined) {
      dispatch(
        add({
          id: object.id,
          name: object.name,
          type: "artboard",
          rect: object.artboard.rect,
          children: [],
          referencePoint: object.referencePoint,
        }),
      )
    } else {
      dispatch(
        add({
          name: object.name,
          id: object.id,
          rect: {
            left: object.left,
            right: object.right,
            top: object.top,
            bottom: object.bottom,
          },
          children: [],
        }),
      )
    }

    if (object.children === undefined) {
    } else {
      object.children.forEach(child => {
        checkChildren(child, object.id)
      })
    }
  }

  useEffect(() => {
    if (file === null) return
    checkChildren(file as FileElement, null)
  }, [file])

  return (
    <div className="viewer absolute">
      {document.elements.map((element, index) => {
        return <ViewerElement element={element}></ViewerElement>
      })}
      {document.artboards.map((element, index) => {
        return <ViewerElement element={element}></ViewerElement>
      })}
    </div>
  )
}

export type ViewerProps = {
  file: Object | null
}
