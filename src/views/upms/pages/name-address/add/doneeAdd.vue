<route lang="yaml">
name: addressAdd
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">受捐人{{ buttonType == '1' ? '新增' : '编辑' }}</h1>
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
          <el-form-item label="受捐人姓名" prop="doneeName" class="gy-form-item-col">
            <el-input
              v-model="ruleForm.doneeName"
              placeholder="请输入受捐人姓名"
              ref="cmd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex" class="gy-form-item-col">
            <el-select v-model="ruleForm.sex" placeholder="请选择性别">
              <el-option
                v-for="dict in dicLists"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="年龄" prop="age" class="gy-form-item-col">
            <el-input v-model="ruleForm.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="受捐人联系电话"
            prop="phoneNumber"
            class="gy-form-item-col"
          >
            <el-input v-model="ruleForm.phoneNumber" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard" class="gy-form-item-col">
            <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="所在省" prop="provinceName" class="gy-form-item-col">
            <el-select
              v-model="ruleForm.provinceName"
              placeholder="请选择省"
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在地市" prop="cityName" class="gy-form-item-col">
            <el-select
              v-model="ruleForm.cityName"
              placeholder="请选择地市"
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
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="所在区县" prop="countyName" class="gy-form-item-col">
            <el-select
              v-model="ruleForm.countyName"
              placeholder="请选择区县"
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="doneeAddr" class="gy-form-item-col">
            <el-input v-model="ruleForm.doneeAddr" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item
            label="紧急联系人姓名 "
            prop="urgentName"
            class="gy-form-item-col"
          >
            <el-input
              v-model="ruleForm.urgentName"
              placeholder="请输入紧急联系人姓名 "
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="紧急联系人关系"
            prop="urgentRelation"
            class="gy-form-item-col"
          >
            <el-select
              v-model="ruleForm.urgentRelation"
              placeholder="请选择紧急联系人关系"
            >
              <el-option
                v-for="dict in urgentdicLists"
                :key="dict.value"
                :label="dict.name"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item
            label="紧急联系人电话"
            prop="urgentPhone"
            class="gy-form-item-col"
          >
            <el-input
              v-model="ruleForm.urgentPhone"
              placeholder="请输入紧急联系人电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="情况概述" prop="doneeExplain" class="gy-form-item-col">
            <el-input v-model="ruleForm.doneeExplain" placeholder="请输入情况概述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="身份正面照" prop="frontID" class="gy-form-item-col">
            <el-upload
              ref="uploadRef"
              action="/charity-system/api/files/upload"
              list-type="picture-card"
              :auto-upload="true"
              :on-success="handleAvatarSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :headers="headerKey"
              v-model:file-list="fileList"
              name="file"
              :on-change="handleChange"
              :limit="1"
              :disabled="Exceedis"
            >
              <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              <div class="el-upload__text"> 上传图片 </div>
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份反面照" prop="reverseID" class="gy-form-item-col">
            <el-upload
              ref="uploadRef"
              action="/charity-system/api/files/upload"
              list-type="picture-card"
              :auto-upload="true"
              :on-success="handleReveSuccess"
              :on-remove="handleReveRemove"
              :before-upload="beforeAvatarUpload"
              :on-exceed="handleReveExceed"
              :on-preview="handlePictureCardPreview"
              :headers="headerKey"
              v-model:file-list="fileListreve"
              name="file"
              :on-change="handleReveChange"
              :limit="1"
              :disabled="ReveExceedDis"
            >
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              <div class="el-upload__text"> 上传图片 </div>
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
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="其他凭证" prop="doneeMsg" class="gy-form-item-col">
            <el-upload
              ref="uploadRef"
              action="/charity-system/api/files/upload"
              list-type="picture-card"
              :auto-upload="true"
              :on-success="handledoneeMsgSuccess"
              :on-remove="handledoneeMsgRemove"
              :before-upload="beforedoneeMsgUpload"
              :on-exceed="handledoneeMsgExceed"
              :on-preview="handledoneeMsgPreview"
              :headers="headerKey"
              v-model:file-list="fileListtow"
              name="file"
              :on-change="handledoneeMsgChange"
              :limit="4"
              :disabled="doneeMsgExceedDis"
            >
              <!-- <img v-if="imageUrldoneeMsg" :src="imageUrldoneeMsg" class="avatar" /> -->
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              <div class="el-upload__text"> 上传图片 </div>
              <template #tip>
                <div class="el-upload__tip" style="color: red">
                  最多上传不能超过4张图片,图片大小不要超过5M,第一张为主图,其他均为宣传图
                </div>
              </template>
            </el-upload>
            <el-dialog v-model="dialogdoneeMsgVisible">
              <img w-full :src="dialogdoneeMsgImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>

      <!--    按钮剧中放开此处注释  -->
      <!--      <el-row class="flex justify-center w-full ml-84px">-->
      <!--        <el-button @click="showEditPageClose">取消</el-button>-->
      <!--        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>-->
      <!--      </el-row>-->
    </el-form>
    <el-form
      ref="quillFormRef"
      :model="quillForm"
      :rules="quillRules"
      label-width="84px"
      class="gy-form flex flex-col flex-wrap justify-start item-start w-full"
      size="default"
      status-icon
    >
      <el-row class="w-full">
        <el-form-item
          label="情况介绍"
          prop="doneeIntroduce"
          class="w-full mr-40px editor"
        >
          <div class="w-full">
            <QuillEditor
              class="h-390px w-full editorBorder"
              :content="quillForm.doneeIntroduce"
              :imgageUrl="imgageUrl"
              :isUpdated="isUpdated"
              @change="getQuillContent"
              :isError="isError"
              @blur="getQuillContent"
              @uploadFile="quillUploadFile"
              @updateDone="quillUpdateDone"
            />
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row class="flex justify-center w-full ml-84px">
      <el-button @click="showEditPageClose">取消</el-button>
      <el-button type="primary" @click="submitFrom(ruleFormRef)">保存</el-button>
    </el-row>
  </div>
</template>

<script lang="ts" setup name="addressAdd">
  import { reactive, ref, defineEmits, onMounted, watch, nextTick } from 'vue';
  import {
    FormRules,
    FormInstance,
    ElMessage,
    ElLoading,
    UploadProps,
    UploadFile,
    UploadRawFile,
    // UploadUserFile,
  } from 'element-plus';
  // import { useRouter } from 'vue-router';
  // import dayjs from 'dayjs';
  import { AddressSaveParams } from '/@/views/upms/model/doneeModel';
  import {
    doneeAdd,
    doneeEdit,
    queryList,
    doneeDetail,
    doneeDownload,
    getBase64,
    doneeUpload,
  } from '/@/views/upms/api/doneeDecla';
  import { useUpmsAddress } from '/@/stores/modules/address';
  import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/amcDistrict';
  import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
  import QuillEditor from '/@/components/sys/QuillEditor';
  const useUpmsAddressStore = useUpmsAddress();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<AddressSaveParams>({});
  const proList = ref<AmcDistrict[]>();
  const cityList = ref<AmcDistrict[]>();
  const countyList = ref<AmcDistrict[]>();
  // const router = useRouter();
  const emit = defineEmits(['closeRefresh']);
  let fileList = ref<UploadFile[]>([]);
  let fileListtow = ref<UploadFile[]>([]);
  let fileListreve = ref<UploadFile[]>([]);
  // 定义光标在第一个输入框中
  const cmd = ref();
  type flagPage = {
    name: string;
    id: string;
  };
  type urgentPage = {
    name: string;
    value: string;
  };
  //上传图片 携带请求头
  let token = ref(sessionStorage.getItem('TOKEN__'));
  const headerKey = ref({ Authorization: token.value });
  const dicLists = ref<flagPage[]>([]);
  const urgentdicLists = ref<urgentPage[]>([]);
  const changeGroup = () => {
    queryList('urgentRelation').then((res) => {
      console.log('urgentRelation', res);
      urgentdicLists.value = res.data;
    });
    queryList('gender').then((res) => {
      console.log(res);
      dicLists.value = res.data;
    });
  };
  function init() {
    if (useUpmsAddressStore.$state.isEditing) {
      buttonType.value = '2';
      doneeDetail(useUpmsAddressStore.$state.editDataInfo.id as string).then((res) => {
        ruleForm.value = res;

        quillForm.doneeIntroduce = ruleForm.value.doneeIntroduce as string;
        isUpdated.value = true;

        handleDownload();
        handleDownloadLi();
        handleDownloadreve();
      });
    }
  }
  /**
   * 初始化方法
   */
  onMounted(async () => {
    init();
    getpro();
    changeGroup();
    nextTick(() => {
      cmd.value.focus();
    });
  });
  /**
   * 字典变量，页面不涉及请删除
   */
  // const dicLists = ref<AddressSaveParams>([]);
  // 关闭 新增/编辑 before
  const showEditPageClose = (type) => {
    type ? 'close' : type;
    emit('closeRefresh', type);
    useUpmsAddressStore.resetState();
  };
  // 新增/编辑 表单
  const mobiles = (rule: any, value: any, callback: any) => {
    const red = /^1[34578]\d{9}$/;
    if (!red.test(value)) {
      console.log(rule);
      callback(new Error('输入正确手机号'));
    }
    callback();
  };
  const mobilesphone = (rule: any, value: any, callback: any) => {
    const red = /^1[34578]\d{9}$/;
    if (!red.test(value)) {
      console.log(rule);
      callback(new Error('输入正确手机号'));
    }
    callback();
  };
  const getIdNumber = (rule: any, value: any, callback: any) => {
    const ID =
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (value == '') {
      callback();
    }
    if (!ID.test(value)) {
      console.log(rule);
      callback(new Error('输入正确的身份证号'));
    }

    callback();
  };
  //不能是纯中文
  const getNickname = (rule: any, value: any, callback: any) => {
    // const nickname = /^[0-9a-zA-Z]{4,23}$/;
    const nickname = /^[0-9]+$/;
    if (value === '') {
      callback(new Error('请输入年龄'));
    } else if (!nickname.test(value)) {
      console.log(rule);
      callback(new Error('不能输入中文或特殊字符或英文'));
    }
    callback();
  };
  //不能是纯数字
  const getUserName = (rule: any, value: any, callback: any) => {
    const user1 = /^[0-9]*$/;
    const user2 = /[^\u4E00-\u9FA5]/;
    if (value === '') {
      callback(new Error('请输入受捐人姓名'));
    } else if (user1.test(value)) {
      console.log(rule);
      callback(new Error('不能是纯数字'));
    } else if (user2.test(value)) {
      callback(new Error('不能输入特殊字符或英文'));
    }
    callback();
  };
  //不能是纯数字
  const getRelationName = (rule: any, value: any, callback: any) => {
    const user1 = /^[0-9]*$/;
    const user2 = /[^\u4E00-\u9FA5]/;
    if (value === '') {
      callback(new Error('请输入紧急联系人姓名'));
    } else if (user1.test(value)) {
      console.log(rule);
      callback(new Error('不能是纯数字'));
    } else if (user2.test(value)) {
      callback(new Error('不能输入特殊字符或英文'));
    }
    callback();
  };
  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    provinceName: [{ required: true, message: '请选择省', trigger: 'change' }],
    cityName: [{ required: true, message: '请选择地市', trigger: 'change' }],
    countyName: [{ required: true, message: '请选择区县', trigger: 'change' }],
    doneeAddr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    phoneNumber: [{ required: true, validator: mobiles, trigger: 'blur' }],
    idCard: [{ required: true, validator: getIdNumber, trigger: 'blur' }],
    urgentName: [{ required: true, validator: getRelationName, trigger: 'blur' }],
    urgentRelation: [
      { required: true, message: '请选择紧急联系人关系', trigger: 'change' },
    ],
    urgentPhone: [{ required: true, validator: mobilesphone, trigger: 'blur' }],
    doneeExplain: [{ required: true, message: '请输入情况概述', trigger: 'blur' }],
    doneeIntroduce: [{ required: true, message: '请输入情况介绍', trigger: 'blur' }],
    // idCardMsg: [
    //   { required: true, message: '请上传身份证件', trigger: '[blur,change]' },
    // ],
    frontID: [{ required: true, message: '请上传身份证件', trigger: 'change' }],
    reverseID: [{ required: true, message: '请上传身份证件', trigger: 'change' }],
    doneeMsg: [{ required: true, message: '请上传其他凭证', trigger: 'change' }],
    doneeName: [{ required: true, validator: getUserName, trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    age: [{ required: true, validator: getNickname, trigger: 'blur' }],
  });

  //上传图片 其他凭证  上传成功
  //存储上传图片路径
  const previewImgdoneeMsg = ref<string[]>([]);
  const doneeMsgMrgList = ref<string[]>([]);
  //上传图片
  const imageUrldoneeMsg = ref('');
  //删除
  const handledoneeMsgRemove = (uploadFile, uploadFiles: string[]) => {
    doneeMsgMrgList.value = uploadFiles;
    console.log(uploadFile, uploadFiles, '22222222222222222');
  };
  const handledoneeMsgSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    // console.log(response, 2221111111111);
    doneeMsgMrgList.value.push(response.result.filePath);
    if (doneeMsgMrgList.value.length >= 4) {
      doneeMsgExceedDis.value = true;
    }
    imageUrldoneeMsg.value = URL.createObjectURL(uploadFile.raw!);
  };
  const doneeMsgExceedDis = ref(false);
  const handledoneeMsgExceed = (files: File[]) => {
    console.log('files', files);

    if (files.length >= 4) {
      ElMessage.error({
        message: `最多上传不能超过4张图片`,
        type: 'warning',
      });
      return;
    }
  };
  const handledoneeMsgChange: UploadProps['onChange'] = (uploadFile) => {
    previewImgdoneeMsg.value.push(uploadFile.url as string);
  };
  const beforedoneeMsgUpload: UploadProps['beforeUpload'] = (
    rawFile: UploadRawFile,
  ) => {
    // 获取后缀名
    const suffix = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1);
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
  //预览上传图片
  // const disabled = ref(false);
  const dialogdoneeMsgImageUrl = ref('');
  const dialogdoneeMsgVisible = ref(false);
  //预览图片
  const handledoneeMsgPreview = (file: UploadFile) => {
    dialogdoneeMsgImageUrl.value = file.url!;
    dialogdoneeMsgVisible.value = true;
  };
  //其他凭证 下载图片;
  const handleDownload = () => {
    // doneeMsgMrgList.value = (ruleForm.value.doneeMsg as string).split(',');
    doneeMsgMrgList.value = ruleForm.value.doneeMsg as string[];
    console.log('ruleForm.value.doneeMsg', ruleForm.value.doneeMsg);

    let Data = '';

    doneeMsgMrgList.value.forEach((key) => {
      Data = key;
      doneeDownload(Data).then((res) => {
        getBase64(res.data, res.data.type).then((base64) => {
          let value = base64 as string;
          fileListtow.value.push({
            url: value,
            name: '',
            status: 'ready',
            uid: 0,
          });
        });
      });
    });
  };
  // 身份证 下载图片
  const handleDownloadLi = () => {
    // activitiesMrgList.value = (ruleForm.value.idCardMsg as string).split(',');
    activitiesMrgList.value = ruleForm.value.idCardMsg as string[];
    let Data = '';
    Data = activitiesMrgList.value[0];
    // activitiesMrgList.value.forEach((key) => {
    //   Data = key;
    doneeDownload(Data).then((res) => {
      getBase64(res.data, res.data.type).then((base64) => {
        let value = base64 as string;
        fileList.value.push({
          url: value,
          name: '',
          status: 'ready',
          uid: 0,
        });
      });
    });
    // });
  };

  //上传图片  上传成功
  //存储上传图片路径
  const previewImg = ref<string[]>([]);
  const activitiesMrgList = ref<string[]>([]);
  //上传图片
  const imageUrl = ref('');
  //删除
  const handleRemove = (uploadFile, uploadFiles: string[]) => {
    activitiesMrgList.value = uploadFiles;
    console.log(uploadFile, uploadFiles, '22222222222222222');
  };
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    console.log(response, 1111111111);

    activitiesMrgList.value.push(response.result.filePath);
    if (activitiesMrgList.value.length >= 1) {
      Exceedis.value = true;
    }
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    console.log(response, 1111111111, activitiesMrgList.value);
  };
  const Exceedis = ref(false);
  const handleExceed = (files: File[]) => {
    if (files.length >= 1) {
      Exceedis.value = true;
      ElMessage.error({
        message: `最多上传不能超过1张图片`,
        type: 'warning',
      });
      return;
    }
  };

  const handleChange: UploadProps['onChange'] = (uploadFile) => {
    previewImg.value.push(uploadFile.url as string);
  };
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
  //预览上传图片
  // const disabled = ref(false);
  const dialogImageUrl = ref('');
  const dialogVisible = ref(false);
  //预览图片
  const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
  };
  //身份证反面
  const ReveImg = ref<string[]>([]);
  const ReveList = ref<string[]>([]);
  //上传图片
  const imageReveUrl = ref('');
  //删除
  const handleReveRemove = (uploadFile, uploadFiles: string[]) => {
    ReveList.value = uploadFiles;
    console.log(uploadFile, uploadFiles, '22222222222222222');
  };
  const handleReveSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    console.log(response, 1111111111);
    ReveList.value.push(response.result.filePath);
    if (ReveList.value.length >= 1) {
      ReveExceedDis.value = true;
    }
    imageReveUrl.value = URL.createObjectURL(uploadFile.raw!);
  };
  const ReveExceedDis = ref(false);
  const handleReveExceed = (files: File[]) => {
    if (files.length >= 1) {
      ReveExceedDis.value = true;
      ElMessage.error({
        message: `最多上传不能超过1张图片`,
        type: 'warning',
      });
      return;
    }
  };

  const handleReveChange: UploadProps['onChange'] = (uploadFile) => {
    ReveImg.value.push(uploadFile.url as string);
  };
  // 身份证反面 下载图片
  const handleDownloadreve = () => {
    // ReveList.value = (ruleForm.value.idCardMsg as string).split(',', 2);
    ReveList.value = ruleForm.value.idCardMsg as string[];
    let Data = '';
    Data = ReveList.value[1];
    // ReveList.value.forEach((key) => {
    // Data = key;
    doneeDownload(Data).then((res) => {
      getBase64(res.data, res.data.type).then((base64) => {
        let value = base64 as string;
        fileListreve.value.push({
          url: value,
          name: '',
          status: 'ready',
          uid: 0,
        });
      });
    });
    // });
  };
  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    let imgList = '';
    let doneeimgList = '';
    let reveImgList = '';
    console.log('qwert', activitiesMrgList.value, ReveList.value);

    // 上传图片的id
    for (let i = 0; i < activitiesMrgList.value.length; i++) {
      if (i == 0) {
        // imgList = activitiesMrgList.value[i].url as string;
        imgList = activitiesMrgList.value[i] as string;
      } else {
        // imgList = imgList + ',' + activitiesMrgList.value[i].url;
        imgList = imgList + ',' + activitiesMrgList.value[i];
      }
    }
    for (let i = 0; i < ReveList.value.length; i++) {
      if (i == 0) {
        // imgList = activitiesMrgList.value[i].url as string;
        reveImgList = ReveList.value[i] as string;
      } else {
        // imgList = imgList + ',' + activitiesMrgList.value[i].url;
        reveImgList = imgList + ',' + ReveList.value[i];
      }
    }
    for (let i = 0; i < doneeMsgMrgList.value.length; i++) {
      if (i == 0) {
        // doneeimgList = doneeMsgMrgList.value[i].url as string;
        doneeimgList = doneeMsgMrgList.value[i] as string;
      } else {
        // doneeimgList = doneeimgList + ',' + doneeMsgMrgList.value[i].url;
        doneeimgList = doneeimgList + ',' + doneeMsgMrgList.value[i];
      }
    }
    ruleForm.value.idCardMsg = imgList + ',' + reveImgList;
    ruleForm.value.frontID = imgList + ',' + reveImgList;
    ruleForm.value.reverseID = imgList + ',' + reveImgList;
    ruleForm.value.doneeMsg = doneeimgList;
    if (!formEl) return;
    checkForm();

    // 表单校验
    await formEl.validate((valid) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: '正在保存数据...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        if (buttonType.value === '1') {
          doneeAdd(ruleForm.value)
            .then(() => {
              // if (res.msg == '成功') {
              ElMessage({
                message: '保存成功！',
                type: 'success',
              });
              showEditPageClose('submit');
              // }
            })
            .finally(() => {
              loading.close();
            });
        } else {
          delete ruleForm.value.applyTime;
          doneeEdit(ruleForm.value)
            .then(() => {
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

  //三级联动
  function getpro() {
    queryPro().then((res) => {
      proList.value = res;
    });
  }
  //省
  function proChange(item) {
    ruleForm.value.provinceCode = item.value;
    ruleForm.value.provinceName = item.label;
    ruleForm.value.cityName = '';
    ruleForm.value.countyName = '';
    ruleForm.value.doneeAddr = '';
    ruleForm.value.doneeAddr = ruleForm.value.provinceName;
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
    ruleForm.value.doneeAddr = '';
    ruleForm.value.doneeAddr =
      (ruleForm.value.provinceName as string) + ruleForm.value.cityName;
    countyList.value = [];
    queryCounty(item.value).then((res) => {
      console.log(res);
      countyList.value = res;
    });
  }
  //区
  function countyChange(item) {
    console.log('countyChange item', item);

    ruleForm.value.countyCode = item.value;
    ruleForm.value.countyName = item.label;
    ruleForm.value.doneeAddr = '';
    ruleForm.value.doneeAddr =
      (ruleForm.value.provinceName as string) +
      ruleForm.value.cityName +
      ruleForm.value.countyName;
  }
  //市
  watch(
    () => ruleForm.value.provinceCode,
    (newValue) => {
      console.log(newValue);

      queryCity(newValue).then((res) => {
        cityList.value = res;
      });
    },
  );
  //区
  watch(
    () => ruleForm.value.cityCode,
    (newValue) => {
      queryCounty(newValue).then((res) => {
        countyList.value = res;
      });
    },
  );
  // 富文本编辑器 form================
  const quillFormRef = ref<FormInstance>();
  // 校验时显示错误信息
  const isError = ref<boolean>(false);
  // 是否更新 富文本编辑器中的内容
  const isUpdated = ref<boolean>(false);
  const quillUpdateDone = () => {
    isUpdated.value = false;
  };
  interface quillFormModel {
    doneeIntroduce: string;
  }
  const quillForm: quillFormModel = reactive({
    doneeIntroduce: '',
  });
  const quillRules = reactive<FormRules>({
    doneeIntroduce: [{ required: true, message: '填写文字介绍', trigger: 'change' }],
  });
  // 进入页面富文本判断标志
  const num = ref(0);
  // 获取富文本中的内容 Quill change      uploadFile
  const getQuillContent = (obj: any) => {
    // 首次进入页面 首次blur事件 不检验富文本
    if (num.value == 0) {
      num.value += 1;
    } else {
      // blur 和change事件都进行检验
      // if (obj.content != undefined) {
      quillForm.doneeIntroduce = obj.content == '<p><br></p>' ? '' : obj.content;
      ruleForm.value.doneeIntroduce = quillForm.doneeIntroduce;
      console.log(ruleForm.value.doneeIntroduce, 'ruleForm.value.doneeIntroduce ');
      console.log(quillForm.doneeIntroduce, 'quillForm.doneeIntroduce ');

      checkForm();
      // }
    }
  };
  const checkForm = async () => {
    // 表单校验
    await (quillFormRef.value as FormInstance).validate((valid) => {
      if (valid) {
        isError.value = false;
      } else {
        isError.value = true;
      }
    });
  };

  const imgageUrl = ref<string>('');
  // 富文本 上传图片
  const quillUploadFile = (obj: any) => {
    const loading = ElLoading.service({
      lock: true,
      text: 'loading...',
      background: 'rgba(255, 255, 255, 0.7)',
    });
    obj.formData = new FormData();
    obj.formData.append('file', obj.files);

    doneeUpload(obj.formData)
      .then((res) => {
        ruleForm.value.doneeIntroduce = res.data.result.fileUrl;
        imgageUrl.value = ruleForm.value.doneeIntroduce as string;
      })
      .finally(() => {
        loading.close();
      });
    // console.log(' quillUploadFile obj', obj.files);
  };
</script>
<style scoped>
  @import url('/@/styles/chinapost/admcDefaultStyle.css');
  :deep(.ql_editor) {
    height: 200px;
  }
</style>
