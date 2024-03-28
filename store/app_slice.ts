import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displaySettings: false,
}

const app_slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleSettings: (state) => {
            state.displaySettings = !state.displaySettings;
        }
    }
})

export const { toggleSettings } = app_slice.actions;
export default app_slice.reducer;