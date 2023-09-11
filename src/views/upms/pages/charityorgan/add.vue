<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">新增</h1>
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
      <el-form-item label="公益组织名称" prop="pwoName" class="w-600px mr-40px">
        <el-input v-model="ruleForm.pwoName" />
      </el-form-item>
      <el-form-item label="备案编号" prop="recordCode" class="w-600px mr-40px">
        <el-input v-model="ruleForm.recordCode" />
      </el-form-item>
      <el-form-item label="负责人" prop="head" class="w-600px mr-40px">
        <el-input v-model="ruleForm.head" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber" class="w-600px mr-40px">
        <el-input v-model="ruleForm.phoneNumber" />
      </el-form-item>
      <el-form-item label="省" prop="provinceName" class="w-600px mr-40px">
        <el-select
          v-model="ruleForm.provinceName"
          clearable
          placeholder="请选择省份"
          @change="Change"
        >
          <el-option
            v-for="item in optionPro"
            :key="item.distId"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="cityName" class="w-600px mr-40px">
        <el-select
          v-model="ruleForm.cityName"
          clearable
          placeholder="请选择城市"
          @change="ChangeCity"
        >
          <el-option
            v-for="item in optionCity"
            :key="item.distId"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区/县" prop="countyName" class="w-600px mr-40px">
        <el-select
          v-model="ruleForm.countyName"
          clearable
          placeholder="请选择区/县"
          @change="ChangeCounty"
        >
          <el-option
            v-for="item in optionCounty"
            :key="item.distId"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮编" prop="postalCode" class="w-600px mr-40px">
        <el-input v-model="ruleForm.postalCode" />
      </el-form-item>
      <el-form-item label="详细地址" prop="addr" class="w-600px mr-40px">
        <el-input v-model="ruleForm.addr" />
      </el-form-item>
      <el-form-item label="简介" prop="pwoIntroduce" class="w-1240px mr-40px">
        <el-input
          v-model="ruleForm.pwoIntroduce"
          :rows="3"
          maxlength="200"
          placeholder="请输入描述最多200字"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
      <br />
      <el-row class="flex justify-center w-full mr-90px">
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="organAdd">
  import { onMounted, reactive, ref, defineEmits } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus';
  import {
    queryPro,
    queryCity,
    queryCounty,
    postadd,
  } from '/@/views/upms/api/charityorgan';
  import { tableData, AmcDistrict } from './organ';

  const emit = defineEmits(['isClose']);
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<tableData>({});

  //校验特殊字符和纯数字
  let validateInput = (rule, value, callback) => {
    const reg = /[^\d\s]/;
    if (!checkSpecialKey(value)) {
      callback(new Error('不能含有特殊字符！！'));
    } else {
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error('不能是纯数字或存在空格键'));
    }
  };
  //校验中文和字符
  let validateInputNE = (rule, value, callback) => {
    const reg = /^([a-zA-Z\d]{1,20})$/;
    if (!checkSpecialKey(value)) {
      callback(new Error('不能含有特殊字符！！'));
    } else {
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error('不能是纯数字或存在空格键'));
    }
  };
  //校验只有有中英
  let validateInputCE = (rule, value, callback) => {
    const reg = /^([\u4e00-\u9fa5a-zA-Z]{1,20})$/;
    if (!checkSpecialKey(value)) {
      callback(new Error('不能含有特殊字符！！'));
    } else {
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error('不能是纯数字或存在空格键'));
    }
  };
  // 字符方法
  function checkSpecialKey(str) {
    let specialKey =
      "[`~!@#$%^&*()_\-+=<>?:{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]";
    for (let i = 0; i < str.length; i++) {
      if (specialKey.indexOf(str.substr(i, 1)) != -1) {
        return false;
      }
    }
    return true;
  }
  const rules = reactive<FormRules>({
    pwoName: [
      { required: true, message: '请输入公益组织名称', trigger: 'blur' },
      {
        validator: validateInput,
        trigger: 'blur',
        message: '请输入中文、英文、中英、或者与数字组合的组织名称',
      },
    ],
    recordCode: [
      { required: true, message: '请输入备案编号', trigger: 'blur' },
      {
        validator: validateInputNE,
        trigger: 'blur',
        message: '请输入数字或英文',
      },
    ],
    head: [
      { required: true, message: '请输入负责人', trigger: 'blur' },
      {
        validator: validateInputCE,
        trigger: 'blur',
        message: '请输入中文、英文姓名',
      },
    ],
    phoneNumber: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { len: 11, message: '请输入11位整数', trigger: 'blur' },
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
      },
    ],
    provinceName: [
      { required: true, message: '请选择省份', trigger: 'change' },
      { min: 2, max: 10, message: '请选择省份', trigger: 'change' },
    ],
    cityName: [
      { required: true, message: '请选择城市', trigger: 'change' },
      { min: 2, max: 10, message: '请选择城市', trigger: 'change' },
    ],
    countyName: [
      { required: true, message: '请选择区/县', trigger: 'change' },
      { min: 2, max: 10, message: '请选择区/县', trigger: 'change' },
    ],
    addr: [
      { required: true, message: '请输入详细地址', trigger: 'blur' },
      { min: 2, max: 40, message: '请输入详细地址最少2个字', trigger: 'blur' },
    ],
    postalCode: [
      { required: true, message: '请输入邮编', trigger: 'blur' },
      { min: 6, max: 6, message: '邮编最少应有 6 位', trigger: 'blur' },
      {
        pattern: /\d{6}/,
        message: '请输入正确邮编',
      },
    ],
    pwoIntroduce: [
      { required: true, message: '请输入组织简介', trigger: 'blur' },
      { min: 2, max: 201, message: '最少应有2个字，最多不超过200字', trigger: 'blur' },
    ],
  });
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        var status = ref(true);
        postadd(ruleForm.value)
          .catch((err) => {
            console.log('catch: ', err);
            status.value = !status.value;
          })
          .finally(() => {
            if (status.value) {
              emit('isClose', false);
            }
          });
      } else {
        console.log('提交失败', fields);
      }
    });
  };

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  function cancel() {
    emit('isClose', false);
  }
  onMounted(() => {
    getpro();
  });
  const optionPro = ref<AmcDistrict[]>();
  const optionCity = ref<AmcDistrict[]>();
  const optionCounty = ref<AmcDistrict[]>();
  function getpro() {
    queryPro().then((res) => {
      optionPro.value = res;
      console.log(optionPro.value);
    });
  }
  function Change(item) {
    ruleForm.value.provinceCode = item.value;
    ruleForm.value.provinceName = item.label;
    console.log(ruleForm.value);
    ruleForm.value.addr = item.label;
    //获取城市
    queryCity(item.value).then((res) => {
      optionCity.value = res;
    });
  }
  function ChangeCity(item) {
    ruleForm.value.cityCode = item.value;
    ruleForm.value.cityName = item.label;
    let str = (ruleForm.value.addr as string) + item.label;
    ruleForm.value.addr = str;
    //获取区县
    queryCounty(item.value).then((res) => {
      optionCounty.value = res;
    });
  }
  function ChangeCounty(item) {
    ruleForm.value.countyCode = item.value;
    ruleForm.value.countyName = item.label;
    let str = (ruleForm.value.addr as string) + item.label;
    ruleForm.value.addr = str;
  }
</script>

<style scoped>
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

  .inputWidth {
    width: 200px;
  }
</style>
