import { byteArrayToBase64, Layer, Psd, readPsd } from "ag-psd"
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
  setThumbnail,
} from "../../slices/documentSlice"

export interface FileElement extends Layer {
  name: string
  id: number
  children: FileElement[]
}

export const FileInput = () => {
  const [psd, setPsd] = useState<Psd | null>(null)
  const dispatch = useAppDispatch()

  const checkChildren = (
    object: FileElement,
    parentIdPath: number[],
    parentNamePath: string[],
    artboardId: number | null,
  ) => {
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
          idPath: [],
          namePath: [],
          name: object.name || "",
          type: "artboard",
          rect: { ...object.artboard.rect },
          children: [],
        }),
      )
    } else {
      if (parentIdPath.length > 0) {
        dispatch(
          addChild({
            object: {
              name: object.name,
              type: isLayer ? "layer" : "group",
              id: object.id,
              artboardId: artboardId,
              idPath: [...parentIdPath],
              namePath: [...parentNamePath, object.name],
              text: object.text,
              canvas: object.canvas?.toDataURL("image/webp"),
              rect: isLayer
                ? {
                    left: object.left,
                    right: object.right,
                    top: object.top,
                    bottom: object.bottom,
                  }
                : {
                    top: undefined,
                    left: undefined,
                    right: undefined,
                    bottom: undefined,
                  },
              children: [],
            },
            parentIdPath: parentIdPath,
            parentNamePath: parentNamePath,
          }),
        )
      } else {
        dispatch(
          add({
            id: object.id,
            artboardId: null,
            idPath: [],
            namePath: [],
            text: object.text,
            name: object.name || "",
            type: isLayer ? "layer" : "group",
            rect: isLayer
              ? {
                  left: object.left,
                  right: object.right,
                  top: object.top,
                  bottom: object.bottom,
                }
              : {
                  top: undefined,
                  left: undefined,
                  right: undefined,
                  bottom: undefined,
                },
            children: [],
          }),
        )
      }
    }

    if (object.children === undefined) {
    } else {
      object.children.forEach(child => {
        if (object.artboard) {
          checkChildren(
            child,
            [...parentIdPath, object.id],
            [...parentNamePath, object.name],
            object.id,
          )
        } else {
          checkChildren(
            child,
            [...parentIdPath, object.id],
            [...parentNamePath, object.name],
            artboardId,
          )
        }
      })
    }
  }

  useEffect(() => {
    if (psd === null) return
    dispatch(reset())
    if (psd.children === undefined) {
      throw new Error("PSD file has no children. Is it a valid psd document?")
    }

    const thumbnail = psd.canvas?.toDataURL("image/webp")

    dispatch(setThumbnail(thumbnail))

    psd.children.forEach(element => {
      checkChildren(element as FileElement, [], [], null)
    })
    // console.log(psd)
  }, [psd])

  const handleFileChange = (event: React.ChangeEvent) => {
    const files = (event.target as HTMLInputElement).files // Get the selected file
    if (files) {
      const file = files[0]
      const reader = new FileReader()

      reader.onload = function (e) {
        const arrayBuffer = e.target?.result // This is the ArrayBuffer

        const compositeOnly = false
        const options = compositeOnly
          ? { skipLayerImageData: true }
          : { skipCompositeImageData: true }
        const psd = readPsd(arrayBuffer as ArrayBuffer, options) // Output the ArrayBuffer
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
  }

  const handleFile = (psd: Psd) => {
    setPsd(psd)
  }

  return (
    <div>
      <label htmlFor="fileInput">File: </label>
      <input
        onChange={handleFileChange}
        id="fileInput"
        className="input"
        type="file"
      ></input>
    </div>
  )
}
