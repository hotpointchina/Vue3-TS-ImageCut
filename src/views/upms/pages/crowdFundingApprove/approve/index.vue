<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">活动审批</h1>
    </div>
    <div class="dept_all_form">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="140px"
        class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-50px" size="default" status-icon>
        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="项目编号" prop="activitiesCode" class="gy-form-item-col">
              <el-input v-model="ruleForm.activitiesCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="activitiesName" class="gy-form-item-col">
              <el-input v-model="ruleForm.activitiesName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="活动备案编号" prop="activitiesRecordCode" class="gy-form-item-col">
              <el-input v-model="ruleForm.activitiesRecordCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备案编号有效期" prop="activitiesRecordTime" class="gy-form-item-col">
              <el-input v-model="ruleForm.activitiesRecordTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="活动负责人" prop="head" class="gy-form-item-col">
              <el-input v-model="ruleForm.head" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人简介" prop="headIntroduction" class="gy-form-item-col">
              <el-input v-model="ruleForm.headIntroduction" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phoneNumber" class="gy-form-item-col">
              <el-input v-model="ruleForm.phoneNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属公益组织" prop="pwoName" class="gy-form-item-col">
              <el-input v-model="ruleForm.pwoName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="活动开始日期" prop="activitiesStartTime" class="gy-form-item-col">
              <el-input v-model="ruleForm.activitiesStartTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束日期" prop="activitiesEndTime" class="gy-form-item-col">
              <el-input v-model="ruleForm.activitiesEndTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="捐赠目标" prop="donationTarget" class="gy-form-item-col">
              <el-input v-model="ruleForm.donationTarget" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="24">
            <el-form-item label="活动简介" prop="explainn" class="gy-form-item-col">
              <el-input v-model="ruleForm.explainn" type="textarea" style="width: 100vw;" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="24">
            <el-form-item label="活动介绍" prop="introduce" class="gy-form-item-col">
              <div v-html="ruleForm.introduce" class="justsee_box" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="24">
            <el-form-item label="执行计划" prop="executionPlan" class="gy-form-item-col">
              <div v-html="ruleForm.executionPlan" class="justsee_box" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="24">
            <el-form-item label="预算规划" prop="budgetPlanning" class="gy-form-item-col">
              <div v-html="ruleForm.budgetPlanning" class="justsee_box" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="24">
            <el-form-item label="执行机构介绍" prop="organIntroduction" class="gy-form-item-col">
              <div v-html="ruleForm.organIntroduction" class="justsee_box" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="24">
            <el-form-item label="剩余财产处置说明" prop="surplusPropertyDispose" class="gy-form-item-col">
              <div v-html="ruleForm.surplusPropertyDispose" class="justsee_box" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="gy-form-item-row">
          <el-col :span="12">
            <el-form-item label="推广图片" prop="spreadImage" class="gy-form-item-col">
              <el-image style="width: 100px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                :preview-src-list="spreadImageList" :initial-index="0" fit="cover" v-for="(item, index) in ruleForm.spreadImage
                " :key="index" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证明资料" prop="activitiesMrgList" class="gy-form-item-col">
              <el-image style="width: 100px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                :preview-src-list="activitiesMrgList" :initial-index="0" fit="cover" v-for="(item, index) in activitiesMrgList
                " :key="index" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="flex justify-center w-full ml-84px">
          <el-button @click="showEditPageClose">取消</el-button>
          <el-button type="primary" @click="reject">驳回</el-button>
          <el-button type="primary" @click="submitFrom">审批</el-button>
        </el-row>
        <!--    按钮剧中放开此处注释  -->
        <!--      <el-row class="flex justify-center w-full ml-84px">-->
        <!--        <el-button @click="showEditPageClose">取消</el-button>-->
        <!--        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>-->
        <!--      </el-row>-->
      </el-form>
      <!-- <div v-if="isApprove"> -->
      <el-dialog v-model="isApprove" title="输入意见" width="60%" top="15vh" :draggable="true" @close="closeDialog">
        <el-form ref="releFormRef" :model="approveData" :rules="rules">
          <el-form-item :label="approverOpinionLible" prop="approverOpinion">
            <el-input v-model="approveData.approverOpinion" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="isApprove = false">取消</el-button>
            <el-button type="primary" @click="approveSubmit(releFormRef)">确认</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- </div> -->
    </div>
  </div>
</template>


<script lang="ts" setup name="activitiesAdd">
import { reactive, ref, defineEmits } from 'vue';
import { FormInstance, ElLoading, FormRules, ElMessageBox, ElMessage } from 'element-plus';
// import dayjs from 'dayjs';

import {
  ActivitiesDetailParams,
} from '/@/views/upms/model/crowdFundingApproveModel';
import {
  detailActivities,
  approveAgree,
  approvereject,
} from '/@/views/upms/api/crowdFundingApprove';
import {
  doneeDownload,
  getBase64,
} from '/@/views/upms/api/crowdFundingIndividual';
import { useUpmsActivities } from '/@/stores/modules/activityApproveArores';
const useUpmsActivitiesStore = useUpmsActivities();
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<ActivitiesDetailParams>({});
const emit = defineEmits(['closeRefresh']);
const isApprove = ref<boolean>(false);
const releFormRef = ref<FormInstance>();
// 提交类型  1 通过 2 驳回
const submitType = ref<string>('1');
const approveData = reactive({
  id: useUpmsActivitiesStore.activityId,
  approverOpinion: ''
});
const approverOpinionLible = ref<string>('意见');
function init() {
  getApproveDetail()
}
const activitiesMrgList = ref<string[]>([])
const spreadImageList = ref<string[]>([])
// 关闭 新增/编辑 before
const showEditPageClose = () => {
  emit('closeRefresh')
}
/**
 * 获取详情
 */
const getApproveDetail = () => {
  detailActivities(useUpmsActivitiesStore.activityId).then(res => {
    ruleForm.value = res
    spreadImageList.value = ruleForm.value.spreadImage as string[]
    (ruleForm.value.activitiesMrgList!).map(item => {
      doneeDownload(item).then((res) => {
        getBase64(res.data, res.data.type).then((base64) => {
          let value = base64 as string;
          activitiesMrgList.value.push(value)
          // console.log(idCardList.value, 2)
        });
      });
    })
  });
}
const rules = reactive<FormRules>({
  approverOpinion: [{ required: true, message: '请输入意见', trigger: 'blur' }],
});
/**
 * 驳回
 */
const reject = () => {
  approverOpinionLible.value = '驳回意见';
  submitType.value = '2';
  isApprove.value = true;
};
// 新增、添加名址表单的校验规则

/**
 * 最终提交方法
 */
const approveSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '数据加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      if (submitType.value == '1') {
        approveAgree(approveData).then(res => {
          console.log(res)
          isApprove.value = false;
          emit('closeRefresh');
        }).finally(loading.close)
      }
      if (submitType.value == '2') {
        approvereject(approveData).then(res => {
          console.log(res)
          isApprove.value = false;
          emit('closeRefresh');
        }).finally(loading.close)
      }
    } else {
      return;
    }
  })
}
/**
 *
 * @param formEl
 */
// 提交 新增/编辑 表单
const submitFrom = () => {
  ElMessageBox.confirm('确认审批通过该活动', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      approveAgree(approveData).then(res => {
        console.log(res)
        emit('closeRefresh');
      })
    })
    .catch(() => ElMessage.info('已取消'));
  // approverOpinionLible.value = '审批意见';
  // submitType.value = '1';
  // isApprove.value = true;
};
const closeDialog = () => {
  approveData.approverOpinion = ''
}
init();
</script>
<style scoped>
@import url('/@/styles/common/admcDefaultStyle.css');

.justsee_box {
  width: 100vw;
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
