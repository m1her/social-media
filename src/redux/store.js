'use client';

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./Features/cart/postsSlice";
import searchReducer from "./Features/search/searchSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    search: searchReducer,
  },
})