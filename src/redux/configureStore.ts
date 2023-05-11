import { configureStore } from "@reduxjs/toolkit";
import { setUserReducer } from "./reducers/setUserReducer";
import messageSlice from "./slices/messageSlice";
import { searchReducer } from "./reducers/setProductSearchReducer";

export const store = configureStore({
    reducer: {
        user: setUserReducer,
        message: messageSlice,
        search: searchReducer,
    },
});
