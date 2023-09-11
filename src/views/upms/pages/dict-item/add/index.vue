<route lang="yaml">
name: itemAdd
</route>

<template>
  <div class="depttt_all">
    <!--    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">-->
    <!--      <h1 class="page_title">页面标题</h1>-->
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
      <!--      <el-form-item label="字典类型编码" prop="typeCode" class="w-590px mr-40px">-->
      <!--        <el-input v-model="useUpmsItemStore.typeCode" placeholder="请输入字典类型编码" />-->
      <!--      </el-form-item>-->
      <el-form-item label="字典项名称" prop="name" class="w-590px mr-40px">
        <el-input v-model="ruleForm.name" placeholder="请输入字典项名称" />
      </el-form-item>
      <el-form-item label="字典项值" prop="value" class="w-590px mr-40px">
        <el-input v-model="ruleForm.value" placeholder="请输入字典项值" />
      </el-form-item>
      <el-form-item label="排序" prop="sort" class="w-590px mr-40px">
        <el-input v-model="ruleForm.sort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w-590px mr-40px">
        <el-input v-model="ruleForm.remark" placeholder="请输入备注" />
      </el-form-item>
      <!--      <el-row class="flex justify-start w-full ml-112px">-->
      <!--        <el-button @click="showEditPageClose">取消</el-button>-->
      <!--        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>-->
      <!--      </el-row>-->

      <!--    按钮剧中放开此处注释  -->
      <!--      <el-row class="flex justify-center w-full ml-84px">-->
      <!--        <el-button @click="showEditPageClose">取消</el-button>-->
      <!--        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>-->
      <!--      </el-row>-->
    </el-form>
  </div>
</template>

<script lang="ts" setup name="itemAdd">
  import { reactive, ref, defineExpose } from 'vue';
  import { FormRules, FormInstance, ElMessage, ElForm } from 'element-plus';
  //import {  useRoute } from 'vue-router';
  import { ItemSaveParams } from '/@/views/upms/model/dictItemModel';

  import { saveItem, editItem } from '/@/views/upms/api/dictItem';
  import { useUpmsItem } from '/@/stores/modules/dictItem';
  import { useUpmsType } from '/@/stores/modules/dictType';

  const useUpmsItemStore = useUpmsItem();
  const useUpmsTypeStore = useUpmsType();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<ItemSaveParams>({});
  //const route = useRoute();
  const emit = defineEmits(['close']);

  ruleForm.value.typeCode = useUpmsTypeStore.code as string;
  // = route.query.code;
  function init() {
    if (useUpmsItemStore.isEditing) {
      // buttonType.value = '2';
      ruleForm.value = useUpmsItemStore.$state.isEditing
        ? { ...useUpmsItemStore.$state.editDataInfo }
        : ruleForm.value;
    }
    if (useUpmsItemStore.$state.isEditing) {
      buttonType.value = '2';
    }
  }

  init();
  /**
   * 字典变量，页面不涉及请删除
   */
  //const dicLists = ref<ItemSaveParams>([]);
  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('close', type);
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
    value: [{ required: true, validator: checkData, trigger: 'change', message:'请输入字典项值' }],
    name: [{ required: true, trigger: 'change', validator: checkNumberData, message:'请输入字典项名称' }],
  });
  // 提交 新增/编辑 表单
  const dicSubmitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 表单校验
    await formEl.validate((valid) => {
      if (valid) {
        ruleForm.value.typeCode = useUpmsItemStore.typeCode;
        console.log(ruleForm.value);
        if (buttonType.value === '1') {
          saveItem(ruleForm.value).then(() => {
            ElMessage({
              message: '保存成功！',
              type: 'success',
            });
            showEditPageClose('close');
          });
        } else {
          editItem(ruleForm.value).then(() => {
            ElMessage({
              message: '修改成功！',
              type: 'success',
            });
            showEditPageClose('close');
          });
          useUpmsItemStore.resetState();
        }
      } else {
        ElMessage.error('提交校验未通过，请核对表单数据！');
      }
    });
  };

  defineExpose({ ruleFormRef, dicSubmitFrom });
</script>

<style scoped>
  .depttt_all {
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
