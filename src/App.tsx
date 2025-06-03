import "./App.css"
import { CssResult } from "./components/cssResult/CssResult"
import { DarkModeButton } from "./components/darkModeButton/DarkModeButton"
import { Export } from "./components/export/Export"
import { FileInput } from "./components/fileInput/FileInput"
import { HelpPanel } from "./components/helpPanel/HelpPanel"
import { QueryList } from "./components/queryList/QueryList"
import { SettingsEditor } from "./components/settingsEditor/SettingsEditor"
import { Viewer } from "./components/viewer/Viewer"
const App = () => {
  return (
    <div className="bg-bg text-main border-main">
      <div className="w-full flex justify-between p-2">
        <FileInput />
        <DarkModeButton />
      </div>

      <div className="w-full flex flex-1 justify-between overflow-hidden gap-2 p-2">
        <div className="flex-column w-[400px]  flex-grow-0">
          <SettingsEditor></SettingsEditor>
          <QueryList></QueryList>
          <Export></Export>
          <CssResult></CssResult>
        </div>

        <div className="flex-1">
          <Viewer />
        </div>
        <HelpPanel></HelpPanel>
      </div>
    </div>
  )
}

export default App
