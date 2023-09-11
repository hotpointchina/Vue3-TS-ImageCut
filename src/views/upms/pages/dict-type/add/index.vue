<template>
  <div class="deptll_all">
    <!--    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">-->
    <!--      <h1 class="page_title">字典新增</h1>-->
    <!--    </div>-->

    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="84px"
      class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-15px"
      size="default"
      status-icon
    >
      <el-form-item label="类型名称" prop="name" class="w-590px mr-40px">
        <el-input v-model="ruleForm.name" placeholder="请输入类型名称" />
      </el-form-item>
      <el-form-item label="类型编码" prop="code" class="w-590px mr-40px">
        <el-input v-model="ruleForm.code" placeholder="请输入类型编码" />
      </el-form-item>
      <el-form-item label="状态" prop="status" class="w-590px mr-40px">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option key="0" label="启用" :value="0" />
          <el-option key="1" label="禁用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w-590px mr-40px">
        <el-input v-model="ruleForm.remark" placeholder="请输入备注" />
      </el-form-item>

      <el-row class="flex justify-start w-full is-justify-center">
        <el-button @click="showEditPageClose">取消</el-button>
        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="typeAdd">
  import { reactive, ref } from 'vue';
  import { FormRules, FormInstance, ElMessage } from 'element-plus';
  import { TypeSaveParams } from '/@/views/upms/model/dictTypeModel';
  import { saveType, editType } from '/@/views/upms/api/dictType';
  import { useUpmsType } from '/@/stores/modules/dictType';

  const useUpmsTypeStore = useUpmsType();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<TypeSaveParams>({});
  const props = defineProps(['data']);
  const emit = defineEmits(['closeRefresh']);

  function init() {
    if (props.data == 'edit') {
      ruleForm.value = useUpmsTypeStore.$state.isEditing
        ? { ...useUpmsTypeStore.$state.editDataInfo }
        : ruleForm.value;
      if (useUpmsTypeStore.$state.isEditing) {
        buttonType.value = '2';
      }
    }
  }
  init();

  /**
   * 字典变量，页面不涉及请删除
   */

  //const dicLists = ref<TypeSaveParams>();
  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('closeRefresh', type);
    useUpmsTypeStore.resetState();
  };
  const checkData = (rule, value, callback) => {
    if (value) {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('不能包含中文!'));
      } else {
        callback();
      }
    } else if (!value || value === '') {
      callback(new Error('请输入类型编码'));
    }
    callback();
  };

  const checkNumberData = (rule, value, callback) => {
    if (value) {
      //^-?\d+$
      if (/^-?\d+$/g.test(value)) {
        callback(new Error('不能为全数字!'));
      } else {
        callback();
      }
    } else if (!value || value === '') {
      callback(new Error('请输入类型名称'));
    }
    callback();
  };

  // 新增/编辑 表单
  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    code: [{ validator: checkData, trigger: 'change', required: true }],
    name: [{ validator: checkNumberData, trigger: 'change', required: true }],
  });

  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 表单校验
    await formEl.validate((valid) => {
      if (valid) {
        if (buttonType.value === '1') {
          saveType(ruleForm.value).then(() => {
            ElMessage({
              message: '保存成功！',
              type: 'success',
            });
            showEditPageClose('submit');
          });
        } else {
          editType(ruleForm.value).then(() => {
            ElMessage({
              message: '修改成功！',
              type: 'success',
            });
            showEditPageClose('submit');
          });
        }
      } else {
        ElMessage.error('提交校验未通过，请核对表单数据！');
      }
    });
  };
</script>

<style scoped>
  .deptll_all {
    /* position: relative; */
    padding: 1px 24px;
    /* overflow: hidden; */
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .page_title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    color: #33344a;
    font-weight: bold;
  }
  .page_title::before {
    content: ' ';
    display: block;
    width: 4px;
    height: 18px;
    margin: 0 9px 0 0;
    padding: 0;
    background: #18ae66;
  }
  .gy-form:deep(.el-select.el-select--default),
  .gy-form:deep(.el-input-number.el-input-number--default) {
    width: 100%;
  }

  .gy-form:deep(.el-form-item--default .el-form-item__label) {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
    width: 8em !important;
    line-height: 15px;
  }
</style>
