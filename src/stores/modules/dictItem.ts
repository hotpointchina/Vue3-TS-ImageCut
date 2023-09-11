import { defineStore } from 'pinia';
import { ItemListParams, ItemSaveParams } from '/@/views/upms/model/dictItemModel';
import { TypeListParams } from '/@/views/upms/model/dictTypeModel';
import { ElMessage, FormInstance } from 'element-plus';
import { editItem, saveItem } from '/@/views/upms/api/dictItem';

export interface itemStateModel {
  isEditing: boolean;
  addShow: boolean;
  editDataInfo: ItemListParams;
  itemInfo: TypeListParams;
  typeCode: string;
}

export const useUpmsItem = defineStore({
  id: 'dictItem',
  state: (): itemStateModel =>
    <itemStateModel>{
      isEditing: false,
      addShow: false,
      editDataInfo: {},
      itemInfo: {},
    },

  actions: {
    setEditItemDataInfo(row: ItemListParams) {
      this.isEditing = true;
      this.editDataInfo = { ...row };
    },
    // 提交 新增/编辑 表单
    async submitFrom(formEl: FormInstance | undefined, ruleForm: ItemSaveParams) {
      if (!formEl) return;
      // 表单校验
      await formEl.validate((valid) => {
        if (valid) {
          if (!this.isEditing) {
            saveItem(ruleForm).then(() => {
              ElMessage({
                message: '保存成功！',
                type: 'success',
              });
              this.addShow = false;
            });
          } else {
            editItem(ruleForm).then(() => {
              ElMessage({
                message: '修改成功！',
                type: 'success',
              });
              this.addShow = false;
            });
          }
        } else {
          ElMessage.error('提交校验未通过，请核对表单数据！');
        }
      });
    },
    queryItemList(row: TypeListParams) {
      this.itemInfo = { ...row };
      this.typeCode = row.code as string;
    },

    resetState() {
      this.isEditing = false;
      this.editDataInfo = {};
    },
  },
});
