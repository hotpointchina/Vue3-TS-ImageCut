<template>
  <div class="dept_all" element-loading-text="Loading...">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">商品新增</h1>
    </div>
    <div style="margin-left: 250px;margin-top: 50px;">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px"
        class="gy-form flex flex-row flex-wrap justify-start item-start w-full " size="default" status-icon>
        <el-form-item label="商品名称" class="w-full mr-400px  " prop="wareName">
          <el-input v-model="ruleForm.wareName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品品牌" class="w-full mr-400px  " prop="wareBrand">
          <el-input v-model="ruleForm.wareBrand" placeholder="请输入商品品牌" />
        </el-form-item>
        <el-form-item label="商品类型" class="w-full  mr-400px" prop="wareType">
          <el-select v-model="ruleForm.wareType" placeholder="请选择商品类型">
            <el-option label="日用品" value="1" />
            <el-option label="学具" value="2" />
            <el-option label="食品" value="3" />
            <el-option label="衣物" value="4" />
            <el-option label="其他" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用年龄" class="w-full  mr-400px" prop="suitAge">
          <el-select v-model="ruleForm.suitAge" placeholder="请选择适用年龄">
            <el-option label="0~12岁" value="1" />
            <el-option label="12~20岁" value="2" />
            <el-option label="20~30岁" value="3" />
            <el-option label="30岁以上" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品介绍" class="w-full mr-400px" prop="wareIntroduce">
          <el-input v-model="ruleForm.wareIntroduce" :autosize="{ minRows: 2, maxRows: 6 }" maxlength="200"
            type="textarea" show-word-limit placeholder="请输入商品介绍" />
        </el-form-item>
        <el-form-item label="宣传图" prop="Image"  ref="ruleForm.wareMsg">
          <el-upload ref="uploadRef" action="/charity-system/api/files/upload" list-type="picture-card"
            :auto-upload="true" :on-success="handleReveSuccess" :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload" :on-exceed="handleReveExceed" :on-preview="handlePictureCardPreview"
            :headers="headerKey" v-model:file-list="fileListreve" name="file" :on-change="handleReveChange" :limit="1">
            <div>
              <el-icon class="avatar-uploader-icon" style="margin-left: 15px;">
                <Plus />
              </el-icon><br>
              上传图片
            </div>
            <template #tip>
              <div class="el-upload__tip" style="color: red">
                最多上传不能超过1张图片,图片大小不要超过5M
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <br>
        <el-row class="flex justify-center w-full mr-400px">
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup name="productAdd">
import { onMounted, reactive, ref, defineEmits } from 'vue';
import {
  FormInstance, FormRules, UploadProps,
  UploadRawFile, UploadUserFile
} from 'element-plus';
import { ElLoading, ElMessage } from 'element-plus';
import { tableDataI } from '../product';
import { addData } from '/@/views/upms/api/productMaintenance';

const emit = defineEmits(['cancel']);
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<tableDataI>({});
var valiIcon = (rule, value, callback) => {
      // 图片验证
      if (fileListreve.value.length < 1 ) { 
        callback(new Error("请上传商品主图"));
      } else {
        callback();
      }
    }
const rules = reactive<FormRules>({
  wareName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
  ],
  wareBrand: [
    { required: true, message: '请输入商品品牌', trigger: 'blur' },
  ],
  wareType: [
    { required: true, message: '请选择商品类型', trigger: 'change' },
  ],
  suitAge: [
    { required: true, message: '请选择适用年龄', trigger: 'change' },
  ],
  wareIntroduce: [
    { required: true, message: '请填写商品介绍', trigger: 'blur' },
  ],
  Image: [
    { required: true, message: '请上传宣传图', validator: valiIcon },
  ],

});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    const loading = ElLoading.service({
      lock: true,
      text: 'loading...',
      background: 'rgba(255, 255, 255, 0.7)',
    });
    if (valid) {
      addData(ruleForm.value).finally(() => {
        cancel();
      });
    } else {
      console.log('提交失败', fields)
    }
    loading.close();
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  fileListreve.value = []
}
function cancel() {
  emit('cancel', false);
}


onMounted(() => {
  console.log('提交失败')
})
/** 图片*/
let token = ref(sessionStorage.getItem('TOKEN__'));
const headerKey = ref({ Authorization: token.value });
const fileListreve = ref<UploadUserFile[]>([]);
const imageUrl = ref('')
//上传
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  // 获取后缀名
  const suffix = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1);
  // 判断是否符合文件大小的限制需求
  // const isLt2M =
  // 判断是否符合文件类型需求
  let accept = 'jpg/png';
  const isLtType = accept.indexOf(suffix) >= 0;
  if (!isLtType) {
    ElMessage.error({
      message: `上传文件格式必须为${accept}`,
      type: 'warning',
    });
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error({
      message: `上传文件大小不能超过${5}M!`,
      type: 'warning',
    });
    return false;
  }
  return isLtType;
};
const handleReveSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  ruleForm.value.wareMsg = response.result.fileUrl
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};
//预览上传图片
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
//预览图片
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const ReveImg = ref<string[]>([]);
//删除
const handleRemove: UploadProps['onRemove'] = () => {
  fileListreve.value = []
  ruleForm.value.wareMsg = ''
}
// 数量
const handleReveExceed = (files: File[]) => {
  if (files.length >= 1) {
    ElMessage.error({
      message: `最多上传不能超过5张图片`,
      type: 'warning',
    });
    return;
  }
};
const handleReveChange: UploadProps['onChange'] = (uploadFile) => {
  ReveImg.value.push(uploadFile.url as string);
};
</script>

<style lang="scss" scoped>
.dept_all {
  padding: 29px 24px;
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

.gy-form {
  :deep(.el-input__inner) {
    text-align: left
  }
}

.button_input {

  :deep(.el-input__inner),
  :deep(.el-input__wrapper.is-focus .el-input__inner) {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
  }
}

.el-input__inner {
  text-align: right;
  line-height: 1;
}
</style>
