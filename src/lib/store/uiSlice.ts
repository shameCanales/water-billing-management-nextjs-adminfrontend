import { createSlice } from "@reduxjs/toolkit";

interface InitialUiState {
  mobileNavIsOpen: boolean;
}

const initialUiState: InitialUiState = {
  mobileNavIsOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    openMobileNav: (state) => {
      state.mobileNavIsOpen = true;
    },
    closeMobileNav: (state) => {
      state.mobileNavIsOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
