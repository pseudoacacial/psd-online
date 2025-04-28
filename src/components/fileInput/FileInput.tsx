import { readPsd } from "ag-psd"
import { useEffect, useState } from "react"

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

export type FileElement = {
  artboard?: {
    rect: {
      top: string
      left: string
      bottom: string
      right: string
    }
  }
  children?: FileElement[]
  placedLayer?: object
  text?: object
  id: number
  name: string
  left: string
  right: string
  top: string
  bottom: string
}

export const FileInput = () => {
  const [psd, setPsd] = useState(null)
  const dispatch = useAppDispatch()
  const checkChildren = (
    object: FileElement,
    parentId: number,
    artboardId: number,
  ) => {
    // don't do this part if it's the start of the file
    if (object.id) {
      //is layer if
      const isLayer =
        //has no children
        !object.children ||
        object.children.length < 1 ||
        //or is a text or raster
        object.text ||
        object.placedLayer
      if (object.artboard !== undefined) {
        dispatch(
          add({
            id: object.id,
            artboardId: object.id,
            name: object.name,
            type: "artboard",
            rect: object.artboard.rect,
            children: [],
          }),
        )
      } else {
        dispatch(
          addChild({
            object: {
              name: object.name,
              type: isLayer ? "layer" : "group",
              id: object.id,
              artboardId: artboardId,
              rect: isLayer
                ? {
                    left: object.left,
                    right: object.right,
                    top: object.top,
                    bottom: object.bottom,
                  }
                : {
                    left: null,
                    right: null,
                    top: null,
                    bottom: null,
                  },
              children: [],
            },
            parentId: parentId,
          }),
        )
      }
    }

    if (object.children === undefined) {
    } else {
      object.children.forEach(child => {
        if (object.artboard) {
          checkChildren(child, object.id, object.id)
        } else {
          checkChildren(child, object.id, artboardId)
        }
      })
    }
  }

  useEffect(() => {
    if (psd === null) return
    checkChildren(psd as FileElement, null, null)
    // console.log(psd)
  }, [psd])

  useEffect(() => {
    document.querySelector(".input")?.addEventListener("change", event => {
      const file = event.target?.files[0] // Get the selected file
      if (file) {
        const reader = new FileReader()

        reader.onload = function (e) {
          const arrayBuffer = e.target.result // This is the ArrayBuffer
          const psd = readPsd(arrayBuffer) // Output the ArrayBuffer
          // You can now use the arrayBuffer as needed
          handleFile(psd)
        }

        reader.onerror = function (e) {
          console.error("Error reading file", e)
        }

        reader.readAsArrayBuffer(file) // Read the file as an ArrayBuffer
      } else {
        console.log("No file selected")
      }
    })
  }, [])

  const handleFile = psd => {
    setPsd(psd)
  }

  return <input className="input" type="file"></input>
}
