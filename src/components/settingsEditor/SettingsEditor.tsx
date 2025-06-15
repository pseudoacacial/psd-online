import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { modifySettings, selectSettings } from "../../slices/settingsSlice"
import { SettingsEditorInput } from "../settingsEditorInput/SettingsEditorInput"
export const SettingsEditor = () => {
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()
  const [groupNameRegex, setGroupNameRegex] = useState(settings.groupNameRegex)
  const [prefix, setPrefix] = useState(settings.prefix)
  const [scale, setScale] = useState(settings.scale)
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
          scale: scale,
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

  return (
    <div className="flex flex-col gap-1 py-1">
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
