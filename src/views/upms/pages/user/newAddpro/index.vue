<!--
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-09 09:44:24
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-11 17:44:09
>>>>>>> 153bde0ee3f8894ac3f9eb6ec29204db0b4eca83
 * @FilePath: \gongyi_vue_demo\src\views\upms\pages\user\newAddpro\index01.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dept-all">
    <el-card>
      <h1 class="page_title mb-6">{{ userStore.pageTitle }}用户信息</h1>
      <el-row class="flex mb-2">
        <span class="mr-4 mt-1">公益组织</span>
        <el-select v-model="form.pwoName" placeholder="请选择" :disabled="userStore.pageTitle == '编辑'">
          <el-option v-for="item in pwoList" :key="item.value" :label="item.label" :value="item.label"
            @click="updatePwo(item)">
          </el-option>
        </el-select>
      </el-row>
      <el-divider />
      <div class="dept-all">
        <div class="overflow-y-auto dept-left" v-if="userStore.pageTitle !== '编辑'">
          <div class="p-2">
            <div class="flex items-center justify-between tree-header ">
              <div>
                <span class="pl-2 text-xs">机构名称</span>
              </div>
            </div>
            <el-tree :props="props" :load="loadNode" @node-click="orgTreeClick" class="form-select" :data="data"
              node-key="orgCode" :highlight-current="true" accordion :default-expanded-keys="[form.parentOrgCode]"
              :current-node-key="form.orgCode" />
          </div>
        </div>
        <el-divider direction="vertical" class="midDicider" />
        <div class="dept-right">
          <div class="form-all">
            <!-- action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" -->
            <!--          <el-upload
            ref="uploadRef"
            action="/charity-system/api/files/upload"
            list-type="picture-card"
            :auto-upload="true"
            :class="{ disabledclass: uploadDisabled }"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :headers="headerKey"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :limit="1"
            class="mb-10 ml-35"
          >
            &lt;!&ndash; <img v-if="imageUrl" :src="imageUrl" class="avatar" /> &ndash;&gt;
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            <div class="el-upload__text"> 上传头像 </div>
            <template #tip>
              <div class="el-upload__tip" style="color: red">
                只能上传jpg/png文件,且不超过500kb
              </div>
            </template>
            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <el-icon><Download /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                                                                                                                                                                class="el-upload-list__item-delete"
                                                                                                                                                                @click="handleRemove"
                                                                                                                                                              >
                                                                                                                                                                <el-icon><Delete /></el-icon>
                                                                                                                                                              </span>
                                                                                                                                                            </span>
                                                                                                                                                          </div>
                                                                                                                                                        </template>
                                                                                                                                                      </el-upload>-->
            <el-upload class="avatar-uploader" action="/charity-system/api/files/upload" :show-file-list="false"
              :headers="headerKey" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <div v-else style="display: flex; justify-content: center; align-items: center"><el-icon
                  class="avatar-uploader-icon">
                  <Plus />
                </el-icon><span style="color: #8c939d; font-size: 18px">上传图片</span></div>
              <template #tip>
                <div class="el-upload__tip" style="color: red">
                  只能上传jpg/png文件,且不超过500kb
                </div>
              </template>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
            <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="当前机构" prop="orgName" class="w-400px mr-40px">
                    <el-input :disabled="userStore.pageTitle == '编辑'" v-model="form.orgName" readonly
                      placeholder="请选择左侧树中机构" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户姓名" prop="nickname" class="w-400px ">
                    <el-input v-model="form.nickname" :disabled="userStore.pageTitle == '编辑'" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item v-if="userStore.pageTitle == '新增'" label="账号" prop="username" class="w-400px mr-40px">
                    <el-input v-model="form.username" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item v-if="userStore.pageTitle == '新增'" label="密码" prop="password" class="w-400px">
                    <el-input v-model="form.password" type="password" show-password />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="mobile" class="w-400px mr-40px">
                    <el-input v-model="form.mobile" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证" prop="idNumber" class="w-400px">
                    <el-input v-model="form.idNumber" :disabled="userStore.pageTitle == '编辑'" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="省" class="w-400px  mr-40px">
                    <el-select v-model="form.provinceName" placeholder="请选择" @change="proChange">
                      <el-option v-for="item in proList" :key="item.distId" :label="item.label" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="市" class="w-400px">
                    <el-select v-model="form.cityName" placeholder="请选择" @change="cityChange">
                      <el-option v-for="item in cityList" :key="item.distId" :label="item.label" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="区" class="w-400px  mr-40px">
                    <el-select v-model="form.countyName" placeholder="请选择" @change="countyChange">
                      <el-option v-for="item in countyList" :key="item.distId" :label="item.label" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email" class="w-400px">
                    <el-input v-model="form.email" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="form-bottom">
              <el-button @click="showEditPageClose">取消</el-button>
              <el-button v-if="userStore.pageTitle == '新增'" type="primary" @click="onSubmit(ruleFormRef)">确认</el-button>
              <el-button v-else type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
            </div>
          </div>
          <!-- </el-card> -->
        </div>
      </div>
    </el-card>
  </div>
  <!-- 选择公益组织对话框 -->
  <el-dialog v-model="pwoDialog" title="请先选择公益组织" width="40%" class="pwoDialog" top="15vh" :draggable="true"
    :show-close="false" :close-on-click-modal="false">
    <el-row class="flex mt-10 mb-30">
      <span class="mr-4 mt-1">公益组织</span>
      <el-select v-model="pwoOrther.pwoOrtherName" placeholder="请输入">
        <el-option v-for="item in pwoList" :key="item.value" :label="item.label" :value="item.label"
          @click="changePwo(item)" clearable>
        </el-option>
      </el-select>
    </el-row>
    <el-row class="flex w-full mt-20px justify-end">
      <el-button @click="deletePwo">取消</el-button>
      <el-button type="primary" @click="choosePwo">确定</el-button>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import type {
  FormInstance,
  FormRules,
  // UploadFile,
  // UploadInstance,
  // UploadUserFile,
} from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import {
  // downloadImg,
  saveUser,
  // ImgDetail,
  editUser,
  detailUser,
  // roleList,
  gerOrg,
  queryOrganize
} from '../../../api/useradmin';
import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
import { editPageSubmitModal } from '/@/views/upms/model/baseUserAdmin';
import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/amcDistrict';
import { useUserAdminStore } from '/@/stores/modules/userModul';
// import { getStorage } from '/@/utils/storage';
// import type { UploadRawFile } from 'element-plus';

import { queryChildOrgTree } from '/@/views/upms/api/pbdOrg';
import { getAuthStorage } from '/@/utils/storage/auth';
import type Node from 'element-plus/es/components/tree/src/model/node';
const userStore = useUserAdminStore();
// let uploadDisabled = ref(false);
// let fileList = ref<UploadUserFile[]>([]);
// const uploadRef = ref<UploadInstance>();
const proList = ref<AmcDistrict[]>();
const cityList = ref<AmcDistrict[]>();
const countyList = ref<AmcDistrict[]>();
const pwoList = ref<pwoParams[]>([])
// 公益组织对话框
const pwoDialog = ref(false)
// const rolePage = ref<roleManyList[]>();
const emit = defineEmits(['submit']);
interface Tree {
  id?: string;
  orgName: string;
  orgCode?: string;
  orgLevel?: string;
  leaf?: boolean;
}
interface pwoParams {
  value: string;
  label: string;
}
// let msg: any = getStorage('USER__INFO__');
// console.log(msg.orgName,'sdjfghj');
let token = ref(sessionStorage.getItem('TOKEN__'));
const headerKey = ref({ Authorization: token.value });
type FormListType = {
  pwoId: string;
  pwoName: string;
  id: string;
  orgName: string;
  orgCode: string;
  username: string;
  nickname?: string;
  password: string;
  idNumber: string;
  // roleId: string;
  provinceName: string;
  cityName: string;
  countyName: string;
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  mobile: string;
  email: string;
  status: string;
  avatar: string;
  parentOrgCode: string
};
const ruleFormRef = ref<FormInstance>();
const data = ref<Tree[]>([]);
// 公益组织查询
const getPwo = () => {
  queryOrganize().then(res => {
    if (res.status === 200) {
      pwoList.value = res.data.result
    }
  })
}
// 对话框公益组织名称
const pwoOrther = ref({
  pwoOrtherName: '',
  pwoOrtherId: '',
})
// 对话框中选择公益组织
const changePwo = (item) => {
  pwoOrther.value.pwoOrtherId = item.value
  pwoOrther.value.pwoOrtherName = item.label
}
// 确定选择公益组织
const choosePwo = () => {
  if (pwoOrther.value.pwoOrtherName) {
    form.pwoName = pwoOrther.value.pwoOrtherName
    form.pwoId = pwoOrther.value.pwoOrtherId
    pwoDialog.value = false
    gerOrg(form.pwoId).then(res => {
      data.value = res.data.result
    })
  } else {
    ElMessage({
      message: '请选择公益组织后再进行新增操作',
      type: 'error',
    })
    pwoDialog.value = true
  }
}
// 头部的位置选组公益组织
const updatePwo = (item) => {
  form.pwoId = item.value
  form.orgName = ''
  gerOrg(form.pwoId).then(res => {
    data.value = res.data.result
  })
}
// 取消选择公益组织
const deletePwo = () => {
  // 重新回到主页面中
  userStore.isShowEditPageData = false
}
let form: FormListType = reactive({
  pwoName: '',
  pwoId: '',
  id: '',
  orgName: '',
  orgCode: '',
  username: '',
  nickname: '',
  password: '',
  idNumber: '',
  // roleId: '',
  provinceName: '',
  cityName: '',
  countyName: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  mobile: '',
  email: '',
  status: '',
  avatar: '',
  parentOrgCode: ''
});
const mobiles = (rule: any, value: any, callback: any) => {
  const red = /^1[34578]\d{9}$/;
  if (!red.test(value)) {
    console.log(rule);
    callback(new Error('输入正确手机号'));
  }
  callback();
};
const getIdNumber = (rule: any, value: any, callback: any) => {
  console.log(rule)
  const ID =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (value === '') {
    callback(new Error('请输入身份证号'));
  } else {
    if (!ID.test(value)) {
      callback(new Error('填写正确格式的18位身份证号'));
    } else {
    }
    callback();
  }
};
const Email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const getEmail = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value == '') {
    callback();
  }
  if (!Email.test(value)) {
    callback(new Error('输入正确的邮箱'));
  }
  callback();
  // if (value === '') {
  //   callback(new Error('请输入邮箱'));
  // } else {
  //   if (!Email.test(value)) {
  //     callback(new Error('填写正确格式的邮箱'));
  //   } else {
  //   }
  //   callback();
  // }
};
// const getUserName = (rule: any, value: any, callback: any) => {
//   const user1 = /^[0-9]*$/;
//   const user2 = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;
//   if (user1.test(value)) {
//     console.log(rule);
//     callback(new Error('不能是纯数字'));
//   } else if (user2.test(value)) {
//     callback(new Error('不能输入特殊字符'));
//   }
//   callback();
// };
// 账号自定义校验 字母开头 位数：6-20位（可以是大写字母、小写字母、数字）
const checkUsername = (rule, value, callback) => {
  console.log(rule);
  const num = /^[a-zA-Z]([a-zA-Z0-9]{5,20})$/;
  if (!num.test(value)) {
    callback(new Error('字母开头，包含大小写字母、数字，保证6位及以上'));
  } else {
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
      callback(new Error('包含大小写字母、数字及特殊字符，保证8位以上'));
    } else {
    }
    callback();
  }
};

const rules = reactive<FormRules>({
  orgName: [{ required: true, message: '请输入机构', trigger: 'change' }],
  username: [{ required: true, validator: checkUsername, trigger: 'change' }],
  nickname: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
  password: [{ required: true, validator: checkPassword, trigger: 'blur' }],
  // roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
  mobile: [{ required: true, validator: mobiles, trigger: 'blur' }],
  idNumber: [{ min: 18, max: 18, validator: getIdNumber, trigger: 'blur', required: true }],
  email: [{ validator: getEmail, trigger: 'blur' }],
});
//提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      form.avatar = imageUrl.value;
      if (userStore.pageTitle == '新增') {
        saveUser(form).then(() => {
          ElMessage({
            message: '新增成功',
            type: 'success',
          });
          showEditPageClose('add');
        });
      } else {
        editUser(form).then(() => {
          ElMessage({
            message: '保存成功',
            type: 'success',
          });
          showEditPageClose('modify');
        });
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
function getpro() {
  queryPro().then((res) => {
    proList.value = res;
  });
}
//省
function proChange(item) {
  form.provinceCode = item.value;
  form.provinceName = item.label;
  form.cityName = '';
  form.countyName = '';
  countyList.value = [];
  cityList.value = [];
  queryCity(item.value).then((res) => {
    cityList.value = res;
  });
}
//市
function cityChange(item) {
  form.cityCode = item.value;
  form.cityName = item.label;
  form.countyName = '';
  countyList.value = [];
  queryCounty(item.value).then((res) => {
    console.log(res);
    countyList.value = res;
  });
}
//区
function countyChange(item) {
  form.countyCode = item.value;
  form.countyName = item.label;
}
//市
watch(
  () => form.provinceCode,
  (newValue) => {
    console.log(newValue);

    queryCity(newValue).then((res) => {
      cityList.value = res;
    });
  },
);
//区
watch(
  () => form.cityCode,
  (newValue) => {
    queryCounty(newValue).then((res) => {
      countyList.value = res;
    });
  },
);
//取消提交
const showEditPageClose = (modal: editPageSubmitModal) => {
  modal = modal ? modal : 'cancel';
  emit('submit', modal);
};
//树
const props = {
  id: 'orgCode',
  value: 'orgCode',
  label: 'orgName',
};
const orgTreeClick = (node) => {
  form.orgName = node.orgName;
  form.orgCode = node.orgCode;
};
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  console.log(node, '1112');
  console.log(node.level, '1112');

  if (node.level === 0) {
    let dataTree = getAuthStorage();
    console.log(dataTree, 'dataTree');

    let orgTree = [
      { orgName: dataTree.orgName as string, orgCode: dataTree.orgCode as string },
    ];
    return resolve(orgTree);
  }
  if (node.level > 0) {
    queryChildOrgTree(node.data.orgCode).then((res) => {
      resolve(res);
    });
  }
};

//=============================
//上传头像
const imageUrl = ref('');
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  // uploadFile,
  // fileList,
) => {
  imageUrl.value = response.result.fileUrl;
  // if (fileList.length == 1) {
  //   uploadDisabled.value = true;
  // }
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
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
  if (rawFile.size / 1024 / 1024 > 0.5) {
    ElMessage.error({
      message: `上传文件大小不能超过${500}kb!`,
      type: 'warning',
    });
    return false;
  }
  return isLtType;
};
// const upload = ref<UploadInstance>();
// const handleExceed: UploadProps['onExceed'] = (files) => {
//   /*if (files.length >= 1) {
//     ElMessage.error({
//       message: `最多上传1张图片`,
//       type: 'warning',
//     });
//     return false;
//   }*/
//   upload.value!.clearFiles();
//   const file = files[0] as UploadRawFile;
//   upload.value!.handleStart(file);
// };
//预览上传图片
// const disabled = ref(false);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
// const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
//   // activitiesMrgList.value = uploadFiles;
//   console.log(uploadFile, uploadFiles, '22222222222222222');
// };

// const handlePictureCardPreview = (file: UploadFile) => {
//   dialogImageUrl.value = file.url!;
//   dialogVisible.value = true;
// };
// const handleDownload = (file: UploadFile) => {
//   console.log(file);
//   downloadImg();
// };
// 绑定在树控件上 在请求时变更数据 保证请求后重新渲染树形控件
const once = ref(0)
onMounted(() => {
  if (userStore.pageTitle == '编辑') {
    detailUser(userStore.editData.id).then((res) => {
      Object.keys(res).forEach((key) => {
        form[key] = res[key];
      });
      imageUrl.value = res.avatar;
      // 编辑进入页面后通过公益组织展示机构树
      gerOrg(form.pwoId).then(res => {
        data.value = res.data.result
        once.value += 1
      })
    });
  }
  getpro();
  if (userStore.pageTitle == '新增') {
    // pwoDialog.value = true
    // form.orgName = msg.orgName;
    // form.orgCode = msg.orgCode;
  }

  getPwo()
  // const params = {
  //   pageNum: 1,
  //   pageSize: 1000,
  // };
  // roleList(params).then((res) => {
  //   rolePage.value = res.records;
  // });
});
</script>
<style scoped>
.dept-all {
  display: flex;
  width: 100%;
  /* height: 101%; */
  /* background: #f0f0f0; */
  /* min-height: 70vh; */
  overflow-y: auto;
}

.dept-left {
  width: 280px;
  margin: 5px;
  background: white;
  /* overflow-y: auto; */

}

.dept-right {
  flex: 1;
  margin: 5px;
  background: white;
  /* overflow-y: auto; */
}

.midDicider {
  min-height: 76vh;
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.avatar-uploader > .el-upload) {
  border: 1px dashed #e2e2e2;
  width: 160px;
  height: 160px;
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

:deep(.el-divider--horizontal) {
  margin: 5px 0;
}

.form-bottom {
  display: flex;
  justify-content: center;
}

.form-all {
  padding: 10px;
  /* height: 100%;
    overflow-y: auto; */
}

:deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* :deep(.el-input) {
  width: 200px;
} */

:deep(.el-form-item__content) {
  width: 200px;
}

:deep(.el-form-item__content > .el-select) {
  width: 100%;
}

.disabledclass :deep(.el-upload--picture-card) {
  display: none !important;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

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
  /* width: 178px; */
  height: 178px;
  text-align: center;
}

:deep(.el-card__body) {
  /* height: calc(100% - 58px); */
  overflow-y: auto;
}
</style>
