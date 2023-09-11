<route lang="yaml">
name: crowdFundingIndividual
</route>


<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">个人众筹审批</h1>
      <div class="button-group px-20px"></div>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="home_content_wrap">
      <!-- table -->
      <div class="base_table">
        <el-table ref="multipleTableRef" :data="tableData" :maxHeight="tableHeightInfo.tableHeight"
          :style="{ width: '100%' }" stripe>
          <el-table-column property="activitiesCode" :show-overflow-tooltip="true" label="活动编号" width="180" />
          <el-table-column property="activitiesName" :show-overflow-tooltip="true" label="活动名称" width="180" />

          <el-table-column property="activitiesEndTime" :show-overflow-tooltip="true" label="筹款期限" width="220" />
          <el-table-column property="createTime" :show-overflow-tooltip="true" label="创建日期" width="220" />
          <el-table-column property="status" :show-overflow-tooltip="true" label="状态" />
          <el-table-column property="flagStatus" :show-overflow-tooltip="true" label="活动状态" width="80" />
          <el-table-column fixed="right" label="操作" width="220">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="detailClick(scope.row)">详情</el-button>
              <el-button link type="primary" size="small" @click="approve(scope.row)"
                v-if="scope.row.flagStatus == '审核中'">审批</el-button>
              <el-button link type="primary" size="small" @click="approvalHandler(scope.row)">审批记录</el-button>
              <el-button link type="primary" size="small" @click="statusHandler(scope.row)"
                v-if="scope.row.flagStatus == '已发布'">{{ scope.row.status == '启用' ? "停用" : "启用" }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination v-model:currentPage="queryData.pageNum" v-model:page-size="queryData.pageSize"
              :page-sizes="[10, 20, 50, 100]" :small="true" :disabled="false"
              layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </el-config-provider>
        </div>
        <div class="edit_page" v-if="useUpmsActivitiesStore.isShowApprovePageData">
          <addPage @closeRefresh="closeRefresh" />
        </div>
        <!-- table 查看详情 -->
        <el-dialog v-model="detailShow" width="60%" top="15vh" :draggable="true" title="详情">
          <el-descriptions class="margin-top" :column="2" size="default" :style="''" :border="true">
            <el-descriptions-item v-for="des in descriptions" :key="des.prop" :label="des.label" width="40px"
              :span="des.label == '活动简介' || des.label == '剩余财产处置说明' ? 2 : 1">
              <template> </template>
              <span v-html="detailInfo[des.prop]"></span>
            </el-descriptions-item>

            <el-descriptions-item label="身份证照片" :span="2">
              <el-image style="width: 200px; height: 120px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                :preview-src-list="idCardList" :initial-index="0" fit="cover" v-for="(item, index) in idCardList
                " :key="index" />
            </el-descriptions-item>
            <el-descriptions-item label="推广图片" :span="2">
              <el-image style="width: 100px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                :preview-src-list="spreadImageList" :initial-index="0" fit="cover" v-for="(item, index) in spreadImageList
                " :key="index" />
            </el-descriptions-item>
            <el-descriptions-item label="证明资料">
              <el-image style="width: 100px; height: 100px;margin-right: 20px;" :src="item" :zoom-rate="1.2"
                :preview-src-list="activitiesMrgList" :initial-index="0" fit="cover" v-for="(item, index) in activitiesMrgList
                " :key="index" />
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
        <!-- 审批记录 -->
        <el-dialog v-model="approvalShow" width="40%" top="15vh" :draggable="true" title="审批记录">
          <div style="overflow: auto; height: 450px">
            <div v-for="(record, index) in approval" class="divHeight" :key="record.id">
              <span class="marginTime"> {{ record.createTime }}</span>
              <template v-if="index < approval.length - 1">
                <p class="floatLeft">
                  <el-icon>
                    <SuccessFilled />
                  </el-icon>
                </p>
                <br />
                <p class="link-right"></p>
              </template>
              <div class="divContent">
                <p style="font-weight: bold">{{ record.approverResult == '2' ? '操作' : '审核' }}人&nbsp;:
                  {{ record.approverOrg }}</p>
                <p>{{ record.approverResult == '2' ? '操作' : '审核' }}意见&nbsp;:
                  {{ record.approverOpinion }}</p>
                <p>{{ record.approverResult == '2' ? '操作' : '审核' }}结果&nbsp;:
                  {{ approvalProcessStore.getRecordStatus(record.approverResult) }}</p>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="activities">
import { reactive, ref } from 'vue';
import { ElTable, ElLoading, ElMessageBox, ElMessage } from 'element-plus';
import { Plus, Close } from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import baseSearch from './search/index.vue';
import addPage from './approve/index.vue'
import { useApprovalProcessStore } from '/@/stores/modules/approvalProcess';
import {
  ActivitiesListParams,
  ActivitiesQueryParams,
  ActivitiesDetailParams
} from '/@/views/upms/model/crowdFundingApproveModel';
import {
  queryActivities,
  detailActivities,
  getApprovalList,
  doneeDownload,
  getBase64,
  editStatus
} from '/@/views/upms/api/crowdFundingIndividual';
import {
  CrowdListParams,
  recordType,
} from '/@/views/upms/model/crowdactivitiesModel';
import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
import { seachGroupInfoModel, autoTableHeightInfoModel } from '/@/api/model/commonModel';
import { useUpmsActivities } from '/@/stores/modules/activityApproveIndividual';
export default {
  name: 'ActivitiesTable',
  components: { baseSearch, addPage },
  setup() {
    type TableDescriptionType = {
      prop: string;
      label: string;
    };
    const spreadImageList = ref<string[]>([])
    const activitiesMrgList = ref<string[]>([])
    const idCardList = ref<string[]>([])
    const approvalProcessStore = useApprovalProcessStore();

    const detailShow = ref(false);
    const total = ref(0);
    const tableData = ref<ActivitiesListParams[]>([]);
    // table 的 REF
    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    const tableHeightInfo = reactive<autoTableHeightInfoModel>({
      tableHeight: '50vh',
      seachGroupInfo: { status: false, height: '70' },
    });
    const useUpmsActivitiesStore = useUpmsActivities();

    const descriptions = ref<TableDescriptionType[]>([
      {
        prop: 'activitiesName',
        label: '项目名称',
      },
      {
        prop: 'activitiesCode',
        label: '项目编号',
      },
      {
        prop: 'applicant',
        label: '申请人',
      },
      {
        prop: 'phoneNumber',
        label: '联系方式',
      },
      {
        prop: 'idCard',
        label: '身份证号',
      },
      {
        prop: 'donationTarget',
        label: '筹款目标',
      },
      {
        prop: 'activitiesTerm',
        label: '筹款期限',
      },
      {
        prop: 'explainn',
        label: '活动简介',
      },
      {
        prop: 'surplusPropertyDispose',
        label: '剩余财产处置说明',
      }
    ]);
    // 详情
    const detailInfo = ref<ActivitiesDetailParams>({
      idCard: '',
      applicant: '',
      headAddr: '',
      phoneNumber: '',
      idCardMsg: [],
      explainn: '',
      activitiesName: '',
      spreadImage: [],
      donationTarget: '',
      activitiesTerm: '',
      activitiesMrgList: [],
      surplusPropertyDispose: '',
      activitiesCode: '',
      activitiesRecordCode: '',
      activitiesRecordTime: '',
    })
    // 定义查询参数
    const queryData = ref<ActivitiesQueryParams>({
      pageNum: 1,
      pageSize: 10,
      activitiesStartTime: "",
      activitiesEndTime: "",
      activitiesName: "",
      activitiesCode: "",
      status: "",
      flagStatus: "",
      activitiesRecordCode: "",
    })
    /**
     * 定义初始化方法进入页面默认查询
     */
    const init = () => {
      getTableList(queryData.value);
    }
    init();
    /**
     *
     * @param val
     */
    const handleSizeChange = (val: number) => {
      queryData.value.pageSize = val;
      getTableList(queryData.value);
    }
    /**
     *
     * @param val
     */
    const handleCurrentChange = (val: number) => {
      queryData.value.pageNum = val;
      getTableList(queryData.value);
    }
    // 审批
    const approve = (row: ActivitiesListParams) => {
      useUpmsActivitiesStore.activityId = row.id
      useUpmsActivitiesStore.isShowApprovePageData = true;
    };
    // 查看详情

    const detailClick = (row: ActivitiesListParams) => {
      detailActivities(row.id).then((res) => {
        Object.keys(res).forEach(key => {
          detailInfo.value[key] = res[key]
        })
        spreadImageList.value = res.spreadImage as string[]
        (res.idCardMsg!).map(item => {
          idCardList.value = []
          doneeDownload(item).then((res) => {
            getBase64(res.data, res.data.type).then((base64) => {
              let value = base64 as string;
              idCardList.value.push(value)
            });
          });
        });
        (res.activitiesMrgList!).map(item => {
          activitiesMrgList.value = []
          doneeDownload(item).then((res) => {
            getBase64(res.data, res.data.type).then((base64) => {
              let value = base64 as string;
              activitiesMrgList.value.push(value)
            });
          });
        })
      }).finally(() => {
        detailShow.value = true;
      })
    };

    // 审批记录
    const approvalShow = ref(false);
    const approval = ref<recordType[]>([]);
    const approvalHandler = (row: CrowdListParams) => {
      getApprovalList(row.id).then((res) => {
        approval.value = res;
        approvalShow.value = true;
      });
    };

    // 停用启用
    const statusHandler = (row: CrowdListParams) => {
      const flagStatus = ref('')
      if (row.status == '停用') {
        flagStatus.value = '启用'
      } else if (row.status == '启用') {
        flagStatus.value = '停用'
      }
      const params = {
        status: flagStatus.value
      }
      ElMessageBox.confirm(`是否${flagStatus.value}该活动?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          editStatus(row.id, params).then((res) => {
            console.log(res)
            getTableList(queryData.value);
          });
        })
        .catch(() => ElMessage.info(`已取消${flagStatus.value}`));
    }

    /**
     * 关闭新增
     */
    const closeRefresh = () => {
      useUpmsActivitiesStore.isShowApprovePageData = false;
      queryTable(queryData.value);
    };
    /**
     * 查询方法
     * @param Data
     */
    function queryTable(Data: ActivitiesQueryParams) {
      getTableList(Data);
    }
    /**
     * 列表请求
     * @param params
     */
    function getTableList(params: ActivitiesQueryParams) {
      const loading = ElLoading.service({
        lock: true,
        text: '数据加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      queryActivities(params).then(res => {

        tableData.value = res.records
        tableData.value.forEach(item => {
          item.activitiesType = '个人'
        })
        total.value = res.total;
        queryData.value.pageSize = res.size
        queryData.value.pageNum = res.current
      }).finally(() => { loading.close() })
    }

    // ==== 添加 table 的高度自适应 begin
    const isFolder = (obj: seachGroupInfoModel = tableHeightInfo.seachGroupInfo) => {
      isFolderHelper(obj, tableHeightInfo);
    };
    isFolderHelper(tableHeightInfo.seachGroupInfo, tableHeightInfo);
    window.onresize = () => {
      isFolderHelper(tableHeightInfo.seachGroupInfo, tableHeightInfo);
    };
    return {
      zhCn,
      Plus, Close,
      total,
      tableData,
      tableHeightInfo,
      multipleTableRef,
      queryTable,
      handleSizeChange,
      handleCurrentChange,
      isFolder,
      queryData,
      approve,
      closeRefresh,
      detailClick,
      detailShow,
      detailInfo,
      descriptions,
      approvalShow,
      approvalHandler,
      approval,
      approvalProcessStore,
      statusHandler,
      spreadImageList,
      activitiesMrgList,
      idCardList,
      useUpmsActivitiesStore


    }
  }
}

</script>
<style scoped>
@import url('/@/styles/common/admcDefaultStyle.css');

.marginTime {
  margin-left: 75px;
}

.floatLeft {
  float: left;
  margin: 0px;
  padding: 0px;
}

.divContent {
  height: 100px;
  width: 70%;
  margin: 10px 80px;
  border-radius: 5px;
  padding: 2px;
  box-shadow: 1px 1px 5px #888888;
}

.divContent p {
  margin-left: 10px;
  margin-top: 10px;
}

.link-right {
  height: 120px;
  border: 1px solid #acc0d8;
  background-color: black;
  float: left;
  margin-left: 6px;
}
</style>
