import { createSlice } from "@reduxjs/toolkit";

interface InitialUiState {
  isSidebarExpanded: boolean;
  mobileSidebarIsOpen: boolean;
  addConsumerModalIsOpen: boolean;
  editConsumerModalIsOpen: boolean;
  deleteConsumerModalIsOpen: boolean;
}

const initialUiState: InitialUiState = {
  isSidebarExpanded: true,
  mobileSidebarIsOpen: false,
  addConsumerModalIsOpen: false,
  editConsumerModalIsOpen: false,
  deleteConsumerModalIsOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleExpandSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    // Mobile Sidebar
    openMobileSidebar: (state) => {
      state.mobileSidebarIsOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarIsOpen = false;
    },
    // consumer modals
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
    openDeleteConsumerModal: (state) => {
      state.deleteConsumerModalIsOpen = true;
    },
    closeDeleteConsumerModal: (state) => {
      state.deleteConsumerModalIsOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
