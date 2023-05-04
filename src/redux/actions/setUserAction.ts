import { User } from "../../models/user";

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export interface SetUserAction {
    type: typeof SET_USER;
    user: User;
}

export interface ClearUserAction {
    type: typeof CLEAR_USER;
}

export const setUser = (user: User): SetUserAction => {
    return {
        type: SET_USER,
        user,
    };
};

export const clearUser = (): ClearUserAction => {
    return {
        type: CLEAR_USER,
    };
};