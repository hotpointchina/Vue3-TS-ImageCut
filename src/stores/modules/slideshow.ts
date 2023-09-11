import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { SlideshowListParams } from '/@/views/upms/model/slideshowModel';

export interface slideshowStateModel {
  isEditing: boolean;
  modal: string;
  editDataInfo: SlideshowListParams;
}
export const useUpmsSlideshow = defineStore({
  id: 'slideshow',
  state: (): slideshowStateModel => ({
    isEditing: false,
    modal: 'add',
    editDataInfo: {},
  }),
  actions: {
    setEditDataInfo(row: SlideshowListParams) {
      this.isEditing = true;
      this.modal = 'modify';
      this.editDataInfo = { ...row };
    },
    resetState() {
      this.isEditing = false;
      this.modal = 'add';
      this.editDataInfo = {};
    },
  },
});

// use outside the setup
export function useUpmsSlideshowStoreWithOut() {
  return useUpmsSlideshow(store);
}
