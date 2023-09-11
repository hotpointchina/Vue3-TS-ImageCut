<!--
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 16:25:15
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-15 16:55:11
 * @FilePath: \gongyi_vue_demo\src\views\upms\pages\project\changePass\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
         <!-- Form -->

  <el-dialog v-model="props.dialogFormVisible" title="修改密码" @close="shut(ruleFormRef)">
    <el-form :model="resetForm"  :rules="rules" ref="ruleFormRef">
      <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldpassword" >
        <el-input v-model="resetForm.oldpassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth" prop="newpassword" >
        <el-input v-model="resetForm.newpassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirmpassword" >
        <el-input v-model="resetForm.confirmpassword" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickHangdle(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref ,defineEmits ,toRefs,watch} from 'vue'
// import { useRouter } from 'vue-router'
import type { FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
// const router = useRouter()
// const route =useRoute()
// const sd = route.query.booly
// console.log(route.query.booly);
// const dialogFormVisible = ref(true)

const props =defineProps({
  dialogFormVisible:{
    type:Boolean,
  }
})
// const we =ref(props.dialogFormVisible)

const formLabelWidth = '120px'
const ruleFormRef = ref<FormInstance>()
const resetForm = reactive({
  oldpassword: '',
  newpassword: '',
  confirmpassword: '',
})
// let dialogFormVisible = ref(true)
// const clickHangdle = (data)=>{
//   dialogFormVisible.value = false
//   console.log(data,'dialogFormVisible');
  
// }

const refProps = toRefs(props)
const fromVisibl = ref(false)
watch(refProps.dialogFormVisible,(val)=>{
  fromVisibl.value = val
  
})
const emit = defineEmits([ "update:dialogFormVisibl" ]);

const clickHangdle = (formEl: FormInstance | undefined) => {
  
  emit('update:dialogFormVisibl', );
  if (!formEl) return
  formEl.resetFields()
}
// defineExpose({ clickHangdle })
const pwdCheck = (rule:any,value, callback) => {
      if (value !== '') {
        if (value.length < 6 || value.length > 16)  {
             callback(new Error('新密码至少输入6-16位'))
             console.log(rule);
             
        } else {
          callback()
        }
      }else{
           callback(new Error('新密码不能为空'))
       }
     }
     // 重复密码验证
    const pwdAgainCheck = (rule, value, callback) => {
      if (value.length < 1) {
           callback(new Error('确认新密码不能为空！'));
           console.log(rule);
      } else if(resetForm.newpassword !== resetForm.confirmpassword){
           callback(new Error('两次输入密码不一致！'));
     }else{
       callback()
     }
   }
   const rules =reactive<FormRules>({
    oldpassword : [
            {required: true, message: "密码不能为空", trigger: 'blur'}
          ],
    newpassword: [ { required: true, validator: pwdCheck, trigger: 'blur' } ],
    confirmpassword: [ { required: true, validator: pwdAgainCheck, trigger: 'blur' } ]
}) 
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      ElMessage({
            message: '保存成功',
            type: 'success',
        })
        formEl.resetFields()
      emit('update:dialogFormVisibl', );

    } else {
      console.log('error submit!')
      return false
    }
  })
}
//
function shut(formEl: FormInstance | undefined){
  
  emit('update:dialogFormVisibl', );
  if (!formEl) return
  formEl.resetFields()

}
</script>
<style scoped>
:deep(.el-dialog__header){
  border-bottom: 1px solid #E8EAEC;
  margin-right: 0px;
  font-weight: bold;
}
</style>