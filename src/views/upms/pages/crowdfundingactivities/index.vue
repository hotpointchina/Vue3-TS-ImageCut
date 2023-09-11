<route lang="yaml">
name: activities
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">众筹管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 申报 </el-button>
        <!-- <el-button type="primary" :icon="Plus" @click="clickRelease"> 发布 </el-button> -->
      </div>
    </div>
    <!-- 搜索组 -->
    <baseSearch @queryTable="queryTable" @isFolder="isFolder" />
    <div class="flex flex-col w-full px-20px">
      <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp pl-30px">
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteChoose"
            style="font-size: 14px"
            >批量删除</el-button
          >
        </div>
      </div>
      <!-- table :maxHeight="tableHeight" -->
      <div class="base-table">
        <el-table
          ref="multipleTableRef"
          :data="crowdStore.list"
          maxHeight="50vh"
          :style="{ width: '100%' }"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" fixed width="55" />
          <el-table-column property="activitiesCode" label="项目编号" width="180" />
          <el-table-column
            property="activitiesName"
            :show-overflow-tooltip="true"
            label="项目名称"
            width="150"
          />
          <el-table-column
            property="pwoName"
            :show-overflow-tooltip="true"
            label="公益组织名称"
            width="110"
          />
          <el-table-column
            property="explainn"
            :show-overflow-tooltip="true"
            label="活动简介"
            width="200"
          />
          <el-table-column
            property="flagStatus"
            :show-overflow-tooltip="true"
            label="活动状态"
            width="150"
          />
          <el-table-column
            property="donationFunded"
            :show-overflow-tooltip="true"
            label="已筹善款"
            width="150"
          />
          <el-table-column
            property="donationNumber"
            :show-overflow-tooltip="true"
            label="捐赠人数"
            width="150"
          />
          <el-table-column
            property="activitiesRecordCode"
            :show-overflow-tooltip="true"
            label="活动备案编号"
            width="150"
          />
          <el-table-column
            property="status"
            :show-overflow-tooltip="true"
            label="状态"
            width="150"
          />
          <el-table-column
            property="activitiesStartTime"
            :show-overflow-tooltip="true"
            label="起始日期"
            width="150"
          />
          <el-table-column
            property="activitiesEndTime"
            :show-overflow-tooltip="true"
            label="截至日期"
            width="150"
          />
          <el-table-column
            property="activitiesType"
            :show-overflow-tooltip="true"
            label="捐赠类型"
            width="150"
          />
          <el-table-column fixed="right" label="操作" width="280">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="detailClick(scope.row)"
                >详情</el-button
              >

              <el-button
                link
                type="primary"
                size="small"
                @click="modifyHandler(scope.row)"
                v-if="
                  scope.row.flagStatus === '未提交' || scope.row.flagStatus === '驳回'
                "
                >编辑</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="submitHandler(scope.row)"
                v-if="
                  scope.row.flagStatus === '未提交' || scope.row.flagStatus === '驳回'
                "
                >提交</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="statusHandler(scope.row)"
                v-if="scope.row.flagStatus === '已发布'"
                >{{
                  scope.row.status === '停用' || scope.row.status === '未启用'
                    ? '启用'
                    : '停用'
                }}</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="clickRelease(scope.row)"
                v-if="scope.row.flagStatus === '待发布'"
                >发布</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                @click="deleteHandler(scope.row)"
                v-if="
                  scope.row.flagStatus === '未提交' || scope.row.flagStatus === '驳回'
                "
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.flagStatus !== '未提交'"
                @click="approvalHandler(scope.row)"
                >审批记录</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="addProduct(scope.row)"
                v-if="scope.row.flagStatus === '已发布'"
                >捐赠情况</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination
              v-model:currentPage="crowdStore.pageNum"
              v-model:page-size="crowdStore.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :small="true"
              :disabled="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="crowdStore.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-config-provider>
        </div>

        <!-- table 查看详情 -->
        <el-dialog
          v-model="detailShow"
          width="60%"
          top="15vh"
          :draggable="true"
          title="详情"
        >
          <el-descriptions
            class="margin-top"
            :column="2"
            size="default"
            :style="''"
            :border="true"
          >
            <el-descriptions-item
              v-for="des in descriptions"
              :key="des.prop"
              :label="des.label"
              width="40px"
            >
              <template> </template>
              <span v-html="detailInfo[des.prop]"></span>
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>

        <!--审批记录 -->
        <el-dialog
          v-model="approvalShow"
          width="40%"
          top="15vh"
          :draggable="true"
          title="审批记录"
        >
          <!-- <el-timeline>
            <el-timeline-item
              :timestamp="item.createTime"
              placement="top"
              v-for="item in approval"
              :key="item.id"
            >
              <el-card>
                <h4 class="mb-10px">{{ item.checkOpinion }}</h4>
                <p style="color: #cacaca"
                  >{{ item.checkName }} {{ item.checkStatus }} 于
                  {{ item.createTime }}</p
                >
              </el-card>
            </el-timeline-item>
          </el-timeline> -->
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
                <p style="font-weight: bold"
                  >{{ record.approverResult == '2' ? '操作' : '审核' }}人&nbsp;:
                  {{ record.approverOrg }}</p
                >
                <p
                  >{{ record.approverResult == '2' ? '操作' : '审核' }}意见&nbsp;:
                  {{ record.approverOpinion }}</p
                >
                <p
                  >{{ record.approverResult == '2' ? '操作' : '审核' }}结果&nbsp;:
                  {{ approvalProcessStore.getRecordStatus(record.approverResult) }}</p
                >
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 新增/编辑 -->
      <div class="edit_page" v-if="isShowEditPageData">
        <editPage @submit="submitEditPage" />
      </div>
      <!-- 捐赠详情 -->
      <div class="edit_page" v-if="isShowDonePageData">
        <Donation @submit="submitEditPage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="crowdfundingactivities">
  import { ref } from 'vue';
  import { ElTable, ElMessage, ElMessageBox, ElLoading } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './search/index.vue';
  import {
    CrowdListParams,
    recordType,
    CrowdManyList,
    detailMany,
    editPageSubmitModal,
    CrowdSaveParams,
  } from '/@/views/upms/model/crowdactivitiesModel';
  import {
    getOnlyActivitys,
    delActivitys,
    editStatus,
    activitySubmit,
    getApprovaList,
    eventRelease,
  } from '/@/views/upms/api/crowdFundingActivities';
  import Donation from './donationdetails/index.vue';
  import { useCrowdStore } from '/@/stores/modules/crowdfundModul';
  import { useApprovalProcessStore } from '/@/stores/modules/approvalProcess';
  const approvalProcessStore = useApprovalProcessStore();
  const crowdStore = useCrowdStore();
  const isShowEditPageData = ref<boolean>(false);
  const isShowDonePageData = ref<boolean>(false);
  // 函数的类型
  // type voidFunction = () => void;
  type handlerFunction<T> = (T) => void;
  type TableDescriptionType = {
    prop: string;
    label: string;
  };
  interface seachGroupInfoModel {
    status: boolean;
    height: string;
  }

  const descriptions = ref<TableDescriptionType[]>([
    {
      prop: 'activitiesCode',
      label: '项目编号',
    },
    {
      prop: 'activitiesName',
      label: '项目名称',
    },
    {
      prop: 'activitiesRecordCode',
      label: '项目备案号',
    },
    {
      prop: 'activitiesTerm',
      label: '活动期限',
    },
    {
      prop: 'activitiesStartTime',
      label: '活动开始日期',
    },
    {
      prop: 'activitiesEndTime',
      label: '活动结束日期',
    },
    {
      prop: 'head',
      label: '负责人',
    },
    {
      prop: 'phoneNumber',
      label: '联系方式',
    },
    {
      prop: 'isSetTarget',
      label: '是否设置筹款目标',
    },
    {
      prop: 'donationTarget',
      label: '筹款目标',
    },
    {
      prop: 'headIntroduction',
      label: '负责人简介',
    },
    {
      prop: 'activitiesMrg',
      label: '活动图片',
    },
    {
      prop: 'explainn',
      label: '活动简介',
    },
    {
      prop: 'introduce',
      label: '活动详细介绍',
    },
    {
      prop: 'executionPlan',
      label: '执行计划',
    },
    {
      prop: 'budgetPlanning',
      label: '预算规划',
    },
    {
      prop: 'noteEnplain',
      label: '捐赠票据说明',
    },
    {
      prop: 'organIntroduction',
      label: '执行机构介绍',
    },
    {
      prop: 'surplusPropertyDispose',
      label: '剩余财产处置说明',
    },
  ]);
  const detailInfo = ref({
    id: '',
    isSetTarget: '',
  });
  const detailShow = ref(false);

  //const tableHeight = ref(String);

  // table 的 REF

  const multipleTableRef = ref<InstanceType<typeof ElTable>>();

  // table 复选框已选择的行

  const multipleSelection = ref<CrowdListParams[]>([]);

  // table 复选框已选择的个数

  const multipleSelectionNumber = ref<number>(0);

  // table 高度

  const tableHeight = ref('50vh');
  const seachGroupInfo = ref<seachGroupInfoModel>({ status: false, height: '70' });

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
  // ==== 添加 table 的高度自适应 begin
  /**
   * 定义初始化方法进入页面默认查询
   */

  const handleSizeChange = (val: number) => {
    crowdStore.setPageInfo({
      pageNum: crowdStore.$state.pageNum,
      pageSize: val,
    });
    crowdStore.getList();
  };

  /**
   *
   * @param val
   */
  const handleCurrentChange = (val: number) => {
    crowdStore.setPageInfo({ pageNum: val });
    crowdStore.getList();
  };

  // table 复选框 被选取

  const handleSelectionChange = (val: CrowdListParams[]) => {
    multipleSelection.value = val;

    multipleSelectionNumber.value = val.length;
  };

  // 批量删除

  const deleteChoose = () => {
    if (multipleSelection.value!.length < 1) {
      ElMessage.warning('请选中删除的活动');
    } else {
      let template: string[] = [];
      let ifHas = false;
      multipleSelection.value.forEach((item) => {
        if (item.flagStatus === '未提交' || item.flagStatus === '驳回') {
          template.push(item.id);
        } else {
          ifHas = true;
        }
      });
      if (ifHas) {
        return ElMessage({
          message: '选中的数据中存在不能删除的数据，您可以在筛选合适状态后再批量删除。',
          type: 'warning',
          duration: 5000,
        });
      }
      // multipleSelection.value.forEach((obj) => {
      //   template.push(obj.id);
      // });
      const idArray = { ids: template };
      ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delActivitys(idArray).then(() => {
            ElMessage({
              message: '删除成功',
              type: 'success',
            });
            getTableList();
          });
        })
        .catch(() => ElMessage.info('已取消删除'));
    }
    // else {
    //   ElMessage({
    //     message: '此条不可删除',
    //     type: 'warning',
    //   });
    // }
  };

  // 删除

  const deleteHandler: handlerFunction<CrowdListParams> = (row: CrowdListParams) => {
    ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delActivitys({ ids: [row.id] }).then(() => {
          ElMessage({
            message: '删除成功',
            type: 'success',
          });
          getTableList();
        });
      })
      .catch(() => ElMessage.info('已取消删除'));
  };

  // 查看详情

  const detailClick = (row: CrowdListParams) => {
    getOnlyActivitys(row.id).then((res) => {
      detailInfo.value = res;
    });
    detailShow.value = true;
  };

  // 新增、添加

  const tableAdd = () => {
    isShowEditPageData.value = true;
    crowdStore.readyAdd();
  };

  // 编辑 按钮
  const modifyHandler = (obj: CrowdSaveParams) => {
    isShowEditPageData.value = true;
    crowdStore.editHandler(obj);
  };
  // 新增/编辑 页的提交
  const submitEditPage = (modal: editPageSubmitModal) => {
    console.log(' submitEditPage modal -> ', modal);
    switch (modal) {
      case 'cancel':
        isShowEditPageData.value = false;
        isShowDonePageData.value = false;
        return;
      case 'add':
        crowdStore.getList();
        break;

      case 'modify':
        crowdStore.getList();
        break;
    }
    // console.log(' 新增/编辑 页的提交', zmockStore.$state.list);
    // 如果需要在此请求列表，开放下一行的注释
    // crowdStore.getList();
    isShowEditPageData.value = false;
  };
  //发布
  function clickRelease(row) {
    const flagStatus = ref('');

    // if (multipleSelection.value!.length < 1) {
    //   ElMessage.warning('请选中需要发布的活动');
    // }
    // console.log(multipleSelection.value[0].flagStatus, 11);

    // multipleSelection.value.forEach((e) => {
    if (row.flagStatus == '待发布') {
      flagStatus.value = '发布';
      ElMessageBox.confirm('是否确认发布?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const loading = ElLoading.service({
            lock: true,
            text: 'loading...',
            background: 'rgba(0, 0, 0, 0.7)',
          });
          eventRelease(row.id, { flagStatus: flagStatus.value })
            .then(() => {
              getTableList();
            })
            .finally(() => {
              loading.close();
            });
        })
        .catch(() => ElMessage.info('已取消'));
    } else {
      return ElMessage.error('请发布审批成功的');
    }
    // });
  }
  //捐赠详情
  const addProduct = (row: detailMany) => {
    isShowDonePageData.value = true;
    crowdStore.detailHandler(row);
  };
  /**
  * 查询方法
  * @param Data
  */
  function queryTable(Data: CrowdManyList) {
    crowdStore.getList(Data);
  }
  /**
  * 列表请求
  * @param params
  */
  function getTableList() {
    crowdStore.getList();
  }
  getTableList();

  // 停用
  const statusHandler: handlerFunction<CrowdListParams> = (row: CrowdListParams) => {
    const status = ref('');
    if (row.status === '停用') {
      status.value = '启用';
    } else if (row.status === '启用') {
      status.value = '停用';
    } else if (row.status === '未启用') {
      status.value = '启用';
    }
    editStatus(row.id, { status: status.value }).then(() => {
      getTableList();
    });
  };
  // 提交
  const submitHandler: handlerFunction<CrowdListParams> = (row: CrowdListParams) => {
    const flagStatus = ref('');
    if (row.flagStatus === '未提交') {
      flagStatus.value = '提交';
    } else {
      flagStatus.value = '';
    }
    ElMessageBox.confirm('是否确认提交?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        const loading = ElLoading.service({
          lock: true,
          text: 'loading...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        activitySubmit(row)
          .then(() => {
            getTableList();
          })
          .finally(() => {
            loading.close();
          });
      })
      .catch(() => ElMessage.info('已取消'));
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: 'loading...',
    //   background: 'rgba(0, 0, 0, 0.7)',
    // });
    // editFlagstatus(row.id, { flagStatus: flagStatus.value })
    //   .then(() => {
    //     getTableList();
    //   })
    //   .finally(() => {
    //     loading.close();
    //   });
  };

  // 审批记录
  const approvalShow = ref(false);
  const approval = ref<recordType[]>([]);
  const approvalHandler = (row: CrowdListParams) => {
    getApprovaList(row.id).then((res) => {
      console.log(res);
      if (res!==null){
        approval.value = res;
      }else{
        ElMessage({
          message: '无记录！',
          type: 'success',
        });
      }
    }).then(()=>{
      approvalShow.value = true;
      })
    approval.value =[];
  };
</script>

<style scoped>
  .dept_all {
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
  .divHeight {
    height: 160px;
  }
  .floatLeft {
    float: left;
    margin: 0px;
    padding: 0px;
  }

  .marginTime {
    margin-left: 75px;
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
    height: 130px;
    border: 1px solid #acc0d8;
    background-color: black;
    float: left;
    margin-left: 6px;
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
  .edit_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
    overflow-y: auto;
  }
</style>
