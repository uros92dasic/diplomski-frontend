import { User } from "../../models/user";
import { SET_USER, SetUserAction } from "../actions/setUserAction";
import { AnyAction } from "redux";

export interface UserState {
    user: User;
}

const initialState: UserState = {
    user: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: {
            id: 0,
            name: "",
            rolePermissions: [],
        },
    },
};

export const setUserReducer = (
    state: UserState = initialState,
    action: AnyAction
): UserState => {
    switch (action.type) {
        case SET_USER:
            const setUserAction = action as SetUserAction;
            return {
                ...state,
                user: setUserAction.user,
            };
        default:
            return state;
    }
};
