import React from "react"

export const Viewer = ({ file }: ViewerProps) => {
  return (
    <div>
      {file && Object.keys(file)}
      {file && Object.keys(file).length}
    </div>
  )
}

export type ViewerProps = {
  file: Object
}
