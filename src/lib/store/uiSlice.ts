import { createSlice } from "@reduxjs/toolkit";

interface InitialUiState {
  isSidebarExpanded: boolean;
  mobileSidebarIsOpen: boolean;
  addConsumerModalIsOpen: boolean;
  editConsumerModalIsOpen: boolean;
}

const initialUiState: InitialUiState = {
  isSidebarExpanded: true,
  mobileSidebarIsOpen: false,
  addConsumerModalIsOpen: false,
  editConsumerModalIsOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    expandSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    openMobileSidebar: (state) => {
      state.mobileSidebarIsOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarIsOpen = false;
    },
    openAddConsumerModal: (state) => {
      state.addConsumerModalIsOpen = true;
    },
    closeAddConsumerModal: (state) => {
      state.addConsumerModalIsOpen = false;
    },
    openEditConsumerModal: (state) => {
      state.editConsumerModalIsOpen = true;
    },
    closeEditConsumerModal: (state) => {
      state.editConsumerModalIsOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
