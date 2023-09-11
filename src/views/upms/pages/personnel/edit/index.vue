<route lang="yaml">
name: ADD
</route>

<template>
  <div class="dept-all">
    <el-card>
      <h1 class="page_title mb-6"> {{ personnalStore.pageTitle }}人员信息</h1>
      <el-row class="flex mb-2">
        <span class="mr-4 mt-1">公益组织</span>
        <el-select
          v-model="ruleForm.pwoName"
          placeholder="请选择"
          :disabled="personnalStore.pageTitle === '编辑'"
        >
          <el-option
            v-for="item in pwoList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
            @click="updatePwo(item)"
          />
        </el-select>
      </el-row>
      <el-divider />
      <div class="dept-all">
        <div
          class="overflow-y-auto dept-left"
          v-if="personnalStore.pageTitle !== '编辑'"
        >
          <div class="p-2">
            <div class="flex items-center justify-between tree-header">
              <div>
                <span class="pl-2 text-xs">机构名称</span>
              </div>
            </div>
            <el-tree
              :key="once"
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              node-key="orgCode"
              :highlight-current="true"
              accordion
              :default-expanded-keys="[ruleForm.parentOrgCode]"
              :current-node-key="ruleForm.orgCode"
            />
          </div>
        </div>
        <el-divider direction="vertical" class="midDicider" />
        <div class="dept-right">
          <div class="form-all">
            <el-form
              :model="ruleForm"
              label-width="120px"
              :rules="rules"
              ref="ruleFormRef"
            >
              <el-form-item prop="orgName" label="机构名称">
                <el-input
                  v-model="ruleForm.orgName"
                  readonly
                  placeholder="请选择左侧树中机构"
                  :disabled="personnalStore.pageTitle === '编辑'"
                  clearable
                />
              </el-form-item>
              <el-form-item prop="nickname" label="用户名称">
                <el-input v-model="ruleForm.nickname" placeholder="请输入" clearable />
              </el-form-item>
              <el-form-item prop="username" label="账号">
                <el-input
                  v-model="ruleForm.username"
                  placeholder="请输入"
                  :disabled="personnalStore.pageTitle === '编辑'"
                  clearable
                />
              </el-form-item>
              <el-form-item
                prop="password"
                label="密码"
                v-if="personnalStore.pageTitle !== '编辑'"
              >
                <el-input
                  v-model="ruleForm.password"
                  placeholder="请输入"
                  show-password
                  clearable
                />
              </el-form-item>
              <el-form-item prop="idNumber" label="身份证">
                <el-input v-model="ruleForm.idNumber" placeholder="请输入" clearable />
              </el-form-item>
              <!-- <el-form-item prop="name" label="角色" v-if="">
                                <el-select multiple collapse-tags collapse-tags-tooltip v-model="ruleForm.roles"
                                    placeholder="请输入" clearable>
                                    <el-option v-for="item in roleList" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item> -->
              <el-form-item prop="provinceName" label="所属省">
                <el-select
                  v-model="ruleForm.provinceName"
                  placeholder="请输入"
                  @change="proChange"
                  clearable
                >
                  <el-option
                    v-for="item in provinceList"
                    :key="item.distId"
                    :label="item.label"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="cityName" label="所属市">
                <el-select
                  v-model="ruleForm.cityName"
                  placeholder="请输入"
                  @change="cityChange"
                  clearable
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.distId"
                    :label="item.label"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="countyName" label="所属区县">
                <el-select
                  v-model="ruleForm.countyName"
                  placeholder="请输入"
                  @change="countyChange"
                  clearable
                >
                  <el-option
                    v-for="item in countyList"
                    :key="item.distId"
                    :label="item.label"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="mobile" label="手机">
                <el-input v-model="ruleForm.mobile" clearable placeholder="请输入" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email" clearable placeholder="请输入" />
              </el-form-item>
            </el-form>
            <div class="form-bottom">
              <el-button @click="showEditPageClose('cancel')">取消</el-button>
              <el-button type="primary" @click="submitFrom(ruleFormRef)"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <!-- 选择公益组织对话框 -->
  <el-dialog
    v-model="pwoDialog"
    title="请先选择公益组织"
    width="40%"
    class="pwoDialog"
    top="15vh"
    :draggable="true"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-row class="flex mt-10 mb-30">
      <span class="mr-4 mt-1">公益组织</span>
      <el-select v-model="pwoOrther.pwoOrtherName" placeholder="请选择">
        <el-option
          v-for="item in pwoList"
          :key="item.value"
          :label="item.label"
          :value="item.label"
          @click="changePwo(item)"
          clearable
        />
      </el-select>
    </el-row>
    <el-row class="flex w-full mt-20px justify-end">
      <el-button @click="deletePwo">取消</el-button>
      <el-button type="primary" @click="choosePwo">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, watch, defineEmits } from 'vue';
  import { FormRules, FormInstance, ElMessage } from 'element-plus';
  import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
  import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/amcDistrict';
  import {
    UserSaveParams,
    editPageSubmitModal,
    pwoParams,
  } from '/@/views/upms/model/basePersonnal';
  import { queryOrganize, gerOrg } from '/@/views/upms/api/personnal';
  import { usePersonnalStore } from '/@/stores/modules/personnel';
  const personnelStore = usePersonnalStore();
  // 公益组织对话框
  const pwoDialog = ref(false);
  const emit = defineEmits(['submit']);
  const personnalStore = usePersonnalStore();
  interface Tree {
    orgCode: string;
    orgId: string;
    orgName: string;
    parentOrgCode: string;
    children?: Tree[];
  }
  //树
  const defaultProps = {
    children: 'children',
    label: 'orgName',
  };
  const handleNodeClick = (data: Tree) => {
    // 默认展开时使用父级节点展开
    // ruleForm.parentOrgCode = data.parentOrgCode
    ruleForm.orgCode = data.orgCode;
    ruleForm.orgId = data.orgId;
    ruleForm.orgName = data.orgName;
  };
  const data = ref<Tree[]>([]);
  // 新增/编辑 页面
  const ruleFormRef = ref<FormInstance>();

  // 新增/编辑 表单
  const ruleForm: UserSaveParams = reactive({
    id: '',
    pwoId: '',
    pwoName: '',
    username: '',
    nickname: '', //账号
    password: '',
    idNumber: '',
    roles: [],
    provinceName: '',
    cityName: '',
    countyName: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    mobile: '',
    email: '',
    orgName: '',
    orgCode: '',
    orgId: '',
    parentOrgCode: '',
  });
  const provinceList = ref<AmcDistrict[]>();
  const cityList = ref<AmcDistrict[]>();
  const countyList = ref<AmcDistrict[]>();
  const pwoList = ref<pwoParams[]>([]);
  // const roleList = ref<roleParams[]>([])

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
  // 密码自定义校验  包含大小写字母 数字 特殊字符 8位以上
  const regPassword = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}/;
  const checkPassword = (rule, value, callback) => {
    console.log(rule);
    if (value === '') {
      callback(new Error('请输入密码'));
    } else {
      if (!regPassword.test(value)) {
        callback(new Error('须包含大、小写字母、数字及特殊字符，保证8位以上'));
      } else {
      }
      callback();
    }
  };

  // 账号自定义校验 字母开头 位数：6-20位（可以是大写字母、小写字母、数字）
  const checkUsername = (rule, value, callback) => {
    console.log(rule);
    const num = /^[a-zA-Z]([a-zA-Z0-9]{5,20})$/;
    if (!num.test(value)) {
      callback(new Error('请以字母开头，须包含大、小写字母、数字，保证6位及以上'));
    } else {
      callback();
    }
  };
  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    orgName: [
      {
        required: true,
        message: '请选择机构',
      },
    ],
    roles: [
      {
        required: true,
        message: '请选择角色',
        trigger: 'change',
      },
    ],
    nickname: [
      {
        required: true,
        message: '请输入用户名称',
        trigger: 'blur',
      },
    ],
    username: [
      {
        required: true,
        message: '请输入账号',
        trigger: 'blur',
      },
      { validator: checkUsername, trigger: 'blur' },
    ],
    password: [{ validator: checkPassword, trigger: 'blur', required: true }],
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
  getpro();
  //省
  function proChange(item) {
    ruleForm.provinceCode = item.value;
    ruleForm.provinceName = item.label;
    ruleForm.cityName = '';
    ruleForm.countyName = '';
    countyList.value = [];
    cityList.value = [];
    queryCity(item.value).then((res) => {
      cityList.value = res;
    });
  }
  //市
  function cityChange(item) {
    ruleForm.cityCode = item.value;
    ruleForm.cityName = item.label;
    ruleForm.countyName = '';
    countyList.value = [];
    queryCounty(item.value).then((res) => {
      countyList.value = res;
    });
  }
  //区
  function countyChange(item) {
    ruleForm.countyCode = item.value;
    ruleForm.countyName = item.label;
  }
  //市
  watch(
    () => ruleForm.provinceCode,
    (newValue) => {
      queryCity(newValue).then((res) => {
        cityList.value = res;
      });
    },
  );
  //区
  watch(
    () => ruleForm.cityCode,
    (newValue) => {
      queryCounty(newValue).then((res) => {
        countyList.value = res;
      });
    },
  );
  // 公益组织查询
  const getPwo = () => {
    queryOrganize().then((res) => {
      if (res.status === 200) {
        pwoList.value = res.data.result;
      }
    });
  };
  // 头部的位置选组公益组织
  const updatePwo = (item) => {
    ruleForm.pwoId = item.value;
    ruleForm.orgName = '';
    gerOrg(ruleForm.pwoId).then((res) => {
      data.value = res.data.result;
    });
  };
  // 对话框公益组织名称
  const pwoOrther = ref({
    pwoOrtherName: '',
    pwoOrtherId: '',
  });
  // 对话框中选择公益组织
  const changePwo = (item) => {
    pwoOrther.value.pwoOrtherId = item.value;
    pwoOrther.value.pwoOrtherName = item.label;
  };
  // 确定选择公益组织
  const choosePwo = () => {
    if (pwoOrther.value.pwoOrtherName) {
      ruleForm.pwoName = pwoOrther.value.pwoOrtherName;
      ruleForm.pwoId = pwoOrther.value.pwoOrtherId;
      pwoDialog.value = false;
      gerOrg(ruleForm.pwoId).then((res) => {
        data.value = res.data.result;
      });
    } else {
      ElMessage({
        message: '请选择公益组织后再进行新增操作',
        type: 'error',
      });
      pwoDialog.value = true;
    }
  };
  // 取消选择公益组织
  const deletePwo = () => {
    // 重新回到主页面中
    personnelStore.isShowEditPageData = false;
  };

  // 角色查询
  // const getRole = () => {
  //     queryRole(ruleForm.pwoId).then((res) => {
  //         if (res.status === 200) {
  //             roleList.value = res.data.result
  //         }
  //     })
  // }
  // const changeRole = () => {
  //     console.log(ruleForm.roles);

  //     // ruleForm.roleId = item.value
  // }
  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 表单校验
    await formEl.validate((valid) => {
      if (valid) {
        switch (personnalStore.pageTitle) {
          case '新增':
            showEditPageClose('add', ruleForm);
            break;
          case '编辑':
            showEditPageClose('modify', ruleForm);
            break;
        }
      } else {
        ElMessage.error('按照规则添加或修改');
      }
    });
  };

  // 关闭 新增/编辑 before
  const showEditPageClose = (modal: editPageSubmitModal, data?: UserSaveParams) => {
    emit('submit', modal, data);
  };
  // 绑定在树控件上 在请求时变更数据 保证请求后重新渲染树形控件
  const once = ref(0);
  onMounted(() => {
    switch (personnalStore.$state.pageTitle) {
      case '新增':
        pwoDialog.value = true;
        personnalStore.readyAdd();
        break;
      case '编辑':
        Object.keys(ruleForm).forEach((key) => {
          ruleForm[key] = personnalStore.$state.editData[key];
        });
        // 编辑进入页面后通过公益组织展示机构树
        gerOrg(ruleForm.pwoId).then((res) => {
          data.value = res.data.result;
          once.value += 1;
        });

        break;
    }
    getPwo();

    // 移除校验结果
    setTimeout(() => {
      ruleFormRef.value!.clearValidate();
    }, 0);
  });
</script>

<style scoped>
  .dept-all {
    display: flex;
    width: 100%;
    /* height: 101%; */
    /* background: #f0f0f0; */
    min-height: 76vh;
    overflow-y: auto;
  }

  .midDicider {
    min-height: 76vh;
  }

  .dept-left {
    width: 280px;
    margin: 5px;
    background: white;
    /* height: 100%; */
    overflow-y: auto;
  }

  .dept-right {
    /* height: 100%; */
    flex: 1;
    margin: 5px;
    background: white;
    overflow-y: auto;
  }

  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  :deep(.avatar-uploader > .el-upload) {
    border: 1px dashed #e2e2e2;
    width: 85px;
    height: 90px;
    flex-direction: column;
    display: flex;
    background: #18ae651c;
  }

  :deep(.avatar-uploader) {
    padding-left: 122px;
    margin-bottom: 20px;
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .el-upload__text {
    color: #8c939d;
  }

  .el-card {
    height: 100%;
  }

  :deep(.el-divider--horizontal) {
    margin: 5px 0;
  }

  .form-bottom {
    display: flex;
    justify-content: center;
  }

  .form-all {
    padding: 10px;
  }

  :deep(.el-form) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  :deep(.el-form-item__content) {
    width: 324px;
  }

  :deep(.el-form-item__content > .el-select) {
    width: 100%;
  }

  .disabledclass :deep(.el-upload--picture-card) {
    display: none !important;
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

  /* :deep(.is-current) {
    background-color: #f1f7f7;
    color: #18ae66;
} */

  :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background-color: #f1f7f7;
    color: #18ae66;
  }
</style>
