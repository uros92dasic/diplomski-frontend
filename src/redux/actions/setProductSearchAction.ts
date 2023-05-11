export const SET_SEARCH_TERM = "SET_SEARCH_TERM";
export const CLEAR_SEARCH_TERM = "CLEAR_SEARCH_TERM";

export interface SetSearchTermAction {
    type: typeof SET_SEARCH_TERM;
    searchTerm: string;
}

export interface ClearSearchTermAction {
    type: typeof CLEAR_SEARCH_TERM;
}

export const setSearchTerm = (searchTerm: string): SetSearchTermAction => {
    return {
        type: SET_SEARCH_TERM,
        searchTerm,
    };
};

export const clearSearchTerm = (): ClearSearchTermAction => {
    return {
        type: CLEAR_SEARCH_TERM,
    };
};
