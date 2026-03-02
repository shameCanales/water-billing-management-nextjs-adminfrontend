import { createSlice } from "@reduxjs/toolkit";

interface InitialUiState {
  isSidebarExpanded: boolean;
  mobileSidebarIsOpen: boolean;
  addConsumerModalIsOpen: boolean;
  editConsumerModalIsOpen: boolean;
  deleteConsumerModalIsOpen: boolean;
  editConnectionModalIsOpen: boolean;
  deleteConnectionModalIsOpen: boolean;
  addConnectionModalIsOpen: boolean;
  addBillModalIsOpen: boolean;
  editBillModalIsOpen: boolean;
  deleteBillModalIsOpen: boolean;
  viewBillDetailsModalIsOpen: boolean;
  addProcessorModalIsOpen: boolean;
}

const initialUiState: InitialUiState = {
  isSidebarExpanded: true,
  mobileSidebarIsOpen: false,

  // consumer modals
  addConsumerModalIsOpen: false,
  editConsumerModalIsOpen: false,
  deleteConsumerModalIsOpen: false,

  // connection modals
  addConnectionModalIsOpen: false,
  editConnectionModalIsOpen: false,
  deleteConnectionModalIsOpen: false,

  //bill modals
  addBillModalIsOpen: false,
  editBillModalIsOpen: false,
  deleteBillModalIsOpen: false,
  viewBillDetailsModalIsOpen: false,
  addProcessorModalIsOpen: false,
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
      state.deleteConnectionModalIsOpen = true;
    },
    closeDeleteConnectionModal: (state) => {
      state.deleteConnectionModalIsOpen = false;
    },
    openAddConnectionModal: (state) => {
      state.addConnectionModalIsOpen = true;
    },
    closeAddConnectionModal: (state) => {
      state.addConnectionModalIsOpen = false;
    },

    // bill Modals
    openAddBillModal: (state) => {
      state.addBillModalIsOpen = true;
    },
    closeAddBillModal: (state) => {
      state.addBillModalIsOpen = false;
    },
    openViewBillDetailsModal: (state) => {
      state.viewBillDetailsModalIsOpen = true;
    },
    closeViewBillDetailsModal: (state) => {
      state.viewBillDetailsModalIsOpen = false;
    },

    // processor modals
    openAddProcessorModal: (state) => {
      state.addProcessorModalIsOpen = true;
    },
    closeAddProcessorModal: (state) => {
      state.addProcessorModalIsOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
