import { Psd, readPsd } from "ag-psd"
import { useEffect, useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import {
  add,
  remove,
  modify,
  addChild,
  reset,
  selectDocument,
  selectElementsFlat,
  PsdObject,
} from "../../slices/documentSlice"

export type FileElement = {
  artboard?: {
    rect: {
      top: number
      left: number
      bottom: number
      right: number
    }
  }
  children?: FileElement[]
  placedLayer?: object
  text?: object
  id: number
  name: string
  left: number
  right: number
  top: number
  bottom: number
}

export const FileInput = () => {
  const [psd, setPsd] = useState<Psd | null>(null)
  const dispatch = useAppDispatch()
  const checkChildren = (
    object: FileElement,
    parentPath: number[],
    artboardId: number | null,
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
            IdPath: [],
            name: object.name,
            type: "artboard",
            rect: { ...object.artboard.rect },
            children: [],
          }),
        )
      } else {
        if (parentPath) {
          console.log("adding child")
          dispatch(
            addChild({
              object: {
                name: object.name,
                type: isLayer ? "layer" : "group",
                id: object.id,
                artboardId: artboardId,
                IdPath: [...parentPath],
                rect: isLayer
                  ? {
                      left: object.left,
                      right: object.right,
                      top: object.top,
                      bottom: object.bottom,
                    }
                  : {
                      left: undefined,
                      right: undefined,
                      top: undefined,
                      bottom: undefined,
                    },
                children: [],
              },
              parentPath: parentPath,
            }),
          )
        } else {
          dispatch(
            add({
              id: object.id,
              artboardId: null,
              IdPath: [],
              name: object.name,
              type: isLayer ? "layer" : "group",
              rect: isLayer
                ? {
                    left: object.left,
                    right: object.right,
                    top: object.top,
                    bottom: object.bottom,
                  }
                : {
                    left: undefined,
                    right: undefined,
                    top: undefined,
                    bottom: undefined,
                  },
              children: [],
            }),
          )
        }
      }
    }

    if (object.children === undefined) {
    } else {
      object.children.forEach(child => {
        if (object.artboard) {
          checkChildren(child, [...parentPath, object.id], null)
        } else {
          checkChildren(child, [...parentPath, object.id], artboardId)
        }
      })
    }
  }

  useEffect(() => {
    if (psd === null) return
    dispatch(reset())
    checkChildren(psd as unknown as FileElement, [], null)
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

  const handleFile = (psd: Psd) => {
    setPsd(psd)
  }

  return <input className="input" type="file"></input>
}
