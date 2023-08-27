import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export type MarkdownStateProps = {
    title: string;
    text: string;
}

const initialState: MarkdownStateProps = {
    title: "",
    text: "",
};

const markdownSlice = createSlice({
    name: "markdown",
    initialState: initialState,
    reducers: {
        updateMarkdown: (state, action: { payload: MarkdownStateProps}) => (
            {
                ...state,
                title: action.payload.title,
                text: action.payload.text,
            }
        ),
    },
});

const persistConfig = {
    key: "root",
    storage,
};
  
const persistedReducer = persistReducer(persistConfig, markdownSlice.reducer);
  
export const { updateMarkdown } = markdownSlice.actions;
export default persistedReducer;