import { User } from "../../models/user";

export const SET_USER = "SET_USER";

export interface SetUserAction {
    type: typeof SET_USER;
    user: User;
}

export const setUser = (user: User): SetUserAction => {
    return {
        type: SET_USER,
        user,
    };
};
