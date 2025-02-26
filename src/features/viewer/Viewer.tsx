import { useEffect } from "react"

export const Viewer = ({ file }: ViewerProps) => {
  const checkChildren = (object: { children?: {} }) => {
    if (object.children === undefined) {
      console.log(object)
      const coords = {
        top: object.top,
        right: object.right,
        bottom: object.bottom,
        left: object.left,
      }
      draw(coords)
    } else {
      object.children.forEach(child => {
        console.log("checking", child)
        checkChildren(child)
      })
    }
  }

  const draw = (coords: {
    top: Number
    right: Number
    bottom: Number
    left: Number
  }) =>
    console.log("drawing", coords.top, coords.right, coords.bottom, coords.left)

  // useEffect(()=> {
  //   checkChildren
  // }, [])
  console.log(file)

  checkChildren(file)

  return (
    <div>
      {Object.keys(file)}
      {Object.keys(file).length}
    </div>
  )
}

export type ViewerProps = {
  file: Object
}
