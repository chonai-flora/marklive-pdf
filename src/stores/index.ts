import persistStore from "redux-persist/es/persistStore";

import{ configureStore } from "@reduxjs/toolkit";

import markdownSlice from "../slices/markdown-slice";

const store = configureStore({
  reducer: {
    markdown: markdownSlice,
  },
});

export const persistor = persistStore(store);
export default store;