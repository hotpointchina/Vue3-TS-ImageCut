<template>
  <div class="dept_all">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="84px"
      class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-50px" size="default" status-icon>
      <el-form-item  label="机构名称" class="w-590px mr-40px">
        <el-input v-model="ruleForm.orgName" placeholder="登陆账号" disabled />
      </el-form-item>
      <el-form-item  label="账号" class="w-590px mr-40px">
        <el-input v-model="ruleForm.username" placeholder="登陆账号" disabled />
      </el-form-item>
      <el-form-item  prop="nickname" label="用户姓名" class="w-590px mr-40px">
        <el-input v-model="ruleForm.nickname" placeholder="姓名" />
      </el-form-item>
      <el-form-item prop="idNumber"  label="身份证" class="w-590px mr-40px">
        <el-input v-model="ruleForm.idNumber" placeholder="身份证" />
      </el-form-item>
      <el-form-item prop="provinceName" label="所属省" class="w-590px mr-40px">
        <el-select v-model="ruleForm.provinceName" placeholder="请输入" @change="proChange" clearable>
          <el-option v-for="item in provinceList" :key="item.distId" :label="item.label" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item prop="cityName" label="所属市" class="w-590px mr-40px">
        <el-select v-model="ruleForm.cityName" placeholder="请输入" @change="cityChange" clearable>
          <el-option v-for="item in cityList" :key="item.distId" :label="item.label" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item prop="countyName" label="所属区县" class="w-590px mr-40px">
        <el-select v-model="ruleForm.countyName" placeholder="请输入" @change="countyChange" clearable>
          <el-option v-for="item in countyList" :key="item.distId" :label="item.label" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item prop="mobile" label="手机" class="w-590px mr-40px">
        <el-input v-model="ruleForm.mobile" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" class="w-590px mr-40px">
        <el-input v-model="ruleForm.email" clearable placeholder="请输入" />
      </el-form-item>
      <el-row class="flex justify-center w-full ml-84px  mr-80px">
        <el-button @click="showEditPageClose">取消</el-button>
        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>
  
  
<script lang="ts" setup name="updatePerson">
import { reactive, ref, onMounted } from 'vue';
import { FormRules, FormInstance } from 'element-plus';
import { getOnlyPersonnal, editPersonnal } from '/@/views/upms/api/password';
import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/amcDistrict';

const props = defineProps({
  MSG: {
    type: String,
    default: '',
  },
})
const provinceList = ref<AmcDistrict[]>();
const cityList = ref<AmcDistrict[]>();
const countyList = ref<AmcDistrict[]>();
// form
type FormListType = {
  id: string;
  pwoId: string;
  pwoName: string;
  username: string;
  nickname: string;//账号
  password: string;
  idNumber: string;
  roles?: string[];
  roleName?: string[];
  provinceName: string;
  cityName: string;
  countyName: string;
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  mobile: string;
  email: string;
  orgName: string;// 机构
  orgCode: string;
  orgId: string;
  parentOrgCode?: string;
};


// 编辑 页面
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(['cancel']);

// 关闭 编辑 
const showEditPageClose = () => {
  emit('cancel', false);
}
// 新增/编辑 表单
const ruleForm = ref<FormListType>({
  id: '',
  pwoId: '',
  pwoName:  '',
  username: '',
  nickname:  '',
  password:  '',
  idNumber:  '',
  roles: [],
  roleName: [],
  provinceName:  '',
  cityName: '',
  countyName:  '',
  provinceCode:  '',
  cityCode:  '',
  countyCode:  '',
  mobile:  '',
  email:  '',
  orgName:  '',// 机构
  orgCode:  '',
  orgId:  '',
  parentOrgCode: '',
});


// 新增、添加名址表单的校验规则
// 手机号自定义校验
const reg = /^[1][2,3,4,5,7,8][0-9]{9}$/;
const checkTelephone = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value === '') {
    callback(new Error('请输入手机号'));
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入11位数字，开头数字为1'));
    } else {
    }
    callback();
  }
};
// 身份证号自定义检验
const regIdNumber =
  /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
const checkIdNumber = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value === '') {
    callback(new Error('请输入身份证号'));
  } else {
    if (!regIdNumber.test(value)) {
      callback(new Error('填写正确格式的18位身份证号'));
    } else {
    }
    callback();
  }
};
// 邮箱自定义校验
const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const checkEmail = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value === '') {
    callback(new Error('请输入邮箱'));
  } else {
    if (!regEmail.test(value)) {
      callback(new Error('填写正确格式的邮箱'));
    } else {
    }
    callback();
  }
};
// 新增、添加名址表单的校验规则
const rules = reactive<FormRules>({
 
  nickname: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur',
    },
  ],
  provinceName: [
    {
      required: true,
      message: '请选择省份',
      trigger: 'change',
    },
  ],
  cityName: [
    {
      required: true,
      message: '请选择市',
      trigger: 'change',
    },
  ],
  countyName: [
    {
      required: true,
      message: '请选择区/县',
      trigger: 'change',
    },
  ],
  mobile: [{ validator: checkTelephone, trigger: 'blur', required: true }],
  email: [{ validator: checkEmail, trigger: 'blur', required: true }],
  idNumber: [{ validator: checkIdNumber, trigger: 'blur', required: true }],
});
function getpro() {
  queryPro().then((res) => {
    provinceList.value = res;
  });
}
//省
function proChange(item) {
  ruleForm.value.provinceCode = item.value;
  ruleForm.value.provinceName = item.label;
  ruleForm.value.cityName = '';
  ruleForm.value.countyName = '';
  countyList.value = [];
  cityList.value = [];
  queryCity(item.value).then((res) => {
    cityList.value = res;
  });
}
//市
function cityChange(item) {
  ruleForm.value.cityCode = item.value;
  ruleForm.value.cityName = item.label;
  ruleForm.value.countyName = '';
  countyList.value = [];
  queryCounty(item.value).then((res) => {
    countyList.value = res;
  });
}
//区
function countyChange(item) {
  ruleForm.value.countyCode = item.value;
  ruleForm.value.countyName = item.label;
}

// 提交 新增/编辑 表单
const submitFrom = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // 表单校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      editPersonnal(ruleForm)
    } else {
      console.log('error submitFrom!', fields)
    }
  })
};
onMounted(() => {
  getpro();
  getOnlyPersonnal(props.MSG).then((res) => { 
    ruleForm.value = res.data.result
  })
})
</script>
  
  
<style scoped>
.dept_all {
  /* position: relative; */
  padding: 29px 24px;
  /* overflow: hidden; */
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
  background: #18AE66;
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
</style>
  
