import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Modal } from '~types/Modal';

interface ModalState {
  modal: Modal | null;
  isOpen: boolean;
}

const initialState: ModalState = {
  modal: null,
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Modal>) => {
      state.modal = action.payload;
      state.isOpen = true;
    },
    hideModal: (state) => {
      state.modal = null;
      state.isOpen = false;
    },
  },
});

export const { openModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
