import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "@reduxjs/toolkit"

export interface SettingsSliceState {
  groupNameRegex: RegExp["source"]
}

const initialState: SettingsSliceState = {
  groupNameRegex: "(\\d+x\\d+)",
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
