<route lang="yaml">
name: slideshowAdd
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">轮播图{{ title }}</h1>
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
          <el-form-item label="轮播图标题" prop="picTitle" class="gy-form-item-col">
            <el-input v-model="ruleForm.picTitle" placeholder="请输入图片标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跳转链接" prop="jumpLink" class="gy-form-item-col">
            <el-input v-model="ruleForm.jumpLink" placeholder="请输入跳转链接" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="图片备注" prop="picRemark" class="gy-form-item-col">
            <el-input v-model="ruleForm.picRemark" placeholder="请输入图片备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort" class="gy-form-item-col">
            <el-input v-model="ruleForm.sort" placeholder="请输入排序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="24">
          <el-form-item label="图片" prop="idCardMsg" class="gy-form-item-col">
            <el-upload
              class="avatar-uploader"
              action="/charity-system/api/files/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="headerKey"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
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

<script lang="ts" setup name="slideshowAdd">
  import { reactive, ref, defineEmits, onMounted } from 'vue';
  import { FormRules, FormInstance, ElMessage, ElLoading } from 'element-plus';
  import { useRouter } from 'vue-router';
  // import dayjs from 'dayjs';
  import { SlideshowSaveParams } from '/@/views/upms/model/slideshowModel';
  import {
    saveSlideshow,
    editSlideshow,
    doneeDownload,
  } from '/@/views/upms/api/slideshow';
  import { useUpmsSlideshow } from '/@/stores/modules/slideshow';
  const title = ref('新增');
  let token = ref(sessionStorage.getItem('TOKEN__'));
  const headerKey = ref({ Authorization: token.value });
  const useUpmsSlideshowStore = useUpmsSlideshow();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<SlideshowSaveParams>({});
  const router = useRouter();
  const emit = defineEmits(['closeRefresh']);
  import type { UploadProps } from 'element-plus';
  function init() {
    if (useUpmsSlideshowStore.$state.isEditing) {
      title.value = '修改';
      buttonType.value = '2';
      ruleForm.value = useUpmsSlideshowStore.$state.isEditing
        ? { ...useUpmsSlideshowStore.$state.editDataInfo }
        : ruleForm.value;
      // 下载
      imageUrl.value = ruleForm.value.picUrl as any;
      // handleDownload();
    }
  }
  const handleDownload = () => {
    doneeDownload(ruleForm.value.picUrl).then((res) => {
      let blob = new Blob([res.data]); // 返回的文件流数据
      imageUrl.value = window.URL.createObjectURL(blob); // 将他转化为路径
    });
  };
  const imageUrl = ref<string>('');
  // 上传成功
  const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    console.log(response);
    // 下载
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    // 路径
    ruleForm.value.picUrl = response.result.fileUrl;
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
  /**
   * 初始化方法
   */
  onMounted(async () => {
    init();
  });
  /**
   * 字典变量，页面不涉及请删除
   */
  // const dicLists = ref<SlideshowSaveParams>([]);
  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('closeRefresh', type);
    useUpmsSlideshowStore.resetState();
  };
  // 新增/编辑 表单

  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    picTitle: [{ required: true, message: '请输入轮播图标题', trigger: 'blur' }],
    jumpLink: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    /*
    idCardMsg: [{ required: true, message: '请上传图片', trigger: 'blur' }],
*/
  });

  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 校验图片
    if (imageUrl.value == '' || imageUrl.value == null || imageUrl.value == undefined) {
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
        if (buttonType.value === '1') {
          saveSlideshow(ruleForm.value)
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
          editSlideshow(ruleForm.value)
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
