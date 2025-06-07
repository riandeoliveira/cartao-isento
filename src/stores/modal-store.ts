import { create } from "zustand";

type ModalState = {
  contactModal: { isOpen: boolean };
}

type ModalAction = {
  open(modalType: keyof ModalState): void;
  close(modalType: keyof ModalState): void;
}

type ModalStore = ModalState & ModalAction;

export const useModalStore = create<ModalStore>()((set) => ({
  contactModal: { isOpen: false },

  open(modalType: keyof ModalStore): void {
    set(() => ({ [modalType]: { isOpen: true } }));
  },

  close(modalType: keyof ModalStore): void {
    set(() => ({ [modalType]: { isOpen: false } }));
  },
}))
