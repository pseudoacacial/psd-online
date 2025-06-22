import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export interface SettingsSliceState {
  settings: {
    groupNameRegex: RegExp["source"]
    prefix: string
    scale: number
  }
}

export const initialState: SettingsSliceState = {
  settings: {
    groupNameRegex: "(\\d+x\\d+)",
    prefix: ".b",
    scale: 0.5,
  },
}

const localSettings = localStorage.getItem("settings")

export const settingsSlice = createSlice({
  name: "settings",
  initialState: localSettings
    ? { settings: JSON.parse(localSettings) }
    : initialState,
  reducers: {
    modifySettings: (
      state,
      action: PayloadAction<SettingsSliceState["settings"]>,
    ) => {
      localStorage.setItem("settings", JSON.stringify(action.payload))
      Object.assign(state.settings, action.payload)
    },
    resetSettings: (state, action: PayloadAction<void>) => {
      localStorage.removeItem("settings")
      state.settings = { ...initialState.settings }
    },
  },
  selectors: {
    selectSettings: state => state.settings,
  },
})

export const { modifySettings, resetSettings } = settingsSlice.actions

export const { selectSettings } = settingsSlice.selectors

export default settingsSlice.reducer
