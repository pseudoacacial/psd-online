import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { modifySettings } from "../../slices/settingsSlice"
import { selectSettings } from "../../slices/settingsSlice"
export const SettingsEditor = () => {
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()
  const [groupNameRegex, setGroupNameRegex] = useState(settings.groupNameRegex)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupNameRegex(event.target.value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatch(modifySettings({ groupNameRegex: event.target.value }))
  }

  return (
    <div>
      <div className="flex">
        <input
          id="groupNameRegex"
          value={groupNameRegex.toString()}
          onChange={handleChange}
          onBlur={handleBlur}
        ></input>
        <label htmlFor="groupNameRegex">Group name regex</label>
      </div>
    </div>
  )
}
