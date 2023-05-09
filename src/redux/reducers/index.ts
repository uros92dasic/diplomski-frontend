import { UserState } from "./setUserReducer";
import { MessageState } from "../slices/messageSlice";

export interface RootState {
    user: UserState;
    message: MessageState;
}
