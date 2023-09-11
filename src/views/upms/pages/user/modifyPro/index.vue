<route lang="yaml">
    name: zMockADD
  </route>
  
  <template>
    <div class="dept_all">
      <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
        <h1 class="page_title">修改用户信息</h1>
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
        <el-form-item prop="eventName" label="用户姓名" class="w-590px mr-40px">
         <el-input v-model="ruleForm.eventName" placeholder="姓名" />
        </el-form-item>
  
        <el-form-item prop="helpType" label="账号" class="w-590px mr-40px">
            <el-input v-model="ruleForm.helpType" placeholder="登陆账号" />
        </el-form-item>
        <el-form-item prop="gender" label="身份证" class="w-590px mr-40px">
            <el-input v-model="ruleForm.gender" placeholder="身份证" />
        </el-form-item>
        <el-form-item prop="memberName" label="机构名称" class="w-590px mr-40px">
            <el-select v-model="ruleForm.memberName" placeholder="请输入">
          <el-option label="机构一" value="男" />
          <el-option label="机构二" value="女" />
        </el-select>
        </el-form-item>
        <el-form-item prop="memberName" label="用户状态" class="w-590px mr-40px">
            <el-select v-model="ruleForm.memberName" placeholder="请输入">
          <el-option label="机构一" value="男" />
          <el-option label="机构二" value="女" />
        </el-select>
        </el-form-item>
        <el-form-item prop="role" label="角色" class="w-590px mr-40px">
            <el-select v-model="ruleForm.role" placeholder="请输入">
          <el-option label="角色一" value="男" />
          <el-option label="角色二" value="女" />
        </el-select>
        </el-form-item>
        <el-form-item  label="省" class="w-590px mr-40px">
           <el-select v-model="ruleForm.gender" placeholder="请输入">
          <el-option label="北京" value="男" />
          <el-option label="河北" value="女" />
        </el-select>
        </el-form-item>
        <el-form-item  label="市" class="w-590px mr-40px">
           <el-select v-model="ruleForm.gender" placeholder="请输入">
          <el-option label="北京" value="男" />
          <el-option label="石家庄" value="女" />
        </el-select>
        </el-form-item>
        <el-form-item  label="区" class="w-590px mr-40px">
           <el-select v-model="ruleForm.gender" placeholder="请输入">
          <el-option label="昌平" value="男" />
          <el-option label="丰台" value="女" />
        </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="手机号" class="w-590px mr-40px">
          <el-input v-model="ruleForm.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item  label="邮箱" class="w-590px mr-40px">
          <el-input v-model="ruleForm.phone" placeholder="邮箱" />
        </el-form-item>
        <el-row class="flex justify-center w-full ml-84px">
          <el-button @click="showEditPageClose">取消</el-button>
          <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>
        </el-row>
      </el-form>
    </div>
  </template>
  
  
  <script lang="ts" setup name="zMockAdd">
  import { reactive, ref } from 'vue';
  import { FormRules, FormInstance } from 'element-plus';
  import { useRouter } from 'vue-router'
  const router = useRouter()
  // form
  type FormListType = {
    name: string,
    helpType: string,
    eventName?: string,
    passWd:string,
    Id: string,
    gender: string,
    age: string,
    phone: string,
    role:string,
    memberName:string,
  };
  
  
  // 新增/编辑 页面
  const ruleFormRef = ref<FormInstance>();

  
  // 关闭 新增/编辑 before
  const showEditPageClose = ()=>{
    router.push('/upms/project/member')
  }
  // 新增/编辑 表单
  const ruleForm:FormListType = reactive({
    name: '',
    helpType: '',
    eventName: '',
    passWd:'',
    Id: '',
    gender: '',
    age: '',
    phone: '',
    role:'',
    memberName:'',
  });
  
  
  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    eventName: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'change',
      },
    ],
    helpType: [
      {
        required: true,
        message: '请输入账号',
        trigger: 'change',
      },
    ],
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    role:[
        {required: true, message: '请选择角色', trigger: 'change'}
    ],
    passWd:[
        {required: true, message: '请输入密码', trigger: 'blur'}
    ],
    memberName:[
        {required: true, message: '请选择机构名称', trigger: 'change'}
    ]
  })
  
  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 表单校验
    await formEl.validate((valid, fields) => {
      if (valid) {
        // ruleForm.date = dayjs().format('YYYY-MM-DD HH:mm:ss');
        // ruleForm.status = '启用';
        // ruleForm.helpCode = 'bf-' + Date.now();
        // ruleForm.name = ruleForm.name.substring(0,1) + '**';
        // ruleForm.phone = ruleForm.phone.substring(0,4) + '****' + ruleForm.phone.slice(-4);
        // ruleForm.idNumber = ruleForm.idNumber.substring(0,2) + '**************' + ruleForm.idNumber.slice(-2);
        // ruleForm.address = ruleForm.address.substring(0,2) + '*****************' + ruleForm.address.slice(-2);
        // formData.list.unshift( ruleForm );
        // showEditPageClose();
        console.log('submitFrom');
        
      } else {
        console.log('error submitFrom!', fields)
      }
    })
  };
  </script>
  
  
  <style scoped>
  .dept_all{
    /* position: relative; */
    padding: 29px 24px;
    /* overflow: hidden; */
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .page_title{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    color: #33344a;
    font-weight: bold;
  }
  .page_title::before{
    content: ' ';
    display: block;
    width: 4px; height: 18px;
    margin: 0 9px 0 0; padding: 0;
    background: #18AE66;
  }
  .gy-form:deep(.el-select.el-select--default),
  .gy-form:deep(.el-input-number.el-input-number--default){
    width: 100%;
  }
  
  .gy-form:deep(.el-form-item--default .el-form-item__label){
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
    width: 8em !important;
    line-height: 15px;
  }
  </style>
  
