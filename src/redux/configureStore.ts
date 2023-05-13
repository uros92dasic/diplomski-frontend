import { configureStore } from "@reduxjs/toolkit";
import { setUserReducer } from "./reducers/setUserReducer";
import messageSlice from "./slices/messageSlice";
import { searchReducer } from "./reducers/setProductSearchReducer";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'] // Only persist the 'user' state
};

const rootReducer = combineReducers({
    user: setUserReducer,
    message: messageSlice,
    search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
