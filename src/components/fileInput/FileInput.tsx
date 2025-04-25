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
  const checkChildren = (object: FileElement, parentId: number) => {
    // don't do this part if it's the start of the file
    if (object.id) {
      if (object.artboard !== undefined) {
        dispatch(
          add({
            id: object.id,
            name: object.name,
            type: "artboard",
            rect: object.artboard.rect,
            children: [],
          }),
        )
        dispatch(
          add({
            id: object.id,
            name: object.name,
            rect: object.artboard.rect,
            children: [],
          }),
        )
      } else {
        dispatch(
          addChild({
            object: {
              name: object.name,
              id: object.id,
              rect: {
                left: object.left,
                right: object.right,
                top: object.top,
                bottom: object.bottom,
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
        checkChildren(child, object.id)
      })
    }
  }

  useEffect(() => {
    if (psd === null) return
    checkChildren(psd as FileElement, null)
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
