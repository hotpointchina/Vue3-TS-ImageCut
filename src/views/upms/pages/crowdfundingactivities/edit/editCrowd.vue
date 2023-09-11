<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">{{ crowdStore.pageTitle }}</h1>
    </div>
    <el-divider content-position="left">基本信息</el-divider>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="gy-form flex flex-row flex-wrap justify-start item-start w-full"
      size="default"
      status-icon
    >
      <el-form-item label="活动图片" prop="activitiesMrg" class="w-750px mr-40px">
        <el-upload
          ref="uploadRef"
          action="/charity-system/api/files/uploadImage"
          list-type="picture-card"
          :auto-upload="true"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :on-preview="handlePictureCardPreview"
          :headers="headerKey"
          v-model:file-list="fileList"
          name="fileDate"
          :on-change="handleChange"
          :limit="6"
          :disabled="crowdStore.justView"
        >
          <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
          <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          <div class="el-upload__text"> 上传图片 </div>
          <template #tip>
            <div class="el-upload__tip" style="color: red">
              最多上传不能超过6张图片,图片大小不要超过5M
            </div>
          </template>
          <!--  <template #file="{ file }">
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
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template> -->
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item class="w-430px mr-40px" />
      <el-form-item label="项目名称" prop="activitiesName" class="w-590px mr-40px">
        <el-input
          :autofocus="true"
          v-model="ruleForm.activitiesName"
          placeholder="请输入活动名称"
          ref="cmd"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item
        label="活动备案编号"
        prop="activitiesRecordCode"
        class="w-590px mr-40px"
      >
        <el-input
          v-model="ruleForm.activitiesRecordCode"
          placeholder="请输入活动备案编号"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item label="活动负责人" prop="head" class="w-590px mr-40px">
        <el-input
          v-model="ruleForm.head"
          placeholder="请输入负责人"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber" class="w-590px mr-40px">
        <el-input
          v-model="ruleForm.phoneNumber"
          placeholder="请输入联系方式"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item label="负责人简介" class="w-590px mr-40px">
        <el-input
          v-model="ruleForm.headIntroduction"
          placeholder="请输入内容"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item label="活动期限" prop="activitiesTerm" class="w-590px mr-40px">
        <el-radio-group
          v-model="ruleForm.activitiesTerm"
          :disabled="crowdStore.justView"
        >
          <el-radio label="长期" />
          <el-radio label="短期" />
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="活动开始时间"
        prop="activitiesStartTime"
        class="w-590px mr-40px"
        v-if="ruleForm.activitiesTerm == '短期'"
      >
        <el-date-picker
          v-model="ruleForm.activitiesStartTime"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择活动开始时间"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item
        label="活动结束时间"
        prop="activitiesEndTime"
        class="w-590px mr-40px"
        v-if="ruleForm.activitiesTerm == '短期'"
      >
        <el-date-picker
          v-model="ruleForm.activitiesEndTime"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择活动结束时间"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item label="是否设置筹款目标" prop="isSetTarget" class="w-590px mr-40px">
        <el-radio-group v-model="ruleForm.isSetTarget" :disabled="crowdStore.justView">
          <el-radio label="不设置" />
          <el-radio label="设置" />
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item label="状态" prop="status" class="w-590px mr-40px">
        <el-select v-model="ruleForm.status" placeholder="请选择状态">
          <el-option label="启用" value="启用" />
          <el-option label="停用" value="停用" />
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="筹款目标"
        prop="donationTarget"
        class="w-590px mr-40px"
        v-if="ruleForm.isSetTarget == '设置'"
      >
        <el-input
          v-model="ruleForm.donationTarget"
          placeholder="请输入"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
      <el-form-item label="活动简介" prop="explainn" class="w-1222px mr-40px">
        <el-input
          v-model="ruleForm.explainn"
          placeholder="请输入内容"
          type="textarea"
          :disabled="crowdStore.justView"
        />
      </el-form-item>
    </el-form>
    <!-- 富文本 -->
    <el-form
      v-for="(item, index) in quillFormFor"
      :ref="'quillFormRef' + index"
      :model="quillForm"
      :rules="quillRules"
      label-width="84px"
      class="gy-form flex flex-col flex-wrap justify-start item-start w-full"
      size="default"
      status-icon
    >
      <el-row class="w-full">
        <el-form-item
          :label="item.label"
          :prop="item.value"
          :key="item.value"
          class="w-99% mr-40px h-300px"
          @click="quillFocus(index)"
        >
          <QuillEditor
            v-if="!crowdStore.justView"
            :content="quillForm[item.value]"
            :imgageUrl="item.imgageUrl"
            :isUpdated="item.isUpdated"
            @change="(obj) => btnHandler(obj, index)"
            @blur="(obj) => btnHandler(obj, index)"
            @uploadFile="(obj) => quillUploadFile(obj)"
            :isError="item.isError"
          />
          <div
            class="justsee_box"
            v-if="crowdStore.justView"
            v-html="quillForm[item.value]"
          ></div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row class="flex justify-center w-full mt-30px" v-if="!crowdStore.justView">
      <el-button @click="showEditPageClose" v-if="hasTitle === 0">取消</el-button>
      <el-button @click="cancel" v-if="hasTitle === 1">取消</el-button>
      <el-button
        type="primary"
        @click="submitFrom(ruleFormRef)"
        v-if="crowdStore.pageTitle === '众筹活动申报新增'"
        >保存</el-button
      >
      <el-button
        type="primary"
        @click="addSubmitFrom(ruleFormRef)"
        v-if="
          crowdStore.pageTitle === '众筹活动申报新增' ||
          crowdStore.pageTitle === '众筹活动流程申请'
        "
        >提交</el-button
      >
      <el-button
        type="primary"
        @click="submitFrom(ruleFormRef)"
        v-if="crowdStore.pageTitle == '众筹活动申报编辑'"
        >修改</el-button
      >
    </el-row>
  </div>
</template>

<script lang="ts" setup>
  import {
    onMounted,
    reactive,
    ref,
    nextTick,
    onUpdated,
    defineProps,
    defineEmits,
    // watch,
    // getCurrentInstance,
  } from 'vue';
  import {
    FormRules,
    FormInstance,
    ElMessage,
    UploadFile,
    UploadInstance,
    UploadProps,
    UploadRawFile,
    UploadUserFile,
    ElLoading,
    // UploadRequestOptions,
  } from 'element-plus';
  import {
    CrowdSaveParams,
    editPageSubmitModal,
  } from '/@/views/upms/model/crowdactivitiesModel';
  import {
    saveActivitys,
    getOnlyActivitys,
    editAddress,
    activitySubmit,
  } from '/@/views/upms/api/crowdFundingActivities';
  // import Editor from '/@/components/sys/Editor';
  import QuillEditor from '/@/components/sys/QuillEditor';
  import { useCrowdStore } from '/@/stores/modules/crowdfundModul';
  import { uploadFile } from '/@/views/upms/api/donation';
  // import { downloadFile, getBase64 } from '/@/views/upms/api/donation';
  import { useMessage } from '/@/hooks/web/useMesage';
  const { createMessage } = useMessage();
  const crowdStore = useCrowdStore();
  let fileList = ref<UploadUserFile[]>([]);
  const emit = defineEmits(['submit', 'cancel', 'inPageSubmit']);
  const props = defineProps(['flowData']);
  const uploadRef = ref<UploadInstance>();
  // 活动申报
  const ruleFormRef = ref<FormInstance>();
  // const localTableDataList = ref([]);
  const ruleForm = reactive<CrowdSaveParams>({
    id: '',
    activitiesMrg: '', //活动图片
    activitiesName: '', //项目名称
    activitiesRecordCode: '', //活动备案编号
    head: '', //活动负责人
    phoneNumber: '', //联系方式
    headIntroduction: '', //负责人简介
    activitiesTerm: '', //活动期限
    activitiesEndTime: '', //活动开始日期
    activitiesStartTime: '', //活动结束日期
    isSetTarget: '', //是否设置筹款目标
    donationTarget: '', //筹款目标
    introduce: '', //活动介绍
    explainn: '', //活动简介
    executionPlan: '', //执行计划
    budgetPlanning: '', //预算规划
    noteEnplain: '', //捐赠票据说明
    organIntroduction: '', //执行机构介绍
    surplusPropertyDispose: '', //剩余财产处置说明
    flagStatus: 0,
    msgCode: '',
  });
  // 关闭 新增/编辑 before
  const showEditPageClose = (modal: editPageSubmitModal) => {
    modal = modal ? modal : 'cancel';
    emit('submit', modal);
  };
  // 手机号自定义校验
  const regTelephone = /^[1][2,3,4,5,7,8][0-9]{9}$/;
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

  // 活动结束时间验证
  const checkEndTime = (rule: any, value: any, callback: any) => {
    console.log(rule);
    value = new Date(ruleForm.activitiesEndTime).getTime();
    const startTime = new Date(ruleForm.activitiesStartTime).getTime();
    let time = new Date();
    if (ruleForm.activitiesEndTime === '') {
      callback(new Error('请填写活动结束时间'));
    } else {
      if (startTime > value) {
        callback(new Error('结束时间不得小于开始时间'));
      } else if (value < time) {
        callback(new Error('结束时间不得小于当前时间'));
      }
      callback();
    }
  };
  //不能是纯数字
  const getUserName = (rule: any, value: any, callback: any) => {
    const user1 = /^[0-9]*$/;
    const user2 = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;
    if (value === '') {
      callback(new Error('请填写项目名称'));
    } else if (user1.test(value)) {
      console.log(rule);
      callback(new Error('不能是纯数字'));
    } else if (user2.test(value)) {
      callback(new Error('不能输入特殊字符'));
    }
    callback();
  };
  const gethead = (rule: any, value: any, callback: any) => {
    const user1 = /^[0-9]*$/;
    const user2 = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;
    if (value === '') {
      callback(new Error('请填写活动负责人'));
    } else if (user1.test(value)) {
      console.log(rule);
      callback(new Error('不能是纯数字'));
    } else if (user2.test(value)) {
      callback(new Error('不能输入特殊字符'));
    }
    callback();
  };
  //不能是纯中文
  const getNickname = (rule: any, value: any, callback: any) => {
    // const nickname = /^[0-9a-zA-Z]{4,23}$/;
    const nickname = /^[A-Za-z0-9]+$/;
    if (value === '') {
      callback(new Error('请填写活动备案编号'));
    } else if (!nickname.test(value)) {
      console.log(rule);
      callback(new Error('不能输入中文或特殊字符'));
    }
    callback();
  };
  //不能是纯中文
  const getNdonationTarget = (rule: any, value: any, callback: any) => {
    // const nickname = /^[0-9a-zA-Z]{4,23}$/;
    const nickname = /^[0-9]*$/;
    if (value === '') {
      callback(new Error('请输入筹款目标'));
    } else if (!nickname.test(value)) {
      console.log(rule);
      callback(new Error('只能输入数字'));
    }
    callback();
  };
  // 新增/编辑 表单
  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    activitiesName: [
      {
        required: true,
        validator: getUserName,
        trigger: 'blur',
      },
    ],
    activitiesRecordCode: [{ required: true, validator: getNickname, trigger: 'blur' }],
    activitiesStartTime: [
      { required: true, message: '请填写活动开始时间', trigger: 'blur' },
    ],
    activitiesEndTime: [{ validator: checkEndTime, trigger: 'blur', required: true }],
    head: [
      {
        required: true,
        validator: gethead,
        trigger: 'blur',
      },
    ],
    phoneNumber: [{ validator: checkTelephone, trigger: 'blur', required: true }],
    explainn: [{ required: true, message: '请输入活动简介', trigger: 'change' }],
    activitiesTerm: [{ required: true, message: '请选择活动期限', trigger: 'change' }],
    isSetTarget: [
      { required: true, message: '请选择是否设置筹款目标', trigger: 'change' },
    ],
    donationTarget: [
      { required: true, validator: getNdonationTarget, trigger: 'change' },
    ],
    //其他信息
    executionPlan: [{ required: true, message: '执行计划', trigger: 'blur' }],
    budgetPlanning: [{ required: true, message: '预算规划', trigger: 'change' }],
    noteEnplain: [{ required: true, message: '捐赠票据说明', trigger: 'change' }],
    organIntroduction: [{ required: true, message: '执行机构介绍', trigger: 'change' }],
    surplusPropertyDispose: [
      { required: true, message: '执行机构介绍', trigger: 'blur' },
    ],
  });
  //富文本数组
  const quillFormFor = reactive([
    {
      label: '活动介绍',
      value: 'introduce',
      isUpdated: false,
      isError: false,
      imgageUrl: '',
    },
    {
      label: '执行计划',
      value: 'executionPlan',
      isUpdated: false,
      isError: false,
      imgageUrl: '',
    },
    {
      label: '预算规划',
      value: 'budgetPlanning',
      isUpdated: false,
      isError: false,
      imgageUrl: '',
    },
    {
      label: '捐赠票据说明',
      value: 'noteEnplain',
      isUpdated: false,
      isError: false,
      imgageUrl: '',
    },
    {
      label: '执行机构介绍',
      value: 'organIntroduction',
      isUpdated: false,
      isError: false,
      imgageUrl: '',
    },
    {
      label: '剩余财产处置说明',
      value: 'surplusPropertyDispose',
      isUpdated: false,
      isError: false,
      imgageUrl: '',
    },
  ]);

  interface quillFormModel {
    // introduce: string; //活动介绍
    introduce: string; //活动简介
    executionPlan: string; //执行计划
    budgetPlanning: string; //预算规划
    noteEnplain: string; //捐赠票据说明
    organIntroduction: string; //执行机构介绍
    surplusPropertyDispose: string; //剩余财产处置说明
  }
  let quillForm: quillFormModel = reactive({
    // introduce: '', //活动介绍
    introduce: '', //活动简介
    executionPlan: '', //执行计划
    budgetPlanning: '', //预算规划
    noteEnplain: '', //捐赠票据说明
    organIntroduction: '', //执行机构介绍
    surplusPropertyDispose: '', //剩余财产处置说明
  });
  const quillRules = reactive<FormRules>({
    introduce: [{ required: true, message: '请输入活动介绍', trigger: 'change' }],
    //其他信息
    executionPlan: [{ required: true, message: '执行计划', trigger: 'change' }],
    budgetPlanning: [{ required: true, message: '预算规划', trigger: 'change' }],
    noteEnplain: [{ required: true, message: '捐赠票据说明', trigger: 'change' }],
    organIntroduction: [{ required: true, message: '执行机构介绍', trigger: 'change' }],
    surplusPropertyDispose: [
      { required: true, message: '剩余财产处置说明', trigger: ['change', 'blur'] },
    ],
  });
  const isMounted = ref(0);
  // 进入页面富文本判断标志
  // const num = ref(0);
  // 获取富文本中的内容 Quill change      uploadFile
  const btnHandler = (obj: any, index: string | number) => {
    switch (index) {
      case 0:
        quillForm.introduce = obj.content == '<p><br></p>' ? '' : obj.content;
        ruleForm.introduce = quillForm.introduce;
        break;

      case 1:
        quillForm.executionPlan = obj.content == '<p><br></p>' ? '' : obj.content;
        ruleForm.executionPlan = quillForm.executionPlan;
        break;
      case 2:
        quillForm.budgetPlanning = obj.content == '<p><br></p>' ? '' : obj.content;
        ruleForm.budgetPlanning = quillForm.budgetPlanning;
        break;
      case 3:
        quillForm.noteEnplain = obj.content == '<p><br></p>' ? '' : obj.content;
        ruleForm.noteEnplain = quillForm.noteEnplain;
        break;
      case 4:
        quillForm.organIntroduction = obj.content == '<p><br></p>' ? '' : obj.content;
        ruleForm.organIntroduction = quillForm.organIntroduction;
        break;
      case 5:
        quillForm.surplusPropertyDispose =
          obj.content == '<p><br></p>' ? '' : obj.content;
        ruleForm.surplusPropertyDispose = quillForm.surplusPropertyDispose;
        break;
    }
    // if (num.value == 0) {
    //   num.value += 1;
    // } else {
    //   // blur 和change事件都进行检验

    // }
    // watch(
    //   () => quillForm.introduce,
    //   (val) => {
    //     console.log(val, 'quillForm.introduce');
    //   },
    // );
    // if (
    //   quillFormRef0 &&
    //   quillFormRef1 &&
    //   quillFormRef2 &&
    //   quillFormRef3 &&
    //   quillFormRef4 &&
    //   quillFormRef5
    // ) {
    // console.log('btnHandler isMounted.value', isMounted.value);
    if (isMounted.value >= 6) {
      // console.log('btnHandler isMounted.value [if]', isMounted.value);
      checkForm(index);
    } else {
      isMounted.value++;
    }
    //   console.log(11);
    // }
  };
  const quillFormRef0 = ref<FormInstance>();
  const quillFormRef1 = ref<FormInstance>();
  const quillFormRef2 = ref<FormInstance>();
  const quillFormRef3 = ref<FormInstance>();
  const quillFormRef4 = ref<FormInstance>();
  const quillFormRef5 = ref<FormInstance>();
  //是否校驗是出錯 富文本編輯器中的内容
  const checkForm = async (index) => {
    // Object.keys(quillForm).forEach((key) => {
    //   quillForm[key] = quillForm[key].trimLeft();
    //   console.log(quillForm[key], 'quillForm[key]');
    // });
    // console.log(index, 'index');

    switch (index) {
      case 0:
        // 表单校验
        await (quillFormRef0.value![0] as FormInstance).validate((valid) => {
          if (valid) {
            quillFormFor[0].isError = false;
          } else {
            quillFormFor[0].isError = true;
          }
        });
        break;

      case 1:
        // 表单校验
        await (quillFormRef1.value![0] as FormInstance).validate((valid) => {
          if (valid) {
            quillFormFor[1].isError = false;
          } else {
            quillFormFor[1].isError = true;
          }
        });
        break;
      case 2:
        // 表单校验
        await (quillFormRef2.value![0] as FormInstance).validate((valid) => {
          if (valid) {
            quillFormFor[2].isError = false;
          } else {
            quillFormFor[2].isError = true;
          }
        });
        break;
      case 3:
        // 表单校验
        await (quillFormRef3.value![0] as FormInstance).validate((valid) => {
          if (valid) {
            quillFormFor[3].isError = false;
          } else {
            quillFormFor[3].isError = true;
          }
        });
        break;
      case 4:
        // 表单校验
        await (quillFormRef4.value![0] as FormInstance).validate((valid) => {
          if (valid) {
            quillFormFor[4].isError = false;
          } else {
            quillFormFor[4].isError = true;
          }
        });
        break;
      case 5:
        // 表单校验
        await (quillFormRef5.value![0] as FormInstance).validate((valid) => {
          if (valid) {
            quillFormFor[5].isError = false;
          } else {
            quillFormFor[5].isError = true;
          }
        });
        break;
    }
  };
  const hangle = ref();
  const quillFocus = (index) => {
    hangle.value = index;
  };

  // 富文本 上传图片
  const quillUploadFile = async (obj: any) => {
    console.log(1122);
    console.log(obj, 'obj');
    const loading = ElLoading.service({
      lock: true,
      text: 'loading...',
      background: 'rgba(255, 255, 255, 0.7)',
    });
    switch (hangle.value) {
      case 0:
        uploadFile(obj.formData).then((res) => {
          quillFormFor[0].imgageUrl = res.data.code;
          // ruleForm.msgCode = res.data.code;
          // downloadFile(ruleForm.msgCode).then((item) => {
          //   getBase64(item.data, item.data.type).then((base64) => {
          //     quillFormFor[0].imgageUrl = base64 as string;
          //   });
          // });
        });
        break;
      case 1:
        uploadFile(obj.formData).then((res) => {
          quillFormFor[1].imgageUrl = res.data.code;
        });
        break;
      case 2:
        uploadFile(obj.formData).then((res) => {
          quillFormFor[2].imgageUrl = res.data.code;
        });
        break;
      case 3:
        uploadFile(obj.formData).then((res) => {
          quillFormFor[3].imgageUrl = res.data.code;
        });
        break;
      case 4:
        uploadFile(obj.formData).then((res) => {
          quillFormFor[4].imgageUrl = res.data.code;
        });
        break;
      case 5:
        uploadFile(obj.formData).then((res) => {
          quillFormFor[5].imgageUrl = res.data.code;
        });
        break;
    }
    loading.close();
  };
  //存储上传图片路径
  const previewImg = ref<string[]>([]);
  const activitiesMrgList = ref<UploadFile[]>([]);
  //上传图片
  const imageUrl = ref('');
  //删除
  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    activitiesMrgList.value = uploadFiles;
    console.log(uploadFile, uploadFiles, '22222222222222222');
  };
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    /* if (response.code == null) {
      ElMessage({
        message: '上传失败',
        type: 'error',
      });
      // handleRemove(uploadFile);
      fileList.map((e) => {
        e = {};
        // e.url = '';
        // e.status = 'error';
        console.log(e, '213');
      });
    } else  */
    // {
    // uploadFile.id = response.code;
    console.log(response, 1111111111);
    activitiesMrgList.value.push({ url: response.code });
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    // }

    // console.log(uploadFile, '2222222222222222222222222');

    // console.log(response, 'response');

    // console.log('activitiesMrgList.value', activitiesMrgList.value);
  };
  const handleExceed = (files: File[]) => {
    if (files.length >= 6) {
      ElMessage.error({
        message: `最多上传不能超过6张图片`,
        type: 'warning',
      });
      return;
    }
  };
  //携带请求头
  let token = ref(sessionStorage.getItem('TOKEN__'));
  const headerKey = ref({ Authorization: token.value });
  const handleChange: UploadProps['onChange'] = (uploadFile) => {
    // uploadFiles.slice(-2);
    previewImg.value.push(uploadFile.url as string);
    // uploadFile(uploadFiles).then((res) => {
    //   console.log(res);
    // });
    // uploadFile = uploadFiles;
    // console.log('uploadFile====' + JSON.stringify(uploadFile));

    // console.log('uploadFile', uploadFile.url);
    // console.log('uploadFiles', uploadFiles);
  };
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
    // 获取后缀名
    const suffix = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1);
    // 判断是否符合文件大小的限制需求
    // const isLt2M =
    // 判断是否符合文件类型需求
    let accept = 'jpg/png/gif/jpeg';
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
  // 下载图片;
  const handleDownload = (activitiesMrgList: string[]) => {
    // console.log('1111111111');
    // fileList.value = activitiesMrgList.value;
    activitiesMrgList.forEach((it) => {
      fileList.value.push({ url: it });
    });
    // activitiesMrgList.forEach((it) => {
    //   downloadFile(it).then((item) => {
    //     console.log(item, 1234567890);
    //     // let blob = new Blob([item.data]); // 返回的文件流数据
    //     // let url = window.URL.createObjectURL(blob); // 将他转化为路
    //     // imageUrl.value = url;
    //     getBase64(item.data, item.data.type).then((base64) => {
    //       let value = base64 as string;
    //       fileList.value.push({ url: value, id: it });
    //       // imageUrl.value = base64 as string;
    //       // previewImg.value.push(imageUrl.value);
    //       // fileList.value = previewImg.value.map((i) => {
    //       //   return {
    //       //     name: '12', //如果没有name,可以自己随便定义
    //       //     url: i,
    //       //   };
    //       // });
    //     });
    //   });
    // });
  };
  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    for (let i = 0; i < 6; i++) {
      checkForm(i);
    }
    if (!formEl) return;
    // 表单校验
    for (let i = 0; i < 6; i++) {
      checkForm(i);
    }
    let imgList = '';
    // 上传图片的id
    for (let i = 0; i < activitiesMrgList.value.length; i++) {
      if (i == 0) {
        imgList = activitiesMrgList.value[i].url as string;
      } else {
        imgList = imgList + ',' + activitiesMrgList.value[i].url;
      }
    }
    ruleForm.activitiesMrg = imgList;
    await formEl.validate((valid, val) => {
      if (valid) {
        if (crowdStore.pageTitle == '众筹活动申报新增') {
          ruleForm.flagStatus = 0;
          saveActivitys(ruleForm).then(() => {
            ElMessage({
              message: '新增成功',
              type: 'success',
            });
            showEditPageClose('add');
          });
        } else {
          delete ruleForm.flagStatus;

          editAddress(ruleForm).then(() => {
            ElMessage({
              message: '修改成功',
              type: 'success',
            });
            showEditPageClose('modify');
            // crowdStore.getList();
          });
        }
      } else {
        var obj = Object.keys(val!);
        ruleFormRef.value!.scrollToField(obj[0]);
        ElMessage.error('按照规则添加或修改');
      }
    });
  };
  //提交
  const addSubmitFrom = async (formEl: FormInstance | undefined) => {
    for (let i = 0; i < 6; i++) {
      checkForm(i);
    }
    if (!formEl) return;
    for (let i = 0; i < 6; i++) {
      checkForm(i);
    }
    let imgList = '';
    // 上传图片的id
    for (let i = 0; i < activitiesMrgList.value.length; i++) {
      if (i == 0) {
        imgList = activitiesMrgList.value[i].url as string;
      } else {
        imgList = imgList + ',' + activitiesMrgList.value[i].url;
      }
    }
    ruleForm.activitiesMrg = imgList;

    await formEl.validate((valid, val) => {
      if (valid) {
        ruleForm.flagStatus = 1;
        activitySubmit(ruleForm).then(() => {
          ElMessage({
            message: '提交成功',
            type: 'success',
          });
          showEditPageClose('add');
          emit('inPageSubmit');
        });
      } else {
        var obj = Object.keys(val!);
        ruleFormRef.value!.scrollToField(obj[0]);
        ElMessage.error('按照规则添加或修改');
      }
    });
  };
  // 在待办页面中的取消
  function cancel() {
    emit('cancel', false);
  }
  const cmd = ref();
  // 给一个是否有标题的标志 在活动申报页面有标题 进入待办中没有标题
  const hasTitle = ref(0);
  onMounted(() => {
    const dataKey = props.flowData ? props.flowData : crowdStore.$state;
    console.log('dataKey', dataKey);

    //展示详情
    if (crowdStore.pageTitle == '众筹活动申报编辑') {
      const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      getOnlyActivitys(crowdStore.$state.editData.id)
        .then((res) => {
          Object.keys(ruleForm).forEach((key) => {
            ruleForm[key] = res[key];
          });
          activitiesMrgList.value = res.activitiesMrgList;
          if (activitiesMrgList.value.length > 0) {
            handleDownload(activitiesMrgList.value);
          }
          Object.keys(quillForm).forEach((it) => {
            quillForm[it] = res[it];
          });
          [
            'introduce',
            'executionPlan',
            'budgetPlanning',
            'noteEnplain',
            'organIntroduction',
            'surplusPropertyDispose',
          ].forEach((it, index) => {
            quillFormFor[index].isUpdated = quillForm[it] !== '' ? true : false;
          });

          setTimeout(() => {
            quillFormFor.forEach((key) => {
              key.isUpdated = false;
            });
          }, 33);
        })
        .finally(() => {
          loading.close();
        });
    }

    if (dataKey.modal == 'modify' || dataKey.modal == 'detail') {
      crowdStore.pageTitle = '众筹活动流程申请';
      hasTitle.value = 1;
      let editData = { ...dataKey.editData };
      console.log(editData);

      if (props.flowData && props.flowData.editData.projectId !== '') {
        try {
          getOnlyActivitys(props.flowData.editData.projectId).then((res) => {
            Object.keys(ruleForm).forEach((key) => {
              ruleForm[key] = res[key];
            });
            activitiesMrgList.value = res.activitiesMrgList;
            if (activitiesMrgList.value.length > 0) {
              handleDownload(activitiesMrgList.value);
            }
            Object.keys(quillForm).forEach((it) => {
              quillForm[it] = res[it];
            });
            [
              'introduce',
              'executionPlan',
              'budgetPlanning',
              'noteEnplain',
              'organIntroduction',
              'surplusPropertyDispose',
            ].forEach((it, index) => {
              quillFormFor[index].isUpdated = quillForm[it] !== '' ? true : false;
            });

            setTimeout(() => {
              quillFormFor.forEach((key) => {
                key.isUpdated = false;
              });
            }, 33);
          });
        } catch (error) {
          createMessage.error(error as string);
        }
      }
    }
    crowdStore.justView = dataKey.justView;
    nextTick(() => {
      cmd.value.focus();
      // isMounted.value = true;
      console.log('onMounted nextTick cmd.value.focus()');

      // Object.keys(quillForm).forEach((key) => {
      //   quillForm[key] = quillForm[key].trim();
      // });
      // console.log('onMounted quillForm ', quillForm);
    });
  });
  onUpdated(() => {
    nextTick(() => {
      cmd.value.focus();
    });
  });
</script>

<style scoped>
  .dept_all {
    /* position: relative; */
    padding: 29px 24px;
    /* overflow: hidden; */
    overflow-x: hidden;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
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

  .gy-form:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
    width: 100%;
  }

  .gy-form:deep(.el-form-item--default .el-form-item__label) {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
    width: 10em !important;
    line-height: 15px;
  }

  :deep(.el-button) {
    float: left !important;
  }

  /* :deep(.el-form-item__content) {
    max-width: 590px;
    margin-bottom: 20px;
  } */

  :deep(.ql-formats) {
    height: 21px;
    line-height: 21px;
  }

  :deep(.ql-editor) {
    /* min-height: 350px; */
    min-width: 1080px;
    height: 100%;
    overflow-y: auto;
  }
  :deep(.ql-container) {
    height: 83%;
  }
  .justsee_box {
    width: 883px;
    height: 100%;
    margin: 0px;
    padding: 10px;
    background-color: #f5f7fa;
    border: 1px solid #ddd;
    overflow: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    color: grey;
  }
</style>
