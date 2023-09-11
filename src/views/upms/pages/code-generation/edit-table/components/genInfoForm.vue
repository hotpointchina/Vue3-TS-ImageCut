<template>
  <el-form
    class="flex flex-col justify-center w-90/100"
    ref="ruleFormRef"
    :model="formModel"
    :rules="rules"
    label-width="120px"
    size="default"
    status-icon
  >
    <el-row class="flex flex-row flex-wrap">
      <el-col :span="12">
        <el-form-item label="生成模板" prop="tplCategory" class="form-select">
          <el-select v-model="formModel.tplCategory" clearable placeholder="生成模板">
            <el-option label="表格-无搜索" value="nosearchtable" />
            <el-option label="表格-有搜索" value="havesearchtable" />
            <el-option label="表单" value="form" />
            <el-option label="左树右表" value="lrtree" />
            <el-option label="表格-有搜索-流程" value="flow_table" />

          </el-select>
        </el-form-item>
      </el-col>

<!--      <el-col :span="12">-->
<!--        <el-form-item label="生成包路径" prop="packageName">-->
<!--          <el-input v-model="formModel.packageName" clearable placeholder="生成包路径" />-->
<!--        </el-form-item>-->
<!--      </el-col>-->

      <el-col :span="12">
        <el-form-item label="生成模块名" prop="moduleName">
          <el-input v-model="formModel.moduleName" clearable placeholder="生成模块名" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="生成业务名" prop="businessName">
          <el-input v-model="formModel.businessName" clearable placeholder="生成业务名" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="生成功能名" prop="functionName">
          <el-input type="textarea" v-model="formModel.functionName" :autosize="false" :rows="8" resize="none" clearable placeholder="生成功能名" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item class="buttons">
      <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      <el-button type="primary" @click="handleGenTable">代码生成</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang='ts' setup name='genInfoForm'>

import { reactive, ref, defineProps, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import * as typeModel from '../model/typeModel';
import { useCodeGeneration } from '/@/stores/modules/codeGeneration';
import { editTableHandle } from '../function';


const userStore = useCodeGeneration();


interface genInfoFormData {
  // 生成模板
  tplCategory: String,
  // 生成包路径
  packageName: String,
  // 生成模块名
  moduleName: String,
  // 生成业务名
  businessName: String,
  // 生成功能名
  functionName: String,
}
interface plodDataType<T> { plodData: T }
const porps = withDefaults(defineProps<plodDataType<genInfoFormData>>(),{
  plodData: ()=>({
    tplCategory: '',
    packageName: '',
    moduleName: '',
    businessName: '',
    functionName: '',
   })
});

const ruleFormRef = ref<FormInstance>();
const formModel = reactive({
  tplCategory: '',
  packageName: '',
  moduleName: '',
  businessName: '',
  functionName: '',
});
const rules = reactive<FormRules>({
  tplCategory: [{ required: true, message: '请选择模板', trigger: 'blur' }],
  packageName: [{ required: true, message: '请填写包路径', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请填写模块名', trigger: 'blur' }],
  businessName: [{ required: true, message: '请填写业务名', trigger: 'blur' }],
  functionName: [{ required: true, message: '请填写功能名', trigger: 'blur' }],
});

const init = ()=>{
  if( Object.keys(porps.plodData).every(key=>porps.plodData[key]==='') ){return}
  Object.keys(porps.plodData).forEach(key=>{
    porps.plodData[key] = formModel[key];
  });
};
init();
watch(
  ()=> porps.plodData,
  (val)=>{
    Object.keys(val).forEach(key=>{
      formModel[key] = val[key];
    });
  },
  { deep: true }
);

const { submitUpdateGenTable } = editTableHandle();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitUpdateGenTable({
          ...userStore.EditDataInfo,
          ...formModel,
        columns: userStore.EditDataRow
      });
    } else {
      console.log('error submit!', fields)
    }
  })
};
const handleGenTable:typeModel.voidFunction = () => {
  // downLoadZip('/system/gen/batchGenCode?tables=' + this.obj.tableName, 'ysb')
};
</script>


<style scoped>
.form-select :deep(.el-select.el-select--default){
  width: 100%;
}
.buttons :deep(.el-form-item__content){
  display:flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items:center;
  width: 100%;
  padding-top: 20px;
}
</style>
