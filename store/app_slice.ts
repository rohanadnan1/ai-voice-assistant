import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displaySettings: false,
    recording: false
}

const app_slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleSettings: (state) => {
            state.displaySettings = !state.displaySettings;
        },
        setRecording: (state, action) => {
            state.recording = action.payload;
        }
    }
})

export const { toggleSettings,  setRecording } = app_slice.actions;
export default app_slice.reducer;