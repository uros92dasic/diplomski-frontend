import { UserState } from "./setUserReducer";
import { MessageState } from "../slices/messageSlice";
import { SearchState } from "./setProductSearchReducer";

export interface RootState {
    user: UserState;
    message: MessageState;
    search: SearchState;
}
