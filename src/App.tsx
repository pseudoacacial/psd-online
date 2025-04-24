import "./App.css"
import { Counter } from "./components/counter/Counter"
import { Quotes } from "./components/quotes/Quotes"
import { FileInput, FileInputProps } from "./components/fileInput/FileInput"
import logo from "./logo.svg"
import { useState } from "react"
import { Viewer, ViewerProps } from "./components/viewer/Viewer"
import { SelectorsList } from "./components/selectorsList/SelectorsList"

const App = () => {
  const [psd, setPsd] = useState(null)

  const handleFile: FileInputProps["handleFile"] = psd => {
    setPsd(psd)
  }

  return (
    <div className="App">
      <FileInput handleFile={handleFile} />

      <div className="w-full flex overflow-hidden gap-2 p-2">
        <SelectorsList></SelectorsList>
        <Viewer file={psd} />
      </div>
    </div>
  )
}

export default App
