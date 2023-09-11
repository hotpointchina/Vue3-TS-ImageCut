<route lang="yaml">
name: addProduct
</route>

<template>
  <div class="dept_all">
    <!--    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">进度维护</h1>
    </div>-->

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
          <el-form-item
            label="进度标题"
            prop="progressHead"
            style="width: calc(150% - 40px)"
            class="gy-form-item-col"
          >
            <el-input v-model="ruleForm.progressHead" placeholder="请输入进度标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item
            label="进度描述"
            prop="progressDescrible"
            class="gy-form-item-col"
            style="width: calc(150% - 40px)"
          >
            <el-input
              v-model="ruleForm.progressDescrible"
              placeholder="请输入进度描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="24">
          <el-form-item label="图片" prop="progressImage" class="gy-form-item-col">
            <el-upload
              v-model:file-list="fileList"
              class="avatar-uploader"
              action="/charity-system/api/files/upload"
              list-type="picture-card"
              :limit="4"
              :headers="headerKey"
              :on-exceed="handleExceed"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogImageUrl">
              <img w-full :src="imageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="flex justify-center w-full ml-84px">
        <el-button @click="showEditPageClose">取消</el-button>
        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="addProduct">
  import { reactive, ref, defineEmits, onMounted } from 'vue';
  import { FormRules, FormInstance, ElMessage, ElLoading } from 'element-plus';
  let token = ref(sessionStorage.getItem('TOKEN__'));
  const headerKey = ref({ Authorization: token.value });
  const crowdStore = useCrowdStore();
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref({
    activitiesId: '',
    progressHead: '',
    progressDescrible: '',
    progressImage: '',
    activitiesCode: '',
    activitiesName: '',
  });
  import { addProduct } from '/@/views/upms/api/crowdFundingActivities';
  const emit = defineEmits(['closeAddproduct']);
  import type { UploadProps, UploadUserFile } from 'element-plus';
  import { useCrowdStore } from '/@/stores/modules/crowdfundModul';
  const imageUrl = ref<string>('');
  const fileList = ref<UploadUserFile[]>([]);
  // 上传成功
  const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    // 下载
    // imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    if (ruleForm.value.progressImage == null || ruleForm.value.progressImage == '') {
      // 路径
      ruleForm.value.progressImage = response.result.fileUrl;
    } else {
      // 路径
      ruleForm.value.progressImage =
        ruleForm.value.progressImage + ',' + response.result.fileUrl;
    }
  };
  // 上传前的回调函数
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (
      rawFile.type == 'image/jpeg' ||
      rawFile.type == 'image/png' ||
      rawFile.type == 'image/jpg'
    ) {
      return true;
    }
    ElMessage.error('请上传正确的图片!');
    return false;
  };
  const dialogImageUrl = ref<boolean>(false);
  // 上传前的回调函数
  const handlePictureCardPreview = (uploadFile) => {
    imageUrl.value = uploadFile.response.result.fileUrl;
    dialogImageUrl.value = true;
  };
  // 限制文件上次个数
  const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    return ElMessage.error('最多上传四张！');
  };
  // 关闭页面
  const showEditPageClose = () => {
    emit('closeAddproduct');
  };
  /**
   * 初始化方法
   */
  onMounted(async () => {});

  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    progressHead: [{ required: true, message: '请输入进度标题', trigger: 'blur' }],
    progressDescrible: [{ required: true, message: '请输入进度描述', trigger: 'blur' }],
    /*
  idCardMsg: [{ required: true, message: '请上传图片', trigger: 'blur' }],
*/
  });

  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 校验图片
    if (ruleForm.value.progressImage == '' || ruleForm.value.progressImage == null) {
      return ElMessage.error('请上传附件信息！');
    }
    // 表单校验
    await formEl.validate((valid) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: '正在保存数据...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        // 参数
        ruleForm.value.activitiesId = crowdStore.detailData.id;
        ruleForm.value.activitiesName = crowdStore.detailData.activitiesName;
        ruleForm.value.activitiesCode = crowdStore.detailData.activitiesCode;
        addProduct(ruleForm.value)
          .then((res) => {
            console.log(res);
            if (res.data.code == '00000') {
              ElMessage({
                message: '保存成功！',
                type: 'success',
              });
              emit('closeAddproduct');
            }
          })
          .finally(() => {
            loading.close();
          });
      } else {
        ElMessage.error('提交校验未通过，请核对表单数据！');
      }
    });
  };
</script>

<style scoped>
  @import url('/@/styles/chinapost/admcDefaultStyle.css');
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
