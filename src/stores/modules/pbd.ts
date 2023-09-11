import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { OrgSaveParams } from '/@/views/upms/model/pbdOrgModel';
export interface orgStateModel {
  isEditing: boolean;
  editDataInfo: OrgSaveParams;
  addFlag: string;
}
export const useUpmsOrg = defineStore({
  id: 'upms-user',

  state: (): orgStateModel => ({
    isEditing: false,

    editDataInfo: {},

    addFlag: '',
  }),

  actions: {
    setEditDataInfo(row: OrgSaveParams) {
      this.isEditing = true;

      this.editDataInfo = { ...row };
    },

    resetState() {
      this.isEditing = false;

      this.editDataInfo = {};
    },
  },
});

// use outside the setup
export function useUpmsOrgStoreWithOut() {
  return useUpmsOrg(store);
}
