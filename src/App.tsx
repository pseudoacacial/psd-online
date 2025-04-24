import "./App.css"
import { Counter } from "./components/counter/Counter"
import { Quotes } from "./components/quotes/Quotes"
import { FileInput, FileInputProps } from "./components/fileInput/FileInput"
import logo from "./logo.svg"
import { useState } from "react"
import { Viewer, ViewerProps } from "./components/viewer/Viewer"

const App = () => {
  const [psd, setPsd] = useState({})

  const handleFile: FileInputProps["handleFile"] = psd => {
    setPsd(psd)
  }

  return (
    <div className="App">
      <FileInput handleFile={handleFile} />
      <Viewer file={psd} />
    </div>
  )
}

export default App
