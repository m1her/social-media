"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flag: true,
};

export const PostsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    toggleFlag: (state) => {
      const temp = !state.flag;
      state.flag = temp;
    },
  },
});

export const { toggleFlag } = PostsSlice.actions;

export default PostsSlice.reducer;
