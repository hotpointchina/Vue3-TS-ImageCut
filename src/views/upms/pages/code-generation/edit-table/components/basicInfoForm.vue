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
      <el-col :span="8">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="formModel.tableName" clearable placeholder="请输入表名" />
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="表描述" prop="tableComment">
          <el-input v-model="formModel.tableComment" clearable placeholder="请输入表描述" />
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="实体类名称" prop="className">
          <el-input v-model="formModel.className" clearable placeholder="请输入实体类名称" />
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="作者" prop="functionAuthor">
          <el-input v-model="formModel.functionAuthor" clearable placeholder="请输入作者" />
        </el-form-item>
      </el-col>
      
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formModel.remark" :autosize="false" :rows="8" resize="none" clearable placeholder="请输入备注" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item class="buttons">
      <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      <el-button type="primary" @click="handleGenTable">代码生成</el-button>
    </el-form-item>
  </el-form>
</template>


<script lang='ts' setup name='basicInfoForm'>
import {
  reactive, ref,
  defineProps,
  watch,
} from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import * as typeModel from '../model/typeModel';
import { useCodeGeneration } from '/@/stores/modules/codeGeneration';
import { editTableHandle } from '../function';


const userStore = useCodeGeneration();
interface basicInfoFormData {
  // 表名
  tableName: String,
  // 表描述
  tableComment: String,
  // 实体类名称
  className: String,
  // 作者
  functionAuthor: String,
  // 备注
  remark: String,
}
interface plodDataType<T> { plodData: T }
const porps = withDefaults(defineProps<plodDataType<basicInfoFormData>>(),{
  plodData: ()=>({ 
    tableName: '',
    tableComment: '',
    className: '',
    functionAuthor: '',
    remark: '',
   })
});

const ruleFormRef = ref<FormInstance>();
const formModel = reactive({
  tableName: '',
  tableComment: '',
  className: '',
  functionAuthor: '',
  remark: '',
});
const rules = reactive<FormRules>({
  tableName: [
    { required: true, message: '请输入表名', trigger: 'blur' },
  ],
  tableComment: [
    { required: true, message: '请输入表描述', trigger: 'blur' },
  ],
  className: [
    { required: true, message: '请输入实体类名称', trigger: 'blur' },
  ],
  functionAuthor: [
    { required: true, message: '请输入作者名', trigger: 'blur' },
  ],
});

const init = ()=>{
  if( Object.keys(porps.plodData).every(key=>porps.plodData[key]==='') ){return}
  Object.keys(porps.plodData).forEach(key=>{
    formModel[key] = porps.plodData[key];
  });
};
init();

watch(
  ()=> porps.plodData,
  (val)=>{
    Object.keys( val ).forEach(key=>{
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
        info: {
          ...userStore.EditDataInfo,
          ...formModel
        },
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
.buttons :deep(.el-form-item__content){
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>