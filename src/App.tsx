import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import { FileInput, FileInputProps } from "./features/fileInput/FileInput"
import logo from "./logo.svg"
import { useState } from "react"
import { Viewer, ViewerProps } from "./features/viewer/Viewer"

const App = () => {
  const [psd, setPsd] = useState({})

  const handleFile: FileInputProps["handleFile"] = psd => {
    setPsd(psd)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FileInput handleFile={handleFile} />
        <Viewer file={psd} />
        <Counter />

        <Quotes />
      </header>
    </div>
  )
}

export default App
