import { User } from "../../models/user";
import { SET_USER, SetUserAction, CLEAR_USER, ClearUserAction } from "../actions/setUserAction";

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
    action: SetUserAction | ClearUserAction
): UserState => {
    switch (action.type) {
        case SET_USER:
            const setUserAction = action as SetUserAction;
            return {
                ...state,
                user: setUserAction.user,
            };
        case CLEAR_USER:
            return {
                ...state,
                user: initialState.user,
            };
        default:
            return state;
    }
};
