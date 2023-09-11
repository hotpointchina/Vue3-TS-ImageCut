import { defineStore } from 'pinia';
import { ActListParams, ActSaveParams } from '/@/views/upms/model/activitiesModel';
import { ElMessage, FormInstance } from 'element-plus';
import { actEdit, actAdd } from '/@/views/upms/api/activities';

export interface itemStateModel {
  isEditing: boolean;
  addShow: boolean;
  editDataInfo: ActListParams;
  itemInfo: ActListParams;
  typeCode: string;
}

export const useUpmsAct = defineStore({
  id: 'dictItem',
  state: (): itemStateModel =>
    <itemStateModel>{
      isEditing: false,
      addShow: false,
      editDataInfo: {},
      itemInfo: {},
    },

  actions: {
    setEditItemDataInfo(row: ActListParams) {
      this.isEditing = true;
      this.editDataInfo = { ...row };
    },
    // 提交 新增/编辑 表单
    async submitFrom(formEl: FormInstance | undefined, ruleForm: ActSaveParams) {
      if (!formEl) return;
      // 表单校验
      await formEl.validate((valid) => {
        if (valid) {
          if (!this.isEditing) {
            actAdd(ruleForm).then(() => {
              ElMessage({
                message: '保存成功！',
                type: 'success',
              });
              this.addShow = false;
            });
          } else {
            actEdit(ruleForm).then(() => {
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
    // queryActList(row: ActListParams) {
    //   this.itemInfo = { ...row };
    //   this.typeCode = row.code as string;
    // },

    resetState() {
      this.isEditing = false;
      this.editDataInfo = {};
    },
  },
});
