import { defineStore } from 'pinia';
import { TypeListParams } from '/@/views/upms/model/dictTypeModel';

export interface typeStateModel {
  isEditing: boolean;
  editDataInfo: TypeListParams;
  code: string;
}

export const useUpmsType = defineStore({
  id: 'upms-user',
  state: (): typeStateModel => ({
    isEditing: false,
    editDataInfo: {},
    code: '',
  }),
  actions: {
    //获取字典code
    getCode(row: TypeListParams) {
      this.code = row.code as string;
    },
    setEditDataInfo(row: TypeListParams) {
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
