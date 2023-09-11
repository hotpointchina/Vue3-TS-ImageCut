import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { NoticeListParams, } from '/@/views/upms/model/noticeModel';


export interface noticeStateModel {
  isEditing: boolean,
  modal: string,
  id: string,
  editDataInfo: NoticeListParams,
  noticeTzxtDic: any,
}
export const useUpmsNotice = defineStore({
  id: 'upms-notice',
  state: (): noticeStateModel => ({
    isEditing: false,
    modal: 'add',
    id: '',
    editDataInfo:{},
    noticeTzxtDic: [],
  }),
  actions: {
    setEditDataInfo( row:NoticeListParams ){
      this.id = row.id?row.id:''
      this.editDataInfo = {...row};
    },
    resetState(){
      this.isEditing = false;
      this.modal = 'add'
      this.id = ''
      this.editDataInfo = {};
      this.noticeTzxtDic = [];
    }
  }
});

// use outside the setup
export function useUpmsNoticeStoreWithOut() {
  return useUpmsNotice(store);
}
