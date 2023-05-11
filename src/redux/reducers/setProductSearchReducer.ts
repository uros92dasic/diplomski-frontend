import { SET_SEARCH_TERM, SetSearchTermAction, CLEAR_SEARCH_TERM, ClearSearchTermAction } from "../actions/setProductSearchAction";

export interface SearchState {
    searchTerm: string;
}

const initialState: SearchState = {
    searchTerm: "",
};

export const searchReducer = (
    state: SearchState = initialState,
    action: SetSearchTermAction | ClearSearchTermAction
): SearchState => {
    switch (action.type) {
        case SET_SEARCH_TERM:
            const setSearchTermAction = action as SetSearchTermAction;
            return {
                ...state,
                searchTerm: setSearchTermAction.searchTerm,
            };
        case CLEAR_SEARCH_TERM:
            return {
                ...state,
                searchTerm: initialState.searchTerm,
            };
        default:
            return state;
    }
};
