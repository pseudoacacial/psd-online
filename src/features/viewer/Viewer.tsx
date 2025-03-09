import { useEffect } from "react"
import { useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { add, remove, modify } from "./documentSlice"

export const Viewer = ({ file }: ViewerProps) => {
  const dispatch = useAppDispatch()
  const checkChildren = (object: { children?: {} }) => {
    const coords = {
      top: object.top,
      right: object.right,
      bottom: object.bottom,
      left: object.left,
    }
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
      console.log(object.artboard.rect)
      console.log("adding to state")
      console.log(object)
      console.log(object)

      dispatch(add({ id: object.name, rect: object.artboard.rect }))

      setElements(n => [...n, { rect: object.artboard.rect }])
    }

    console.log("drawing")
  }

  const [elements, setElements] = useState<[]>([])

  useEffect(() => {
    setElements([])
    checkChildren(file)
  }, [file])

  return (
    <div className="viewer">
      {elements.map((element, index) => {
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
      })}
    </div>
  )
}

export type ViewerProps = {
  file: Object
}
