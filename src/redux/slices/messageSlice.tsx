import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

export interface MessageState {
    state: boolean | null;
    options: {
        anchorOrigin: {
            vertical: string;
            horizontal: string;
        };
        autoHideDuration: number;
        message: string;
        variant: string | null;
    };
}

const initialState: MessageState = {
    state: null,
    options: {
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        autoHideDuration: 2000,
        message: 'Message',
        variant: null,
    },
};
const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        showMessage: (state, action) => {
            state.state = true;
            state.options = {
                ...initialState.options,
                ...action.payload,
            };
        },
        hideMessage: (state, action) => {
            state.state = null;
        },
    },
});

export const { hideMessage, showMessage } = messageSlice.actions;

export const selectMessageState = (state: RootState) => state.message.state;

export const selectMessageOptions = (state: RootState) => state.message.options;

export default messageSlice.reducer;
