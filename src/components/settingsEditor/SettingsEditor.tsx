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
    <div className="flex flex-col gap-1 py-1">
      <div className="flex border border-main rounded justify-start">
        <input
          className="rounded-l"
          id="groupNameRegex"
          value={groupNameRegex.toString()}
          onChange={handleChange}
          onBlur={handleGroupNameRegexBlur}
        ></input>
        <label
          className="whitespace-nowrap px-1 rounded-r text-left"
          htmlFor="groupNameRegex"
        >
          Group name regex
        </label>
      </div>
      <div className="flex border border-main rounded justify-start">
        <input
          className="rounded-l"
          id="prefix"
          value={prefix}
          onChange={handlePrefixChange}
          onBlur={handlePrefixBlur}
        ></input>
        <label
          className="whitespace-nowrap px-1 rounded-r text-left"
          htmlFor="prefix"
        >
          prefix
        </label>
      </div>
    </div>
  )
}
