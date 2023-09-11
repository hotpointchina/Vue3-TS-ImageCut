import { defineStore } from 'pinia';

import { store } from '/@/stores';
import { getGenTable } from '/@/api/codeGeneration/index';
import * as typeModel from '/@/views/upms/pages/code-generation/edit-table/model/typeModel';

export interface GenerationState {
  editTableId: string,
  closeState: boolean,
  EditDataInfo: object,
  EditDataRow: typeModel.TableDataType[]
}


export const useCodeGeneration = defineStore({
  id: 'code-generation',
  state: (): GenerationState => ({
    editTableId:'',
    closeState: false,
    EditDataInfo:{},
    EditDataRow:[],
  }),
  getters: {

  },
  actions: {
    setEditTableId(id:string){
      if( !id ){return console.log('id 不能为空')}
      this.editTableId = id;
    },
    setCloseState(sta:boolean){
      this.closeState = sta
    },
    // 查询表详细信息
    async getGenTable (tableId) {
      const res = await getGenTable(tableId) as typeModel.EditData;
      Object.keys( res.info ).forEach(key=>{
        res.info[key] = res.info[key] == null ? '' : res.info[key];
      });
      this.EditDataInfo = res.info;
      this.EditDataRow = res.rows;
      return res;
    },
    // 页面关闭，清空 store
    repealStore(){
      this.editTableId = '';
      this.closeState = false;
      this.EditDataInfo = {};
      this.EditDataRow.length = 0;
    },
  }
});

// use outside the setup
export function useCodeGenerationStoreWithOut() {
  return useCodeGeneration(store);
}
