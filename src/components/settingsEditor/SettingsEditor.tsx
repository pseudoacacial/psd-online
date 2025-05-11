import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { modifySettings } from "../../slices/settingsSlice"
import { selectSettings } from "../../slices/settingsSlice"
export const SettingsEditor = () => {
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()
  const [groupNameRegex, setGroupNameRegex] = useState(settings.groupNameRegex)
  const [prefix, setPrefix] = useState(settings.prefix)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupNameRegex(event.target.value)
  }

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(event.target.value)
  }

  const handleGroupNameRegexBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    dispatch(
      modifySettings({ groupNameRegex: event.target.value, prefix: prefix }),
    )
  }
  const handlePrefixBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatch(
      modifySettings({
        groupNameRegex: groupNameRegex,
        prefix: event.target.value,
      }),
    )
  }

  return (
    <div>
      <div className="flex">
        <input
          id="groupNameRegex"
          value={groupNameRegex.toString()}
          onChange={handleChange}
          onBlur={handleGroupNameRegexBlur}
        ></input>
        <label htmlFor="groupNameRegex">Group name regex</label>
      </div>
      <div className="flex">
        <input
          id="prefix"
          value={prefix}
          onChange={handlePrefixChange}
          onBlur={handlePrefixBlur}
        ></input>
        <label htmlFor="prefix">prefix</label>
      </div>
    </div>
  )
}
