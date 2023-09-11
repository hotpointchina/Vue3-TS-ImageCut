import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { UserListParams, } from '/@/views/upms/model/baseUserModel';


export interface upmsUserStateModel {
  isEditing: boolean,
  editDataInfo: UserListParams,
}
export const useUpmsUser = defineStore({
  id: 'upms-user',
  state: (): upmsUserStateModel => ({
    isEditing: false,
    editDataInfo:{},
  }),
  actions: {
    setEditDataInfo( row:UserListParams ){
      this.isEditing = true;
      this.editDataInfo = {...row};
    },
    resetState(){
      this.isEditing = false;
      this.editDataInfo = {};
    }
  }
});

// use outside the setup
export function useUpmsUserStoreWithOut() {
  return useUpmsUser(store);
}
