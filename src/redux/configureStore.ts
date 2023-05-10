import { configureStore } from "@reduxjs/toolkit";
import { setUserReducer } from "./reducers/setUserReducer";
import messageSlice from "./slices/messageSlice";

export const store = configureStore({
    reducer: {
        user: setUserReducer,
        message: messageSlice,
    },
});
