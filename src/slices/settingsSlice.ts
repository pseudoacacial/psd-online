import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export interface SettingsSliceState {
  groupNameRegex: RegExp["source"]
  prefix: string
  scale: number
}

const initialState: SettingsSliceState = {
  groupNameRegex: "(\\d+x\\d+)",
  prefix: ".b",
  scale: 0.5,
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    modifySettings: (state, action: PayloadAction<SettingsSliceState>) =>
      Object.assign(state, action.payload),
  },
  selectors: {
    selectSettings: settings => settings,
  },
})

export const { modifySettings } = settingsSlice.actions

export const { selectSettings } = settingsSlice.selectors

export default settingsSlice.reducer
