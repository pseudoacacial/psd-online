import { add, remove, modify, selectDocument, PsdObject } from "./documentSlice"

export type ElementProps = {
  element: PsdObject
}

export const Element = ({ element }: ElementProps) => {
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
        <Element key={element.id + element.name} element={child}></Element>
      ))}
    </div>
  )
}
