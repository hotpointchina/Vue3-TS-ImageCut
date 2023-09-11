<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <div class="page_title">{{ useUpmsOrgStore.addFlag }}</div>
    </div>
    <el-container>
      <el-aside
        width="350px"
        class="device-tree mt-10"
        style="height: 600px; overflow: scroll"
      >
        <!--        <el-scrollbar style="height:100%">-->
        <el-tree
          label="所属机构"
          :props="props"
          :load="loadNode"
          :data="treeData"
          @node-click="orgTreeClick"
          class="form-select"
          auto-expand-parent
          highlight-current
          node-key="orgCode"
          :default-expanded-keys="orgCode"
          :current-node-key="ruleForm.parentOrgCode"
          lazy
        />
        <!--        </el-scrollbar>-->
      </el-aside>

      <el-main>
        <div class="dept-right">
          <div class="form-all">
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="120px"
              class="
                gy-form
                flex flex-row flex-wrap
                justify-start
                item-start
                w-full
                pb-50px
              "
              size="default"
              status-icon
            >
              <el-form-item
                label="所属机构"
                prop="parentOrgName"
                class="w-590px mr-40px"
              >
                <el-input
                  v-model="ruleForm.parentOrgName"
                  disabled
                  placeholder="请选择左侧机构名称"
                />
              </el-form-item>

              <el-form-item label="机构名称" prop="orgName" class="w-590px mr-40px">
                <el-input v-model="ruleForm.orgName" placeholder="请输入机构名称" />
              </el-form-item>

              <el-form-item label="负责人" prop="head" class="w-590px mr-40px">
                <el-input v-model="ruleForm.head" placeholder="请输入负责人" />
              </el-form-item>

              <el-form-item label="联系电话" prop="phoneNumber" class="w-590px mr-40px">
                <el-input
                  v-model="ruleForm.phoneNumber"
                  placeholder="请输入联系电话"
                  type="number"
                />
              </el-form-item>

              <el-form-item label="所在省" prop="provinceName" class="w-590px mr-40px">
                <el-select
                  v-model="ruleForm.provinceName"
                  placeholder="请选择所在省"
                  @change="proChange"
                >
                  <el-option
                    v-for="item in proList"
                    :key="item.distId"
                    :label="item.label"
                    :value="item"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="所在地市" prop="cityName" class="w-590px mr-40px">
                <el-select
                  v-model="ruleForm.cityName"
                  placeholder="请选择所在地市"
                  @change="cityChange"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.distId"
                    :label="item.label"
                    :value="item"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="所在区县" prop="countyName" class="w-590px mr-40px">
                <el-select
                  v-model="ruleForm.countyName"
                  placeholder="请选择所在区县"
                  @change="countyChange"
                >
                  <el-option
                    v-for="item in countyList"
                    :key="item.distId"
                    :label="item.label"
                    :value="item"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="详细地址" prop="addr" class="w-590px mr-40px">
                <el-input v-model="ruleForm.addr" placeholder="请输入详细地址" />
              </el-form-item>

              <el-row class="flex justify-start w-full ml-460px">
                <el-button @click="showEditPageClose">取消</el-button>
                <el-button type="primary" @click="submitFrom(ruleFormRef)"
                  >提交</el-button
                >
              </el-row>
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="orgAdd">
  import type Node from 'element-plus/es/components/tree/src/model/node';
  import { reactive, ref, defineProps } from 'vue';
  import { FormRules, FormInstance, ElMessage } from 'element-plus';
  //import { useRouter } from 'vue-router';
  import { OrgSaveParams } from '/@/views/upms/model/pbdOrgModel';
  import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
  import {
    saveOrg,
    editOrg,
    queryOrgTree,
    queryChildOrgTree,
    queryOrgByOrg,
  } from '/@/views/upms/api/pbdOrg';
  import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/amcDistrict';
  import { useUpmsOrg } from '/@/stores/modules/pbd';

  const useUpmsOrgStore = useUpmsOrg();
  const buttonType = ref('1');
  const proList = ref<AmcDistrict[]>();
  const cityList = ref<AmcDistrict[]>();
  const countyList = ref<AmcDistrict[]>();
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<OrgSaveParams>({});
  const emit = defineEmits(['closeRefresh']);
  const addprops = defineProps(['data']);
  let orgCode = ref<string[]>([]);
  interface Tree {
    id: string;
    orgName: string;
    orgCode?: string;
    orgLevel?: string;
    leaf?: boolean;
  }
  const props = {
    id: 'orgCode',
    label: 'orgName',
    children: '',
    leaf: 'orgLevel',
  };
  //const router = useRouter();
  interface itemPro {
    value: string;
    label: string;
  }
  const queryOrg = (item) => {
    if (item !== null) {
      if (addprops.data == 'edit') {
        queryOrgByOrg(item.value).then((res) => {
          // res.forEach(key=>{
          //   orgCode.value.push(res.parentOrgCode)
          // })
          // orgCode.value=res.parentOrgCode
          // orgCode.value.push()
          // queryUpdateOrgList(ruleForm.value.parentOrgCode as string).then(data=>{
          //   console.log('1234---111 data',data)
          const arr: string[] = [];
          res.forEach((obj) => {
            arr.push(obj.orgCode);
          });
          orgCode.value = [...arr];
        });
      }
    }
  };

  function init() {
    if (addprops.data == 'edit') {
      ruleForm.value = useUpmsOrgStore.$state.isEditing
        ? { ...useUpmsOrgStore.$state.editDataInfo }
        : ruleForm.value;
      if (useUpmsOrgStore.$state.isEditing) {
        buttonType.value = '2';
        let itemPro: itemPro = {
          value: '',
          label: '',
        };
        itemPro.value = useUpmsOrgStore.$state.editDataInfo.provinceCode as string;
        itemPro.label = useUpmsOrgStore.$state.editDataInfo.provinceName as string;
        proChange(itemPro);
        let itemCity: itemPro = {
          value: '',
          label: '',
        };
        itemCity.value = useUpmsOrgStore.$state.editDataInfo.cityCode as string;
        itemCity.label = useUpmsOrgStore.$state.editDataInfo.cityName as string;
        cityChange(itemCity);
        let itemCounty: itemPro = {
          value: '',
          label: '',
        };
        itemCounty.value = useUpmsOrgStore.$state.editDataInfo.countyCode as string;
        itemCounty.label = useUpmsOrgStore.$state.editDataInfo.countyName as string;
        countyEidChange(itemCounty);
      }
    }
    getpro();
    queryOrg(ruleForm);
  }

  init();

  const orgTreeClick = (node) => {
    console.log('getCurrentKey node', node);
    ruleForm.value.parentOrgName = node.orgName;
    ruleForm.value.parentOrgCode = node.orgCode;
    ruleForm.value.orgLevel = node.orgLevel;
  };

  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('closeRefresh', type);
    useUpmsOrgStore.resetState();
  };

  const treeData = ref<Tree[]>([]);

  const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
    console.log('node', node);

    if (node.level === 0) {
      queryOrgTree().then((res) => {
        // queryUpdateOrgList(ruleForm.value.parentOrgCode as string).then(data=>{
        //   console.log(data,'dataoioipo')
        // })
        treeData.value = res;
        console.log('loadNode res', res);
        return resolve(res);
      });
    }
    if (node.level > 0) {
      queryChildOrgTree(node.data.orgCode).then((res) => {
        console.log('queryChildOrgTree::', node);
        resolve(res);
      });
    }
  };

  function getpro() {
    queryPro().then((res) => {
      console.log(res);
      proList.value = res;
    });
  }

  /**
   *
   * @param item
   */
  function proChange(item) {
    ruleForm.value.provinceCode = item.value;
    ruleForm.value.provinceName = item.label;
    ruleForm.value.cityName = '';
    ruleForm.value.countyName = '';
    countyList.value = [];
    cityList.value = [];
    console.log('item::', item);
    queryCity(item.value).then((res) => {
      console.log(res);
      cityList.value = res;
    });
  }

  function cityChange(item) {
    ruleForm.value.cityCode = item.value;
    ruleForm.value.cityName = item.label;
    ruleForm.value.countyName = '';
    countyList.value = [];
    queryCounty(item.value).then((res) => {
      console.log(res);
      countyList.value = res;
    });
  }
  function countyChange(item) {
    ruleForm.value.countyCode = item.value;
    ruleForm.value.countyName = item.label;
    ruleForm.value.addr = '';
    ruleForm.value.addr =
      (ruleForm.value.provinceName as string) +
      ruleForm.value.cityName +
      ruleForm.value.countyName;
  }
  function countyEidChange(item) {
    ruleForm.value.countyCode = item.value;
    ruleForm.value.countyName = item.label;
    // ruleForm.value.addr = '';
    // ruleForm.value.addr = ruleForm.value.provinceName as string +ruleForm.value.cityName+ruleForm.value.countyName;
  }
  // function queryParentOrg(item){
  //
  // }
  console.log('ruleForm.value::: ', ruleForm.value);

  //手机号校验
  const regTelephone = /^[1][1-9][0-9]{9}$/;
  const checkTelephone = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (value === '') {
      callback(new Error('请输入手机号'));
    } else {
      if (!regTelephone.test(value)) {
        callback(new Error('请输入11位数字，开头数字为1'));
      } else {
      }
      callback();
    }
  };
  // function checkSpecialKey(str) {
  //   const specialKey = '"[]%_!！~@\'#￥%……&*（）：“；‘。’”+.,*-+|?？();、\\^<>{}=/$';
  //   for (let i = 0; i <= str.length; i++) {
  //     if (specialKey.indexOf(str.substr(i, 1)) != -1) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  const checkData = (rule, value, callback) => {
    const user2 = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;
    if (value) {
      if (/^[1-9]\d*$/g.test(value)) {
        callback(new Error('不能为纯数字!'));
      } else if (user2.test(value)) {
        callback(new Error('不可含有特殊字符'));
      } else {
        callback();
      }
    } else if (!value || value === '') {
      callback(new Error('请输入'));
    }
    callback();
  };

  // 新增/编辑 表单

  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    parentOrgName: [{ required: true, message: '请选择左侧机构名称', trigger: 'blur' }],
    phoneNumber: [{ validator: checkTelephone, trigger: 'change', required: true }],
    orgName: [{ validator: checkData, required: true, trigger: 'blur' }],
    head: [{ validator: checkData, required: true, trigger: 'blur' }],
    provinceName: [
      { required: true, message: '请选择县', trigger: ['change', 'blur'] },
    ],
    cityName: [{ required: true, message: '请选择市', trigger: 'change' }],
    countyName: [{ required: true, message: '请选择县', trigger: 'change' }],
    addr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  });

  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 表单校验
    await formEl.validate((valid) => {
      if (valid) {
        console.log('buttonType.value==  ', buttonType.value);
        if (buttonType.value === '1') {
          saveOrg(ruleForm.value).then(() => {
            ElMessage({
              message: '保存成功！',
              type: 'success',
            });
            showEditPageClose('submit');
          });
        } else {
          editOrg(ruleForm.value).then(() => {
            ElMessage({
              message: '修改成功！',
              type: 'success',
            });
            showEditPageClose('submit');
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
