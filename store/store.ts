import { configureStore } from "@reduxjs/toolkit";
import app_reducer from "@/store/app_slice";

const store = configureStore({
    reducer: {
        app: app_reducer,
    },
})

export default store;