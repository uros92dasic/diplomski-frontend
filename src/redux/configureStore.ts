import { configureStore } from "@reduxjs/toolkit";
import { setUserReducer } from "./reducers/setUserReducer";

export const store = configureStore({
    reducer: {
        user: setUserReducer,
    },
});
