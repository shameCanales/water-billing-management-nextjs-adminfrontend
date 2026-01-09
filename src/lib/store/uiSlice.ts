import { createSlice } from "@reduxjs/toolkit";

interface InitialUiState {
  isSidebarExpanded: boolean;
  mobileSidebarIsOpen: boolean;
  addConsumerModalIsOpen: boolean;
  editConsumerModalIsOpen: boolean;
  deleteConsumerModalIsOpen: boolean;
  editConnectionModalIsOpen: boolean;
  openDeleteConnectionModal: boolean;
  addConnectionModalisOpen: boolean;
}

const initialUiState: InitialUiState = {
  isSidebarExpanded: true,
  mobileSidebarIsOpen: false,

  // consumer modals
  addConsumerModalIsOpen: false,
  editConsumerModalIsOpen: false,
  deleteConsumerModalIsOpen: false,

  // connection modals
  addConnectionModalisOpen: false,
  editConnectionModalIsOpen: false,
  openDeleteConnectionModal: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleExpandSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    expandSidebar: (state) => {
      if (state.isSidebarExpanded === true) return;
      state.isSidebarExpanded = true;
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

    // connection modals
    openEditConnectionModal: (state) => {
      state.editConnectionModalIsOpen = true;
    },
    closeEditConnectionModal: (state) => {
      state.editConnectionModalIsOpen = false;
    },
    openDeleteConnectionModal: (state) => {
      state.openDeleteConnectionModal = true;
    },
    closeDeleteConnectionModal: (state) => {
      state.openDeleteConnectionModal = false;
    },
    openAddConnectionModal: (state) => {
      state.addConnectionModalisOpen = true;
    },
    closeAddConnectionModal: (state) => {
      state.addConnectionModalisOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
