<template>
  <div class="dept_all" element-loading-text="Loading...">
    <div>
      <el-form label-width="100px" :model="formLabelAlign" :rules="rules" style="max-width: 350px">
        <el-form-item label="原密码" prop="oldPasswd">
          <el-input v-model="formLabelAlign.oldPasswd" />
        </el-form-item>
        <br>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="formLabelAlign.password" />
        </el-form-item>
        <br>
        <el-form-item label="确认新密码" prop="newPassword">
          <el-input v-model="formLabelAlign.newPassword" />
        </el-form-item>
      </el-form>
      <br>
      <el-row class="flex justify-center w-full ml-100px">
        <el-button @click="passWordClose">取消</el-button>
        <el-button type="primary" @click="passWordSubmit">确认</el-button>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup name="updatePasswd">
import { onMounted, reactive, ref, } from 'vue';
import { FormRules, ElMessage, ElMessageBox, } from 'element-plus';
import { PassWordUpdate, PassWordData } from '/@/views/upms/api/password';
const props = defineProps({
  MSG: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['cancel']);
const formLabelAlign = ref<PassWordData>({
  username: '',
  oldPasswd: '',
  password: '',
  newPassword: '',
})
const validatePassword = (rule, value, callback) => {
  const regexp = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/;
  if (!regexp.test(value)) {
    callback(new Error('请输入8-16位字符的密码,且包含数字,大小写字母，特殊字符任意三种'));
  } else {
    callback();
  }
};
const confirmPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'));
  } else if (value !== formLabelAlign.value.password) {
    callback(new Error('两次密码输入不一致'));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  oldPasswd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
  ],
  password: [
  { trigger: 'blur', validator: validatePassword },
    { required: true, min: 8, max: 16, message: '请输入8-16位的密码', trigger: 'blur' },
    
  ],
  newPassword: [
    { validator: confirmPwd }, { required: true, message: '请确认密码' }
  ],
})


function passWordSubmit() {
  ElMessageBox.confirm(
    '确认修改吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      PassWordUpdate(formLabelAlign.value);
      passWordClose();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })

}
function passWordClose() {
  emit('cancel', false);
}

onMounted(() => {
  console.log(props.MSG)
  formLabelAlign.value.username = props.MSG

})
</script>

<style lang="scss" scoped>
.dept_all {
  padding: 20px 24px;
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
