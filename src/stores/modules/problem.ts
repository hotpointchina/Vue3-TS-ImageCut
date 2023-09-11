import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { ProblemListParams } from '/@/views/upms/model/problem';

export interface problemStateModel {
  isEditing: boolean;
  modal: string;
  editDataInfo: ProblemListParams;
}
export const useUpmsProblem = defineStore({
  id: 'problem',
  state: (): problemStateModel => ({
    isEditing: false,
    modal: 'add',
    editDataInfo: {},
  }),
  actions: {
    setEditDataInfo(row: ProblemListParams) {
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
export function useUpmsProblemStoreWithOut() {
  return useUpmsProblem(store);
}
