import {
  add,
  remove,
  modify,
  selectDocument,
  PsdObject,
} from "../../slices/documentSlice"

export type ViewerElementProps = {
  element: PsdObject
  offsetRect?: {
    top: number
    left: number
  }
}

export const ViewerElement = ({
  element,
  offsetRect = { top: 0, left: 0 },
}: ViewerElementProps) => {
  return (
    <div
      className={`element${element.type ? " " + element.type : ""}`}
      data-name={element.name}
      style={
        element.rect && {
          top: element.rect.top - offsetRect.top,
          left: element.rect.left - offsetRect.left,
          width:
            element.rect.right !== null &&
            element.rect.left !== null &&
            element.rect.right - element.rect.left,
          height:
            element.rect.bottom !== null &&
            element.rect.top !== null &&
            element.rect.bottom - element.rect.top,
        }
      }
    >
      {/* {element.name} */}
      {element.children?.map(child => (
        <ViewerElement
          key={child.id + child.name}
          element={child}
          offsetRect={{ top: element.rect.top || 0, left: element.rect.left }}
        ></ViewerElement>
      ))}
    </div>
  )
}
