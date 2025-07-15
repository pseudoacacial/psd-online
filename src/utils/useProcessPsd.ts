import type { Layer, Psd } from "ag-psd"
import { readPsd } from "ag-psd"
import { useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import { add, addChild, reset, setThumbnail } from "../slices/documentSlice"

export interface FileElement extends Layer {
  name: string
  id: number
  children: FileElement[]
}

export const useProcessPsd = (psd: Psd | null) => {
  const dispatch = useAppDispatch()

  const checkChildren = (
    object: FileElement,
    parentIdPath: number[],
    parentNamePath: string[],
    artboardId: number | null,
    psdRef?: Psd,
    originalPsd?: Psd,
    parentRect?: { left: number; top: number; right: number; bottom: number },
    absolutePositioning?: boolean,
  ) => {
    //is layer if
    const isLayer =
      //has no children
      !object.children ||
      object.children.length < 1 ||
      //or is a text or raster
      object.text ||
      object.placedLayer

    // Compute the global rect for this object
    const globalLeft =
      (parentRect?.left ?? 0) + (object.left ?? (object as any).rect?.left ?? 0)
    const globalTop =
      (parentRect?.top ?? 0) + (object.top ?? (object as any).rect?.top ?? 0)
    const globalRight =
      (parentRect?.left ?? 0) +
      (object.right ?? (object as any).rect?.right ?? 0)
    const globalBottom =
      (parentRect?.top ?? 0) +
      (object.bottom ?? (object as any).rect?.bottom ?? 0)
    const rectToUse = {
      left: globalLeft,
      top: globalTop,
      right: globalRight,
      bottom: globalBottom,
    }
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
          canvas: object.canvas?.toDataURL("image/webp"),
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
              rect: absolutePositioning
                ? rectToUse // For smart object descendants, always use absolute rect
                : isLayer
                  ? rectToUse
                  : {
                      top: undefined,
                      left: undefined,
                      right: undefined,
                      bottom: undefined,
                    },
              children: [],
              canvas: object.canvas?.toDataURL("image/webp"),
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
            rect: absolutePositioning
              ? rectToUse // For smart object descendants, always use absolute rect
              : isLayer
                ? rectToUse
                : {
                    top: undefined,
                    left: undefined,
                    right: undefined,
                    bottom: undefined,
                  },
            children: [],
            canvas: object.canvas?.toDataURL("image/webp"),
          }),
        )
      }
    }

    if (object.children !== undefined) {
      object.children.forEach(child => {
        checkChildren(
          child,
          [...parentIdPath, object.id],
          [...parentNamePath, object.name],
          object.artboard ? object.id : artboardId,
          psdRef,
          originalPsd,
          rectToUse, // pass the current object's global rect as parentRect
          absolutePositioning, // propagate absolute mode
        )
      })
    }

    // --- Linked file logic ---
    if (
      object.placedLayer &&
      psdRef &&
      Array.isArray((psdRef as any).linkedFiles) &&
      originalPsd &&
      psdRef === originalPsd &&
      parentIdPath.length === 0
    ) {
      const placedLayerId = (object.placedLayer as any).id
      if (placedLayerId !== undefined) {
        const linkedFile = (psdRef as any).linkedFiles.find(
          (f: any) => f.id === placedLayerId,
        )
        if (linkedFile && linkedFile.data) {
          try {
            const linkedPsd = readPsd(linkedFile.data)
            if (linkedPsd && Array.isArray(linkedPsd.children)) {
              const smartObjectGroupId = object.id + 1000000 + placedLayerId
              const smartObjectGroupRect = {
                left: object.left ?? 0,
                right: object.right ?? 0,
                top: object.top ?? 0,
                bottom: object.bottom ?? 0,
              }
              const smartObjectGroupName =
                (object.name || "") + " (SmartObject)"
              dispatch(
                add({
                  id: smartObjectGroupId,
                  artboardId: smartObjectGroupId,
                  idPath: [],
                  namePath: [],
                  name: smartObjectGroupName,
                  type: "artboard",
                  rect: smartObjectGroupRect,
                  children: [],
                  canvas: object.canvas?.toDataURL("image/webp"),
                }),
              )
              linkedPsd.children.forEach((linkedChild: any) => {
                checkChildren(
                  linkedChild as FileElement,
                  [smartObjectGroupId],
                  [smartObjectGroupName],
                  smartObjectGroupId,
                  linkedPsd,
                  originalPsd,
                  smartObjectGroupRect,
                  true,
                )
              })
            }
          } catch (e) {
            console.error("Failed to process linked PSD for placedLayer", e)
          }
        }
      }
    }
    // --- End linked file logic ---
  }

  useEffect(() => {
    if (!psd) return
    dispatch(reset())
    if (psd.children === undefined) {
      throw new Error("PSD file has no children. Is it a valid psd document?")
    }

    const thumbnail = psd.canvas?.toDataURL("image/webp")

    dispatch(setThumbnail(thumbnail))

    psd.children.forEach(element => {
      checkChildren(element as FileElement, [], [], null, psd, psd)
    })
    console.log(psd)
  }, [psd, dispatch])

  // Helper to extract the best available rect from an object
  function getRect(obj: any) {
    if (
      obj.rect &&
      (obj.rect.left !== undefined ||
        obj.rect.top !== undefined ||
        obj.rect.right !== undefined ||
        obj.rect.bottom !== undefined)
    ) {
      return obj.rect
    }
    if (
      obj.left !== undefined ||
      obj.top !== undefined ||
      obj.right !== undefined ||
      obj.bottom !== undefined
    ) {
      return {
        left: obj.left,
        right: obj.right,
        top: obj.top,
        bottom: obj.bottom,
      }
    }
    return undefined
  }
}
