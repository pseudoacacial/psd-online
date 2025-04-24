import {
  add,
  remove,
  modify,
  selectDocument,
  PsdObject,
} from "../viewer/documentSlice"

export type ViewerElementProps = {
  element: PsdObject
}

export const ViewerElement = ({ element }: ViewerElementProps) => {
  return (
    <div
      className={`element${element.type ? " " + element.type : ""}`}
      style={
        element.rect && {
          top: element.rect.top,
          left: element.rect.left,
          width: element.rect.right - element.rect.left,
          height: element.rect.bottom - element.rect.top,
        }
      }
    >
      {/* {element.name} */}
      {element.children?.map(child => (
        <ViewerElement
          key={element.id + element.name}
          element={child}
        ></ViewerElement>
      ))}
    </div>
  )
}
