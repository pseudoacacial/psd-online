import type { MouseEventHandler } from "react"
import type { PsdObject } from "../../slices/documentSlice"

export type ViewerElementProps = {
  element: PsdObject
  offsetRect: {
    top: number | undefined
    left: number | undefined
  }
  handleClick: MouseEventHandler
  isSmartObjectRoot?: boolean
}

export const ViewerElement = ({
  element,
  offsetRect,
  handleClick,
  isSmartObjectRoot = false,
}: ViewerElementProps) => {
  // const container = useRef(null)
  // useEffect(() => {
  //   if (element.canvas) {
  //     container.current.innerHtml = ""
  //     container.current.append(element.canvas)
  //   }
  // }, [container])

  // Determine if this is a smart object artboard
  const isSmartObjectArtboard =
    element.type === "artboard" && element.name?.includes("SmartObject")

  // If this is a smart object artboard or a descendant of one, render absolutely
  // const useAbsolute = isSmartObjectRoot || isSmartObjectArtboard
  const useAbsolute = false

  return (
    <div
      onClick={handleClick}
      className={`element${element.type ? " " + element.type : ""}`}
      data-name={element.name}
      data-id={element.id}
      style={
        element.rect && {
          top:
            element.rect.top !== undefined
              ? useAbsolute
                ? element.rect.top
                : element.rect.top - (offsetRect.top ?? 0)
              : undefined,
          left:
            element.rect.left !== undefined
              ? useAbsolute
                ? element.rect.left
                : element.rect.left - (offsetRect.left ?? 0)
              : undefined,
          width:
            element.rect.right !== undefined && element.rect.left !== undefined
              ? element.rect.right - element.rect.left
              : undefined,
          height:
            element.rect.bottom !== undefined && element.rect.top !== undefined
              ? element.rect.bottom - element.rect.top
              : undefined,
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
          isSmartObjectRoot={useAbsolute}
        ></ViewerElement>
      ))}
    </div>
  )
}
