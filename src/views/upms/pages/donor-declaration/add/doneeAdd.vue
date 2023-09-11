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
              disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex" class="gy-form-item-col">
            <el-select v-model="ruleForm.sex" placeholder="请选择性别"  disabled>
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
            <el-input v-model="ruleForm.age" placeholder="请输入年龄" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="受捐人联系电话"
            prop="phoneNumber"
            class="gy-form-item-col"
          >
            <el-input v-model="ruleForm.phoneNumber" placeholder="请输入联系电话"  disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard" class="gy-form-item-col">
            <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="筹款期限" prop="doneeEndTime" class="gy-form-item-col">
            <!-- <el-input v-model="ruleForm.doneeEndTime" placeholder="请输入身份证号" /> -->
            <el-date-picker
              v-model="ruleForm.doneeEndTime"
              type="datetime"
              placeholder="请选择筹款期限"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              disabled />
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
              disabled >
              <el-option
                v-for="item in proList"
                :key="item.distId"
                :label="item.label"
                :value="item"
                disabled />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在地市" prop="cityName" class="gy-form-item-col">
            <el-select
              v-model="ruleForm.cityName"
              placeholder="请选择地市"
              @change="cityChange"
              disabled >
              <el-option
                v-for="item in cityList"
                :key="item.distId"
                :label="item.label"
                :value="item"
                disabled
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
              disabled>
              <el-option
                v-for="item in countyList"
                :key="item.distId"
                :label="item.label"
                :value="item"
                disabled
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="doneeAddr" class="gy-form-item-col">
            <el-input v-model="ruleForm.doneeAddr" placeholder="请输入详细地址" disabled/>
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
              disabled/>
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
              disabled >
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
              disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="情况概述" prop="doneeExplain" class="gy-form-item-col">
            <el-input v-model="ruleForm.doneeExplain" placeholder="请输入情况概述" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="12">
          <el-form-item label="身份证照片" prop="idCardMsg" class="gy-form-item-col">
            <el-image style="width: 140px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                      :preview-src-list="idCardMsgList" :initial-index="0" fit="cover" v-for="(item, index) in idCardMsgList
                " :key="index" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他凭证" prop="doneeMsg" class="gy-form-item-col">
            <el-image style="width: 100px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                      :preview-src-list="doneeMsgList" :initial-index="0" fit="cover" v-for="(item, index) in doneeMsgList
                " :key="index" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="gy-form-item-row">
        <el-col :span="24">
          <el-form-item label="活动图片" prop="suggestMsg" class="gy-form-item-col">
            <el-image style="width: 100px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                      :preview-src-list="suggestMsg" :initial-index="0" fit="cover" v-for="(item, index) in suggestMsg
                " :key="index" />
          </el-form-item>
        </el-col>
      </el-row>

<!--      <el-row class="gy-form-item-row">-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="身份正面照" prop="idCardMsg" class="gy-form-item-col">-->
<!--            <el-upload-->
<!--              ref="uploadRef"-->
<!--              action="/charity-system/api/files/upload"-->
<!--              list-type="picture-card"-->
<!--              :auto-upload="true"-->
<!--              :on-success="handleAvatarSuccess"-->
<!--              :on-remove="handleRemove"-->
<!--              :before-upload="beforeAvatarUpload"-->
<!--              :on-exceed="handleExceed"-->
<!--              :on-preview="handlePictureCardPreview"-->
<!--              :headers="headerKey"-->
<!--              v-model:file-list="fileList"-->
<!--              name="file"-->
<!--              :on-change="handleChange"-->
<!--              :limit="1"-->
<!--              :class="{ hide_box: Exceedis }"-->
<!--            >-->
<!--              &lt;!&ndash; <img v-if="imageUrl" :src="imageUrl" class="avatar" /> &ndash;&gt;-->
<!--              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>-->
<!--              <div class="el-upload__text"> 上传图片 </div>-->
<!--              <template #tip>-->
<!--&lt;!&ndash;                <div class="el-upload__tip" style="color: red">&ndash;&gt;-->
<!--&lt;!&ndash;                  最多上传不能超过1张图片,图片大小不要超过5M&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--              </template>-->
<!--            </el-upload>-->
<!--            <el-dialog v-model="dialogVisible">-->
<!--              <img w-full :src="dialogImageUrl" alt="Preview Image" />-->
<!--            </el-dialog>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="身份反面照" prop="idCardMsg" class="gy-form-item-col">-->
<!--            <el-upload-->
<!--              ref="uploadRef"-->
<!--              action="/charity-system/api/files/upload"-->
<!--              list-type="picture-card"-->
<!--              :auto-upload="true"-->
<!--              :on-success="handleReveSuccess"-->
<!--              :on-remove="handleReveRemove"-->
<!--              :before-upload="beforeAvatarUpload"-->
<!--              :on-exceed="handleReveExceed"-->
<!--              :on-preview="handleDownPreview"-->
<!--              :headers="headerKey"-->
<!--              v-model:file-list="fileListreve"-->
<!--              name="file"-->
<!--              :on-change="handleReveChange"-->
<!--              :limit="1"-->
<!--              :class="{ hide_box: ReveExceedDis }"-->
<!--            >-->
<!--              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>-->
<!--              <div class="el-upload__text"> 上传图片 </div>-->
<!--              <template #tip>-->
<!--&lt;!&ndash;                <div class="el-upload__tip" style="color: red">&ndash;&gt;-->
<!--&lt;!&ndash;                  最多上传不能超过1张图片,图片大小不要超过5M&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--              </template>-->
<!--            </el-upload>-->
<!--            <el-dialog v-model="dialogDownVisible">-->
<!--              <img w-full :src="dialogDownImageUrl" alt="Preview Image" />-->
<!--            </el-dialog>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row class="gy-form-item-row">-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="其他凭证" prop="doneeMsg" class="gy-form-item-col">-->
<!--            <el-upload-->
<!--              ref="uploadRef"-->
<!--              action="/charity-system/api/files/upload"-->
<!--              list-type="picture-card"-->
<!--              :auto-upload="true"-->
<!--              :on-success="handledoneeMsgSuccess"-->
<!--              :on-remove="handledoneeMsgRemove"-->
<!--              :before-upload="beforedoneeMsgUpload"-->
<!--              :on-exceed="handledoneeMsgExceed"-->
<!--              :on-preview="handledoneeMsgPreview"-->
<!--              :headers="headerKey"-->
<!--              v-model:file-list="fileListtow"-->
<!--              name="file"-->
<!--              :on-change="handledoneeMsgChange"-->
<!--              :limit="4"-->
<!--              :class="{ hide_box: doneeMsgExceedDis }"-->
<!--            >-->
<!--              &lt;!&ndash; <img v-if="imageUrldoneeMsg" :src="imageUrldoneeMsg" class="avatar" /> &ndash;&gt;-->
<!--              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>-->
<!--              <div class="el-upload__text"> 上传图片 </div>-->
<!--              <template #tip>-->
<!--&lt;!&ndash;                <div class="el-upload__tip" style="color: red">&ndash;&gt;-->
<!--&lt;!&ndash;                  最多上传不能超过4张图片,图片大小不要超过5M&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--              </template>-->
<!--            </el-upload>-->
<!--            <el-dialog v-model="dialogdoneeMsgVisible">-->
<!--              <img w-full :src="dialogdoneeMsgImageUrl" alt="Preview Image" />-->
<!--            </el-dialog>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="活动图片" prop="suggestMsg" class="gy-form-item-col">-->
<!--            <el-upload-->
<!--              ref="uploadRef"-->
<!--              action="/charity-system/api/files/upload"-->
<!--              list-type="picture-card"-->
<!--              :auto-upload="true"-->
<!--              :on-success="handlesuggestMsgSuccess"-->
<!--              :on-remove="handlesuggestMsgRemove"-->
<!--              :before-upload="beforesuggestMsgUpload"-->
<!--              :on-exceed="handlesuggestMsgExceed"-->
<!--              :on-preview="handlesuggestMsgPreview"-->
<!--              :headers="headerKey"-->
<!--              v-model:file-list="fileListsugge"-->
<!--              name="file"-->
<!--              :on-change="handlesuggestMsgChange"-->
<!--              :limit="4"-->
<!--              :class="{ hide_box: suggestMsgExceedDis }"-->
<!--            >-->
<!--              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>-->
<!--              <div class="el-upload__text"> 上传图片 </div>-->
<!--              <template #tip>-->
<!--&lt;!&ndash;                <div class="el-upload__tip" style="color: red">&ndash;&gt;-->
<!--&lt;!&ndash;                  最多上传不能超过2张图片,图片大小不要超过5M&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--              </template>-->
<!--            </el-upload>-->
<!--            <el-dialog v-model="dialogsuggestMsgVisible">-->
<!--              <img w-full :src="dialogsuggestMsgImageUrl" alt="Preview Image" />-->
<!--            </el-dialog>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->

      <!--    按钮剧中放开此处注释  -->
      <!--      <el-row class="flex justify-center w-full ml-84px">-->
      <!--        <el-button @click="showEditPageClose">取消</el-button>-->
      <!--        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>-->
      <!--      </el-row>-->
    </el-form>
    <el-form
      ref="quillFormRef"
      :model="quillForm"

      label-width="84px"
      class="gy-form flex flex-col flex-wrap justify-start item-start w-full"
      size="default"
      status-icon
    >
      <el-row class="w-full">
        <el-form-item
          label="情况介绍"
          prop="doneeIntroduce"
          class="gy-form-item-col"
        >
          <div class="w-full">
            <div v-html="ruleForm.doneeIntroduce" class="justsee_box" />
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row class="flex justify-center w-full ml-84px">
      <el-button @click="showEditPageClose">取消</el-button>
      <el-button type="primary" @click="reject">驳回</el-button>
      <el-button type="primary" @click="submitFrom">审批</el-button>
    </el-row>
    <div v-if="isApprove">
      <el-dialog
        v-model="isApprove"
        title="详情"
        width="60%"
        top="15vh"
        :draggable="true">
        <el-form ref="releFormRef" :model="approveData"  :rules="rules">
          <el-form-item :label="approverOpinionLible" prop="approverOpinion">
            <el-input v-model="approveData.approverOpinion" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
              <el-button @click="isApprove = false">关闭</el-button>
              <el-button type="primary" @click="approveSubmit(releFormRef)">确认</el-button>
            </span>
        </template>
      </el-dialog>
    </div>
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
  import {AddressParams, AddressQueryParams, AddressSaveParams} from '/@/views/upms/model/doneeModel';
  import {
    queryList,
    doneeDetail,
    doneeDownload,
    getBase64,
    doneeUpload, approve,
  } from '/@/views/upms/api/doneeDecla';
  import { useUpmsAddress } from '/@/stores/modules/address';
  import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/amcDistrict';
  import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
  import QuillEditor from '/@/components/sys/QuillEditor';
  import {approveAgree, approvereject} from "/@/views/upms/api/crowdFundingApprove";
  const useUpmsAddressStore = useUpmsAddress();
  const buttonType = ref('1');
  const ruleFormRef = ref<FormInstance>();
  const ruleForm = ref<AddressParams>({});
  const proList = ref<AmcDistrict[]>();
  const cityList = ref<AmcDistrict[]>();
  const countyList = ref<AmcDistrict[]>();
  // const router = useRouter();
  const emit = defineEmits(['closeRefresh','queryTable',]);
  let fileList = ref<UploadFile[]>([]);
  let fileListtow = ref<UploadFile[]>([]);
  let fileListreve = ref<UploadFile[]>([]);
  let fileListsugge = ref<UploadFile[]>([]);
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
  const props = defineProps(['queryData']);
  const queryForm = ref<AddressQueryParams>({
    ...props.queryData,
  });

  const approveData = reactive({
    projectId: useUpmsAddressStore.$state.editDataInfo.id,
    approverResult:'',
    approverOpinion: '',
  });

  const releFormRef = ref<FormInstance>();

  const rules = reactive<FormRules>({
    approverOpinion: [{ required: true, message: '请选输入驳回意见', trigger: 'blur' }],
  });

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
  const approverOpinionLible = ref<string>('意见');
  // 提交类型  1 通过 2 驳回
  const submitType = ref<string>('1');
  const isApprove = ref<boolean>(false);

  const reject = () =>{
    approverOpinionLible.value = '驳回意见';
    submitType.value = '2';
    isApprove.value = true;
  };

  const idCardMsgList = ref<string[]>([])
  const doneeMsgList = ref<string[]>([])
  const suggestMsg = ref<string[]>([])
  function init() {
    if (useUpmsAddressStore.$state.isEditing) {
      buttonType.value = '2';
      const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        background: 'rgba(255, 255, 255, 0.7)',
      });

      doneeDetail(useUpmsAddressStore.$state.editDataInfo.id as string)
        .then((res) => {
          ruleForm.value = res;

          suggestMsg.value = ruleForm.value.suggestMsg as string[]
          quillForm.doneeIntroduce = ruleForm.value.doneeIntroduce as string;
          // idCardMsgList.value = ruleForm.value.idCardMsg as string[]
          (ruleForm.value.idCardMsg!).map(item => {
            doneeDownload(item).then((res) => {
              getBase64(res.data, res.data.type).then((base64) => {
                let value = base64 as string;
                idCardMsgList.value.push(value)
                // console.log(idCardList.value, 2)
              });
            });
          });
          (ruleForm.value.doneeMsg!).map(item => {
            doneeDownload(item).then((res) => {
              getBase64(res.data, res.data.type).then((base64) => {
                let value = base64 as string;
                doneeMsgList.value.push(value)
                console.log('doneeMsgList.value  : ',doneeMsgList.value)
              });
            });
          })
          isUpdated.value = true;
          handleDownload();
          handleDownloadLi();
          handleDownloadreve();
          res.suggestMsg.forEach((key) => {
            fileListsugge.value.push({
              url: key,
              name: '',
              status: 'ready',
              uid: 0,
            });
          });
        })
        .finally(() => {
          loading.close();
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
    submitFrom;
    reject;
    approveSubmit;
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



  const approveSubmit = async (formEl:FormInstance|undefined) => {
    if(!formEl) return;
    await formEl.validate((valid,fields) =>{
      if(valid){
        const loading = ElLoading.service({
          lock: true,
          text: '数据加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })

        if(submitType.value == '1'){
          console.log('approveData:  :  ', approveData)
          approveData.approverResult='1'
          approve(useUpmsAddressStore.$state.editDataInfo.id,approveData).then(res => {
            isApprove.value = false;
            emit('closeRefresh');
          }).finally(loading.close)
        }
        if(submitType.value == '2'){
          approveData.approverResult='0'
          approve(useUpmsAddressStore.$state.editDataInfo.id,approveData).then(res =>{
            isApprove.value = false;
            emit('closeRefresh');
          }).finally(loading.close)
        }
      }else {
        return;
      }
    })
  }

  //上传图片 其他凭证  上传成功
  //存储上传图片路径
  const previewImgdoneeMsg = ref<string[]>([]);
  const doneeMsgMrgList = ref<string[]>([]);
  //上传图片
  const imageUrldoneeMsg = ref('');
  //删除
  const handledoneeMsgRemove = (uploadFile, uploadFiles: string[]) => {
    doneeMsgMrgList.value = uploadFiles;
    doneeMsgExceedDis.value = false;
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
    ruleFormRef.value!.clearValidate('doneeMsg');
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
  // 身份证正 下载图片
  const handleDownloadLi = () => {
    // activitiesMrgList.value = (ruleForm.value.idCardMsg as string).split(',');
   // activitiesMrgList.value = ruleForm.value.idCardMsg as string[];
    let Data = '';
    //Data = activitiesMrgList.value[0];
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
 // const activitiesMrgList = ref<string[]>([]);
  //上传图片
  const imageUrl = ref('');
  //删除
  const handleRemove = (uploadFile, uploadFiles: string[]) => {
    //activitiesMrgList.value = uploadFiles;
    Exceedis.value = false;
    console.log(uploadFile, uploadFiles, '22222222222222222');
  };
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    // console.log(response, 1111111111);
    ruleForm.value.doneeMsg = response.result.filePath;
    // ruleForm.value.frontID = response.result.filePath;
    // activitiesMrgList.value.push(response.result.filePath);
    // if (activitiesMrgList.value.length >= 1) {
    //   Exceedis.value = true;
    // }
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    // console.log(response, 1111111111, activitiesMrgList.value);
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
    ruleFormRef.value!.clearValidate('frontID');
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
    ReveExceedDis.value = false;
    console.log(uploadFile, uploadFiles, '22222222222222222');
  };
  const handleReveSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    // console.log(response, 1111111111);
    // ruleForm.value.reverseID = response.result.filePath;
    ReveList.value.push(response.result.filePath);
    if (ReveList.value.length >= 1) {
      ReveExceedDis.value = true;
    }
    imageReveUrl.value = URL.createObjectURL(uploadFile.raw!);
  };
  const ReveExceedDis = ref(false);
  const handleReveExceed = (files: File[]) => {
    if (files.length >= 1) {
      ElMessage.error({
        message: `最多上传不能超过1张图片`,
        type: 'warning',
      });
      return;
    }
  };

  const handleReveChange: UploadProps['onChange'] = (uploadFile) => {
    ReveImg.value.push(uploadFile.url as string);
    ruleFormRef.value!.clearValidate('idCardMsg');
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
  //预览上传图片
  // const disabled = ref(false);
  const dialogDownImageUrl = ref('');
  const dialogDownVisible = ref(false);
  //预览图片
  const handleDownPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
  };
  // ------------------------------------------------------
  //上传图片 推荐图片  上传成功
  //存储上传图片路径
  const previewImgsuggestMsg = ref<string[]>([]);
  const suggestMsgList = ref<string[]>([]);
  //上传图片
  const imageUrlsuggestMsg = ref('');
  //删除
  const handlesuggestMsgRemove = (uploadFile, uploadFiles: string[]) => {
    suggestMsgList.value = uploadFiles;
    suggestMsgExceedDis.value = false;

  };
  const handlesuggestMsgSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile,
    // fileList: UploadFile[],
  ) => {
    // console.log(response, 2221111111111);
    suggestMsgList.value.push(response.result.fileUrl);
    if (suggestMsgList.value.length >= 2) {
      suggestMsgExceedDis.value = true;
    }
    imageUrlsuggestMsg.value = URL.createObjectURL(uploadFile.raw!);
  };
  const suggestMsgExceedDis = ref(false);
  const handlesuggestMsgExceed = (files: File[]) => {
    console.log('files', files);

    if (files.length >= 2) {
      ElMessage.error({
        message: `最多上传不能超过4张图片`,
        type: 'warning',
      });
      return;
    }
  };
  const handlesuggestMsgChange: UploadProps['onChange'] = (uploadFile) => {
    previewImgsuggestMsg.value.push(uploadFile.url as string);
    ruleFormRef.value!.clearValidate('suggestMsg');
  };
  const beforesuggestMsgUpload: UploadProps['beforeUpload'] = (
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
  const dialogsuggestMsgImageUrl = ref('');
  const dialogsuggestMsgVisible = ref(false);
  //预览图片
  const handlesuggestMsgPreview = (file: UploadFile) => {
    dialogsuggestMsgImageUrl.value = file.url!;
    dialogsuggestMsgVisible.value = true;
  };


  const submitFrom =  () => {
    approverOpinionLible.value = '审批意见';
    submitType.value = '1';
    isApprove.value = true;
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
  // const quillRules = reactive<FormRules>({
  //   doneeIntroduce: [{ required: true, message: '填写文字介绍', trigger: 'change' }],
  // });
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
  .hide_box :deep(.el-upload--picture-card) {
    display: none;
  }
  :deep(.el-date-editor.el-input) {
    width: 100%;
  }
  .gy-form :deep(.el-form-item__label:before) {
    content: ' *';

    color: #f56c6c;

    font-size: 150%;
    margin-right: 4px;
  }
</style>
