"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  term: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateSearchTerm: (state, action) => {
      state.term = action.payload;
    },
    clearSearchTerm: (state) => {
      state.term = "";
    },
  },
});

export const { updateSearchTerm, clearSearchTerm } = searchSlice.actions;

export default searchSlice.reducer;
