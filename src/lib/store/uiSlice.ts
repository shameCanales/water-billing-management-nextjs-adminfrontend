import { createSlice } from "@reduxjs/toolkit";

interface InitialUiState {
  isSidebarExpanded: boolean;
}

const initialUiState: InitialUiState = {
  isSidebarExpanded: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
