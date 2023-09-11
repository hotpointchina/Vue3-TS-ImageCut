<route lang="yaml">
name: noticeAdd
</route>

<template>
  <div class="dept_all" style="overflow-y: auto">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">通知管理</h1>
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
        <el-col :span="24">
          <el-form-item label="通知标题" prop="noticeTitle" class="gy-form-item-col">
            <el-input v-model="ruleForm.noticeTitle" placeholder="请输入通知标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="通知内容类型" prop="textType" class="w-590px mr-40px">
        <el-col :span="24">
          <el-radio-group v-model="ruleForm.textType">
            <el-radio label="1">文本</el-radio>
            <el-radio label="2">编辑器</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-row class="gy-form-item-row">
        <el-col :span="24">
          <el-form-item
            v-if="ruleForm.textType == '2'"
            label="通知内容"
            prop="noticeContent"
            class="gy-form-item-col"
            style="height: 250px"
          >
            <QuillEditor
              :content="ruleForm.noticeContent"
              @change="(obj) => btnHandler(obj)"
              @blur="(obj) => btnHandler(obj)"
              @uploadFile="quillUploadFile"
              :isUpdated="isUpdated"
              @updateDone="quillUpdateDone"
              :imgageUrl="imgageUrl"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.textType == '1'"
            label="通知内容"
            prop="noticeContent"
            class="gy-form-item-col"
          >
            <el-input
              v-model="ruleForm.noticeContent"
              placeholder="请输入通知内容"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime" class="gy-form-item-col">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="date"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="过期时间" prop="validityTime" class="gy-form-item-col">
            <el-date-picker
              v-model="ruleForm.validityTime"
              type="date"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择过期时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="接收系统" prop="receiveSystem" class="gy-form-item-col">
            <el-select v-model="ruleForm.receiveSystem" placeholder="请选择接收系统">
              <el-option
                v-for="dict in useUpmsNoticeStore.noticeTzxtDic"
                :key="dict.value"
                :label="dict.name"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="level" class="gy-form-item-col">
            <el-input v-model="ruleForm.level" placeholder="请输入优先级" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark" class="gy-form-item-col">
            <el-input
              v-model="ruleForm.remark"
              placeholder="请输入备注"
              type="textarea"
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

<script lang="ts" setup name="noticeAdd">
  import { reactive, ref, defineEmits, onMounted } from 'vue';
  import { FormRules, FormInstance, ElMessage, ElLoading } from 'element-plus';
  import { useRouter } from 'vue-router';
  // import dayjs from 'dayjs';
  import QuillEditor from '/@/components/sys/QuillEditor';
  import { NoticeSaveParams } from '/@/views/upms/model/noticeModel';
  import { saveNotice, editNotice } from '/@/views/upms/api/notice';
  import { useUpmsNotice } from '/@/stores/modules/notice';
  import { queryDicList } from '/@/views/upms/api/dictItem';
  import { doneeDownload, getBase64, doneeUpload } from '/@/views/upms/api/doneeDecla';
  const useUpmsNoticeStore = useUpmsNotice();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<NoticeSaveParams>({ textType: '1' });
  const router = useRouter();
  const emit = defineEmits(['closeRefresh']);
  const noticeText = ref<string>('');

  function init() {
    if (useUpmsNoticeStore.$state.isEditing) {
      buttonType.value = '2';
      ruleForm.value = useUpmsNoticeStore.$state.isEditing
        ? { ...useUpmsNoticeStore.$state.editDataInfo }
        : ruleForm.value;
    }
  }
  // 获取富文本中的内容 Quill change      uploadFile
  const btnHandler = (obj: any) => {
    ruleForm.value.noticeContent = obj.content;
  };
  // 是否更新 富文本编辑器中的内容
  const isUpdated = ref<boolean>(false);
  const quillUpdateDone = () => {
    isUpdated.value = false;
  };
  const imgageUrl = ref<string>('');
  // 富文本 上传图片
  const quillUploadFile = (obj: any) => {
    const loading = ElLoading.service({
      lock: true,
      text: 'loading...',
      background: 'rgba(255, 255, 255, 0.7)',
    });
    obj.formData = new FormData();
    obj.formData.append('file', obj.files);

    doneeUpload(obj.formData)
      .then((res) => {
        console.log(res, 'res');

        ruleForm.value.noticeContent = res.data.result.fileUrl;
        imgageUrl.value = ruleForm.value.noticeContent as string;
      })
      .finally(() => {
        loading.close();
      });
    // console.log(' quillUploadFile obj', obj.files);
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
  // const dicLists = ref<NoticeSaveParams>([]);
  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('closeRefresh', type);
    useUpmsNoticeStore.resetState();
  };
  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    noticeTitle: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
    noticeContent: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    validityTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
    receiveSystem: [{ required: true, message: '请输入接收系统', trigger: 'change' }],
    level: [{ required: true, message: '请输入优先级', trigger: 'change' }],
  });

  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (ruleForm.value.startTime! > ruleForm.value.validityTime!) {
      ElMessage({
        message: '过期时间不得大于开始时间',
        type: 'error',
      });
      return false;
    }
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
          saveNotice(ruleForm.value)
            .then((res) => {
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
          console.log(ruleForm.value);
          editNotice(useUpmsNoticeStore.id, ruleForm.value)
            .then((res) => {
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
  @import url('/@/styles/common/admcDefaultStyle.css');
</style>
