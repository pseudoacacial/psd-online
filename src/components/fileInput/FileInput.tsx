import type { Layer, Psd } from "ag-psd"
import { readPsd } from "ag-psd"
import { useState } from "react"

import { useProcessPsd } from "../../utils/useProcessPsd"

export interface FileElement extends Layer {
  name: string
  id: number
  children: FileElement[]
}

export const FileInput = () => {
  const [psd, setPsd] = useState<Psd | null>(null)
  useProcessPsd(psd)

  const handleFileChange = (event: React.ChangeEvent) => {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()

      reader.onload = function (e) {
        const arrayBuffer = e.target?.result
        if (!arrayBuffer) return

        const compositeOnly = false
        const options = compositeOnly
          ? { skipLayerImageData: true }
          : { skipCompositeImageData: true }
        const psd = readPsd(arrayBuffer as ArrayBuffer, options)
        setPsd(psd)
      }

      reader.onerror = function (e) {
        console.error("Error reading file", e)
      }

      reader.readAsArrayBuffer(file)
    } else {
      console.log("No file selected")
    }
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
