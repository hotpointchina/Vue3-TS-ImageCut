import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { AddressListParams } from '/@/views/upms/model/doneeModel';

export interface addressStateModel {
  isEditing: boolean;
  modal: string;
  editDataInfo: AddressListParams;
  activityId: string;
  id : string;
}
export const useUpmsAddress = defineStore({
  id: 'upms-address',
  state: (): addressStateModel => ({
    isEditing: false,
    modal: 'add',
    editDataInfo: {},
    activityId :'',
    id:'',
  }),
  actions: {
    setEditDataInfo(row: AddressListParams) {
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
export function useUpmsAddressStoreWithOut() {
  return useUpmsAddress(store);
}
