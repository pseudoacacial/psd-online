import "./App.css"
import { Counter } from "./components/counter/Counter"
import { Quotes } from "./components/quotes/Quotes"
import { FileInput } from "./components/fileInput/FileInput"
import logo from "./logo.svg"
import { useState } from "react"
import { Viewer, ViewerProps } from "./components/viewer/Viewer"
import { QueryList } from "./components/queryList/queryList"
import { Matches } from "./components/matches/Matches"
import { CssResult } from "./components/CssResult/CssResult"
const App = () => {
  return (
    <div className="App">
      <FileInput />

      <div className="w-full flex overflow-hidden gap-2 p-2">
        <div className="flex-column">
          <QueryList></QueryList>
          <Matches></Matches>
          <CssResult></CssResult>
        </div>

        <Viewer />
      </div>
    </div>
  )
}

export default App
