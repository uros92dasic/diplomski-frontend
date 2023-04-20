import { User } from "../../models/user";
import { SET_USER, SetUserAction } from "../actions/setUserAction";

export interface UserState {
    user: User;
}

const initialState: UserState = {
    user: new User(),
};

export const setUserReducer = (state: UserState = initialState, action: SetUserAction): UserState => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.user,
            };
        default:
            return state;
    }
};
