<route lang="yaml">
name: donationdetails
</route>

<template>
  <div class="allin">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">捐赠情况</h1>
      <div class="button-group px-20px">
        <el-button type="primary" @click="tableAdd"> 返回 </el-button>
      </div>
    </div>
    <div class="all">
      <div class="dapt_all w-560px h-100px">
        <div class="w-100px h80px">
          <img :src="listVis.activitiesMrg" alt="" />
        </div>

        <h1 style="font-size: 20px; font-weight: bold">{{ listVis.activitiesName }}</h1>
        <p style="color: #a5a7b2; margin-top: 20px"
          >备案编号: {{ listVis.activitiesRecordCode }}</p
        >
        <p style="color: #a5a7b2; font-size: 15px; margin-top: 20px"
          >已筹款: {{ listVis.donationFunded }}元</p
        >
        <p style="color: #a5a7b2; font-size: 15px; margin-top: 20px"
          >筹款目标: {{ listVis.donationTarget }}元</p
        >
        <p style="font-size: 18px; margin-top: 20px">活动进行中</p>
        <p style="color: #a5a7b2; margin-top: 20px"
          >参与人数: {{ listVis.donationNumber }}人</p
        >
        <div class="flex" style="color: #a5a7b2; margin-top: 17px">
          进度:<div class="w-380px">
            <el-progress
              :text-inside="true"
              :stroke-width="16"
              :percentage="percentage"
            />
          </div>
        </div>
        <p style="color: #a5a7b2; margin-top: 17px"
          >活动时间:{{ listVis.activitiesStartTime }}至
          {{ listVis.activitiesEndTime }}</p
        >
      </div>

      <el-divider direction="vertical" />

      <div class="dept_all">
        <div
          class="search_top flex flex-row justify-between items-center w-full pb-9px"
        >
          <h1 class="page_title">捐赠记录</h1>
        </div>
        <div class="flex flex-col w-full px-20px">
          <!-- table :maxHeight="tableHeight" -->
          <div class="base-table">
            <el-table
              ref="multipleTableRef"
              :data="tableData"
              maxHeight="50vh"
              :style="{ width: '100%' }"
              stripe
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                property="donationPeople"
                :show-overflow-tooltip="true"
                label="捐赠人"
              />
              <el-table-column
                property="donationAmount"
                :show-overflow-tooltip="true"
                label="捐赠金额"
              />
              <el-table-column
                property="donationTime"
                :show-overflow-tooltip="true"
                label="捐赠时间"
              />
            </el-table>

            <div class="py-5 flex justify-end">
              <el-config-provider :locale="zhCn">
                <el-pagination
                  v-model:currentPage="queryData.pageNum"
                  v-model:page-size="queryData.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :small="true"
                  :disabled="false"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </el-config-provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="donationdetails">
  import { ref, reactive } from 'vue';
  import { ElTable } from 'element-plus';
  // import { Plus } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import { TypeQueryParams, ItemListParams } from '/@/views/upms/model/donationModel';
  import { editPageSubmitModal } from '/@/views/upms/model/crowdactivitiesModel';
  import { crowddonation, donationRecords } from '/@/views/upms/api/activities';
  import { useCrowdStore } from '/@/stores/modules/crowdfundModul';
  const crowdStore = useCrowdStore();
  const emit = defineEmits(['submit']);
  const percentage = ref(0);
  //左侧捐赠
  const listVis = reactive({
    activitiesName: '',
    activitiesMrg: '',
    activitiesRecordCode: '', //备案编号
    donationFunded: '', //已筹款
    donationTarget: '', //筹款目标
    donationNumber: '', //参与人数
    jingdu: '', //进度
    activitiesStartTime: '',
    activitiesEndTime: '',
  });

  // 函数的类型
  // type voidFunction = () => void;
  // type handlerFunction<T> = (T) => void;
  // type TableDescriptionType = {
  //   prop: string;
  //   label: string;
  //   type?: string;
  // };
  interface seachGroupInfoModel {
    status: boolean;
    height: string;
  }

  const total = ref(0);

  // // 定义查询参数
  // const queryData = ref<TypeQueryParams>({
  //   pageNum: 1,
  //   pageSize: 10,
  //   activitiesCode: '',
  //   activitiesName: '',
  //   flagStatus: '',
  //   startTime: '',
  //   endTime: '',
  // });

  const tableData = ref([]);

  //const tableHeight = ref(String);

  // table 的 REF

  const multipleTableRef = ref<InstanceType<typeof ElTable>>();

  // table 复选框已选择的行

  const multipleSelection = ref<ItemListParams[]>([]);

  // table 复选框已选择的个数

  const multipleSelectionNumber = ref<number>(0);

  // table 高度

  const tableHeight = ref('50vh');
  const seachGroupInfo = ref<seachGroupInfoModel>({ status: false, height: '70' });

  // 定义查询参数
  const queryData = ref<TypeQueryParams>({
    pageNum: 1,
    pageSize: 10,
    id: '',
    activitiesCode: '',
    activitiesName: '',
    flagStatus: '',
    startTime: '',
    endTime: '',
  });

  // ==== 添加 table 的高度自适应 begin
  const isFolder = (obj: seachGroupInfoModel = seachGroupInfo.value) => {
    let height = {
      body: document.body.offsetHeight,
      subtract: 64 + 24 + 41 + 36 + 63 + 40 + parseInt(obj.height),
      str: '',
    };
    height.str = height.body - height.subtract + '';
    tableHeight.value = height.str;
    seachGroupInfo.value = { ...obj };
  };
  isFolder();
  window.onresize = () => {
    isFolder();
  };

  /**

 * @param val

 */

  const handleSizeChange = (val: number) => {
    queryData.value.pageSize = val;
    getTableList();
  };

  /**
   *
   * @param val
   */
  const handleCurrentChange = (val: number) => {
    queryData.value.pageNum = val;
    getTableList();
  };

  // table 复选框 被选取

  const handleSelectionChange = (val: ItemListParams[]) => {
    multipleSelection.value = val;

    multipleSelectionNumber.value = val.length;
  };
  const tableAdd = (modal: editPageSubmitModal) => {
    modal = 'cancel';
    console.log('tableAdd modal', modal);
    emit('submit', modal);
  };

  /**
   * 列表请求
   * @param params
   */
  function getTableList() {
    const data = {
      id: crowdStore.detailData.id,
      activitiesName: crowdStore.detailData.activitiesName,
      activitiesCode: crowdStore.detailData.activitiesCode,
    };
    crowddonation(data.id).then((res) => {
      Object.keys(res).forEach((key) => {
        listVis[key] = res[key];
        percentage.value = res.progress;
      });
      queryData.value.id = crowdStore.detailData.id;
      donationRecords(queryData.value).then((res) => {
        console.log(res);
        tableData.value = res.data.result.records;
        total.value = res.data.result.total;
      });
      // tableData.value = res.donationQueryList;
      // total.value = res.donationTotal;
    });
  }
  getTableList();
</script>

<style scoped>
  .allin {
    padding: 29px 24px;
  }
  .all {
    width: 100%;
    display: flex;
  }
  .dapt_all {
    flex: 1;
    padding: 29px 24px;
  }
  .dept_all {
    flex: 1;
    padding: 29px 24px;
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

  /* table */

  .gy-form :deep(.el-select),
  .gy-form :deep(.el-input-number) {
    width: 100%;
  }

  .gy-form :deep(.el-textarea__inner) {
    max-height: 300px;
  }

  .table_controll {
    display: flex;

    flex-flow: row nowrap;

    justify-content: flex-start;

    align-items: center;

    width: 100%;

    height: 36px;

    margin: 0 0 4px 0;

    padding: 11px 17px;

    background: #f1f7f7 none;

    box-sizing: border-box;
  }

  .table_list_status {
    display: flex;

    flex-flow: row nowrap;

    justify-content: flex-start;

    align-items: center;
  }

  .table_list_status::before {
    content: ' ';

    display: block;

    width: 6px;

    height: 6px;

    margin: 0 6px 0 0;

    padding: 0;

    border: 0;

    border-radius: 6px;
  }

  .table_list_status.success::before {
    background-color: #67c23a;
  }

  .table_list_status.danger::before {
    background-color: #e14040;
  }

  .drawer_title {
    display: flex;

    flex-flow: row nowrap;

    justify-content: space-between;

    align-items: center;

    width: 100%;

    /* margin-bottom:29px; */

    padding: 23px 36px 24px 36px;

    background-color: #fff;

    border-bottom: 1px solid #e8e8e8;

    color: #33344a;

    font-size: 18px;

    line-height: 28px;

    font-weight: normal;

    font-style: normal;

    box-sizing: border-box;
  }

  .drawer_title svg {
    color: #cdcdcd;
  }

  :deep(.el-dialog__body) {
    padding-top: 0px;
  }

  .info-title {
    border: 1px solid #ebeef5;
    padding: 8px 11px;
    font-weight: 700;
    color: var(--el-text-color-regular);
    background: #f5f7fa;
  }
  :deep(.el-divider) {
    height: 70vh;
  }
</style>
