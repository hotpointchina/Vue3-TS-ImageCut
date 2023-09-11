<route lang="yaml">
name: problemAdd
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">问题新增</h1>
    </div>

    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="84px"
      class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-50px"
      size="default"
      status-icon
    >
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="问题标题" prop="questionHead" class="gy-form-item-col">
            <el-input v-model="ruleForm.questionHead" placeholder="请输入问题标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="问题类型" prop="questionType" class="gy-form-item-col">
            <el-select v-model="ruleForm.questionType" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="问题级别" prop="questionLevel" class="gy-form-item-col">
            <el-select v-model="ruleForm.questionLevel" placeholder="请选择">
              <el-option
                v-for="item in applyStatusList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item
            label="问题描述"
            prop="questionDescrible"
            class="gy-form-item-col"
          >
            <el-input
              v-model="ruleForm.questionDescrible"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="解决办法" prop="solution" class="gy-form-item-col">
            <el-input
              v-model="ruleForm.solution"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="flex justify-center w-full ml-84px">
        <el-button @click="showEditPageClose">取消</el-button>
        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>
      </el-row>
      <!--    按钮剧中放开此处注释  -->
      <!--      <el-row class="flex justify-center w-full ml-84px">-->
      <!--        <el-button @click="showEditPageClose">取消</el-button>-->
      <!--        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>-->
      <!--      </el-row>-->
    </el-form>
  </div>
</template>

<script lang="ts" setup name="problemAdd">
  import { reactive, ref, defineEmits, onMounted } from 'vue';
  import { FormRules, FormInstance, ElMessage, ElLoading } from 'element-plus';
  // import { useRouter } from 'vue-router';
  // import dayjs from 'dayjs';
  import { ProblemSaveParams } from '/@/views/upms/model/problem';
  import { saveProblem, editProblem, seleProblem } from '/@/views/upms/api/problem';
  import { useUpmsProblem } from '/@/stores/modules/problem';
  const useUpmsProblemStore = useUpmsProblem();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<ProblemSaveParams>({});
  // const router = useRouter();
  const emit = defineEmits(['closeRefresh']);
  function init() {
    if (useUpmsProblemStore.$state.isEditing) {
      buttonType.value = '2';
      ruleForm.value = useUpmsProblemStore.$state.isEditing
        ? { ...useUpmsProblemStore.$state.editDataInfo }
        : ruleForm.value;
    }
    changeGroup();
  }

  /* 选择框 */
  type flagPage = {
    name: string;
    value: string;
  };

  const typeList = ref<flagPage[]>([]);
  const applyStatusList = ref<flagPage[]>([]);
  const changeGroup = () => {
    seleProblem('questionType').then((res) => {
      console.log('questionType', res);
      typeList.value = res.data;
    });
    seleProblem('questionLevel').then((res) => {
      console.log(res);
      applyStatusList.value = res.data;
    });
  };
  /**
   * 初始化方法
   */
  onMounted(async () => {
    init();
  });
  /**
   * 字典变量，页面不涉及请删除
   */
  // const dicLists = ref<ProblemSaveParams>([]);
  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('closeRefresh', type);
    useUpmsProblemStore.resetState();
  };
  // 新增/编辑 表单

  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    questionHead: [{ required: true, message: '请输入问题标题', trigger: 'blur' }],
    questionType: [{ required: true, message: '请选择', trigger: 'change' }],
    questionLevel: [{ required: true, message: '请选择', trigger: 'change' }],
    questionDescrible: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    solution: [{ required: true, message: '请输入内容', trigger: 'blur' }],
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
          saveProblem(ruleForm.value)
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
          editProblem(ruleForm.value)
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
</style>
