<route lang="yaml">
name: addressAdd
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">规则{{ title }}</h1>
    </div>

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="84px"
      class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-50px" size="default" status-icon>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="规则名称" prop="ruleName" class="gy-form-item-col">
            <el-input v-model="ruleForm.ruleName" placeholder="请输入规则名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则数据" prop="ruleLhs" class="gy-form-item-col">
            <el-input v-model="ruleForm.ruleLhs" placeholder="请输入规则数据" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="规则执行" prop="ruleRns" class="gy-form-item-col">
            <el-input v-model="ruleForm.ruleRns" placeholder="请输入规则执行" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则类型" prop="ruleType" class="gy-form-item-col">
            <el-select v-model="ruleForm.ruleType" placeholder="请选择规则类型">
              <el-option v-for="dict in ruleTypeList" :key="dict.value" :label="dict.name" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="优先级" prop="ruleSalience" class="gy-form-item-col">
            <el-input v-model="ruleForm.ruleSalience" placeholder="请输入优先级" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="flex justify-center w-full ml-84px">
      <el-button @click="showEditPageClose">取消</el-button>
      <el-button type="primary" @click="submitFrom(ruleFormRef)">保存</el-button>
    </el-row>
  </div>
</template>

<script lang="ts" setup name="addressAdd">
import { reactive, ref, defineEmits, onMounted, } from 'vue';
import {
  FormRules,
  FormInstance,
  ElMessage,
  ElLoading,
  // UploadUserFile,
} from 'element-plus';
import { RuleSaveParams } from '/@/views/upms/model/rule';
import {
  getOnlyRule,
  saveRule,
  editRule,
  getRuleTypeList
} from '/@/views/upms/api/rule';
import { useUpmsRule } from '/@/stores/modules/rule';
const useUpmsRuleStore = useUpmsRule();
const buttonType = ref('1');
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleSaveParams>({
  ruleName: '',
  ruleSalience: '',
  ruleLhs: '',
  ruleRns: '',
  ruleType: '',
});
const title = ref('新增')
const emit = defineEmits(['closeRefresh']);
type flagPage = {
  name: string;
  value: string;
};
const ruleTypeList = ref<flagPage[]>([])
function init() {
  getRuleTypeList('ruleType').then(res => {
    ruleTypeList.value = res.data;
  })
  if (useUpmsRuleStore.$state.isEditing) {
    buttonType.value = '2';
    getOnlyRule(useUpmsRuleStore.$state.editDataInfo.id as string).then((res) => {
      ruleForm.value = res;
      title.value = '编辑'
    });
  }
}
/**
 * 初始化方法
 */
onMounted(async () => {
  init();
});
/**
 * 字典变量，页面不涉及请删除
 */
// const dicLists = ref<RuleSaveParams>([]);
// 关闭 新增/编辑 before
const showEditPageClose = (type) => {
  type ? 'close' : type;
  emit('closeRefresh', type);
  useUpmsRuleStore.resetState();
};

// 新增、添加名址表单的校验规则
const rules = reactive<FormRules>({
  ruleName: [{ required: true, message: '请填写规则名称', trigger: 'blur' }],
  ruleLhs: [{ required: true, message: '请填写规则数据', trigger: 'blur' }],
  ruleRns: [{ required: true, message: '请填写规则执行', trigger: 'blur' }],
  // ruleSalience: [{ required: true, message: '请填写优先级', trigger: 'blur' }],
  ruleType: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
});


// 提交 新增/编辑 表单
const submitFrom = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 表单校验
  await formEl.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '正在保存数据...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      if (buttonType.value === '1') {
        saveRule(ruleForm.value)
          .then(() => {

            ElMessage({
              message: '保存成功！',
              type: 'success',
            });
            showEditPageClose('submit');
          })
          .finally(() => {
            loading.close();
          });
      } else {
        editRule(ruleForm.value)
          .then(() => {
            ElMessage({
              message: '修改成功！',
              type: 'success',
            });
            showEditPageClose('submit');
          })
          .finally(() => {
            loading.close();
          });
      }
    } else {
      ElMessage.error('提交校验未通过，请核对表单数据！');
    }
  });
};

</script>

<style scoped>
@import url('/@/styles/chinapost/admcDefaultStyle.css');

:deep(.ql_editor) {
  height: 200px;
}
</style>
