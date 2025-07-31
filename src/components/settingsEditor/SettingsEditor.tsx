import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { SettingsSliceState } from "../../slices/settingsSlice"
import {
  initialState as initialSettings,
  modifySettings,
  resetSettings,
  selectSettings,
} from "../../slices/settingsSlice"
import { SettingsEditorInput } from "../settingsEditorInput/SettingsEditorInput"
export const SettingsEditor = () => {
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()

  const [groupNameRegex, setGroupNameRegex] = useState(settings.groupNameRegex)
  const [prefix, setPrefix] = useState(settings.prefix)
  const [scale, setScale] = useState(settings.scale)
  const updateSettingsState = (settings: SettingsSliceState["settings"]) => {
    setGroupNameRegex(settings.groupNameRegex)
    setPrefix(settings.prefix)
    setScale(settings.scale)
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupNameRegex(event.target.value)
  }

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(event.target.value)
  }

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(event.target.value))
    // if using arrows, input is not focused. In this case, dispatch an update on change, instead of on blur.
    if (event.target !== document.activeElement) {
      dispatch(
        modifySettings({
          groupNameRegex: groupNameRegex,
          prefix: prefix,
          scale: Number(event.target.value),
        }),
      )
    }
  }

  const handleSettingsBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatch(
      modifySettings({
        groupNameRegex: groupNameRegex,
        prefix: prefix,
        scale: scale,
      }),
    )
  }
  const handlePrefixBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatch(
      modifySettings({
        groupNameRegex: groupNameRegex,
        prefix: event.target.value,
        scale: scale,
      }),
    )
  }
  const handleClearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.confirm("clear settings?")) {
      dispatch(resetSettings())
      updateSettingsState(initialSettings.settings)
    }
  }

  return (
    <div className="flex flex-col gap-1 py-1">
      <button className="border hover:bg-bg-1" onClick={handleClearClick}>
        clear
      </button>
      <SettingsEditorInput
        value={groupNameRegex}
        onChange={handleChange}
        onBlur={handleSettingsBlur}
        label="Group name regex"
      />
      <SettingsEditorInput
        value={prefix}
        onChange={handlePrefixChange}
        onBlur={handlePrefixBlur}
        label="Prefix"
      />
      <SettingsEditorInput
        value={scale.toString()}
        onChange={handleScaleChange}
        onBlur={handleSettingsBlur}
        label="Scale"
        type="number"
      />
    </div>
  )
}
