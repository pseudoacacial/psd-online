import "./App.css"
import { FileInput } from "./components/fileInput/FileInput"
import logo from "./logo.svg"
import { useState } from "react"
import { Viewer, ViewerProps } from "./components/viewer/Viewer"
import { QueryList } from "./components/queryList/QueryList"
import { Matches } from "./components/matches/Matches"
import { CssResult } from "./components/CssResult/CssResult"
import { Export } from "./components/export/Export"
const App = () => {
  return (
    <div className="App">
      <FileInput />

      <div className="w-full flex overflow-hidden gap-2 p-2">
        <div className="flex-column">
          <QueryList></QueryList>
          <Export></Export>
          <CssResult></CssResult>
        </div>

        <Viewer />
      </div>
    </div>
  )
}

export default App
