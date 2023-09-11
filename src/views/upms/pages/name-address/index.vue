<route lang="yaml">
name: nameAddress
</route>

<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">受捐人申报</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="home_content_wrap">
      <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp">
          <el-button
            link
            type="primary"
            size="small"
            @click="functionHandler"
            style="font-size: 14px"
            >批量提交</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteChoose"
            style="font-size: 14px"
            >删除</el-button
          >
        </div>
      </div>
      <!-- table -->
      <div class="base_table">
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          :maxHeight="tableHeightInfo.tableHeight"
          :style="{ width: '100%' }"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" fixed width="55" />
          <!-- <el-table-column type="index" fixed width="55" label="序号" /> -->
          <el-table-column
            property="pwoName"
            :show-overflow-tooltip="true"
            label="所属公益组织"
          />
          <el-table-column
            property="type"
            :show-overflow-tooltip="true"
            label="名址类型"
          >
            <template #default="scope">
              <span v-if="scope.row.type === '0'">公益</span>
              <span v-if="scope.row.type === '1'">个人</span>
            </template>
          </el-table-column>
          <el-table-column property="sex" :show-overflow-tooltip="true" label="性别">
            <template #default="scope">
              <span v-if="scope.row.sex === '0'">男</span>
              <span v-if="scope.row.sex === '1'">女</span>
            </template>
          </el-table-column>
          <el-table-column property="age" :show-overflow-tooltip="true" label="年龄" />
          <el-table-column
            property="applyStatus"
            :show-overflow-tooltip="true"
            label="申请状态"
          >
            <template #default="scope">
              <span v-if="scope.row.applyStatus === '0'">待提交</span>
              <span v-if="scope.row.applyStatus === '1'">审核中</span>
              <span v-if="scope.row.applyStatus === '2'">驳回</span>
              <span v-if="scope.row.applyStatus === '3'">已通过</span>
              <span v-if="scope.row.applyStatus === '4'">已撤回</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            property="type"
            :show-overflow-tooltip="true"
            label="类型"

          >
            <template #default="scope">
              <span v-if="scope.row.type === '0'">公益</span>
              <span v-if="scope.row.type === '1'">个人</span>
            </template>
          </el-table-column> -->
          <el-table-column property="status" :show-overflow-tooltip="true" label="状态">
            <template #default="scope">
              <span v-if="scope.row.status === '0'">启用</span>
              <span v-if="scope.row.status === '1'">停用</span>
            </template>
          </el-table-column>

          <!-- <el-table-column
            property="applyTime"
            :show-overflow-tooltip="true"
            label="申请时间"
            width="200"
          >
            <template #default="scope">{{ scope.row.applyTime }}</template>
          </el-table-column> -->

          <el-table-column fixed="right" label="操作">
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
                v-if="scope.row.applyStatus == '0' || scope.row.applyStatus == '2'"
                >编辑</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="statusHandler(scope.row)"
                v-if="scope.row.applyStatus === '0'"
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
                @click="submitHandler(scope.row)"
                v-if="scope.row.applyStatus == '0' || scope.row.applyStatus == '2'"
                >提交
              </el-button>
              <!-- <el-button
                link
                type="primary"
                size="small"
                @click="publishHandler(scope.row)"
                >发布</el-button
              > -->
              <el-button link type="primary" size="small" @click="approvalHandler"
                >审批记录</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                @click="deleteHandler(scope.row)"
                v-if="scope.row.applyStatus == '0' || scope.row.applyStatus == '2'"
                >删除</el-button
              >
            </template>
          </el-table-column>
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
        <!-- table 查看详情 -->
        <el-dialog
          v-model="detailShow"
          title="详情"
          width="70%"
          top="15vh"
          :draggable="true"
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
          <el-descriptions class="margin-top" :column="1" size="default" :border="true">
            <el-descriptions-item
              :column="1"
              label="身份证件"
              label-align="left"
              align="center"
              class="listll"
            >
              <!-- {{ detailInfo.idCardMsg }}
              <template #descriptions-item>
                <img :src="detailInfo.idCardMsg" alt="" />
              </template> -->
              <span v-for="url in idCardMsg" v-html="url"></span>
            </el-descriptions-item>
            <el-descriptions-item label="其他凭证" label-align="left" align="center">
              <!-- {{ detailInfo.idCardMsg }}
              <template #descriptions-item>
                <img :src="detailInfo.idCardMsg" alt="" />
              </template> -->
              <span v-for="url in doneeMsg" v-html="url"></span>
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
                <p style="font-weight: bold">审核人&nbsp;: {{ record.approverOrg }}</p>
                <p>审核意见&nbsp;: {{ record.approverOpinion }}</p>
                <p
                  >审核结果&nbsp;:
                  <!-- {{ approvalProcessStore.getRecordStatus(record.approverResult) }} -->
                </p>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 新增/编辑 -->
      <div class="edit_page" v-if="isShowEditPageData">
        <addPage @closeRefresh="closeRefresh" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="address">
  import { reactive, ref } from 'vue';
  import {
    ElTable,
    ElLoading,
    ElMessage,
    FormInstance,
    ElMessageBox,
  } from 'element-plus';
  import { Plus, Close } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './doneeSearch.vue';
  import addPage from './add/doneeAdd.vue';
  import {
    AddressListParams,
    AddressQueryParams,
    AddressDetailParams,
    recordType,
  } from '/@/views/upms/model/doneeModel';
  import {
    list,
    batchRemove,
    addressDel,
    detail,
    activitySubmit,
    batchSubmit,
    // doneeStatus,
  } from '/@/views/upms/api/nameAddress';
  import { useUpmsAddress } from '/@/stores/modules/address';
  import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
  import {
    seachGroupInfoModel,
    autoTableHeightInfoModel,
  } from '/@/api/model/commonModel';
  import { editStatus } from '/@/views/upms/api/crowdFundingActivities';
  export default {
    name: 'AddressTable',
    components: { baseSearch, addPage },
    setup() {
      const useUpmsAddressStore = useUpmsAddress();
      const detailInfo = ref<AddressDetailParams>({});
      const total = ref(0);
      const detailShow = ref(false);
      const tableData = ref<AddressListParams[]>([]);
      const ruleFormRef = ref<FormInstance>();
      // table 的 REF
      const multipleTableRef = ref<InstanceType<typeof ElTable>>();
      // table 复选框已选择的行
      const multipleSelection = ref<AddressListParams[]>([]);
      // table 复选框已选择的个数
      const multipleSelectionNumber = ref<number>(0);
      let idCardMsg = ref<string[]>([]);
      let doneeMsg = ref<string[]>([]);
      const isShowEditPageData = ref<boolean>(false);
      const tableHeightInfo = reactive<autoTableHeightInfoModel>({
        tableHeight: '50vh',
        seachGroupInfo: { status: false, height: '70' },
      });
      //查看详情
      type TableDescriptionType = {
        prop: string;
        label: string;
      };
      type handlerFunction<T> = (T) => void;
      const descriptions = ref<TableDescriptionType[]>([
        {
          prop: 'doneeName',
          label: '受捐人姓名',
        },
        {
          prop: 'sex',
          label: '性别',
        },
        {
          prop: 'age',
          label: '年龄',
        },
        {
          prop: 'provinceName',
          label: '省',
        },
        {
          prop: 'cityName',
          label: '地市',
        },
        {
          prop: 'countyName',
          label: '区县',
        },
        {
          prop: 'doneeAddr',
          label: '详细地址',
        },
        {
          prop: 'phoneNumber',
          label: '受捐人联系方式',
        },
        {
          prop: 'type',
          label: '类型',
        },
        {
          prop: 'urgentName',
          label: '紧急联系人姓名',
        },
        {
          prop: 'urgentRelation',
          label: '紧急联系人关系',
        },
        {
          prop: 'urgentPhone',
          label: '紧急联系人电话',
        },
        {
          prop: 'doneeCycle',
          label: '受捐周期',
        },
        {
          prop: 'doneeTarget',
          label: '周期目标',
        },
        {
          prop: 'applyStatus',
          label: '申请状态',
        },
        {
          prop: 'status',
          label: '状态',
        },
        {
          prop: 'doneeExplain',
          label: '情况概述',
        },
        {
          prop: 'doneeIntroduce',
          label: '情况介绍',
        },
        // {
        //   prop: 'idCardMsg',
        //   label: '身份证件',
        // },
        // {
        //   prop: 'doneeMsg',
        //   label: '其他凭证',
        // },
        {
          prop: 'surplusPropertyDispose',
          label: '清分规则',
        },
      ]);
      // 定义查询参数
      const queryData = ref<AddressQueryParams>({
        pageNum: 1,
        pageSize: 10,
        id: '',
        doneeName: '',
        status: '',
        startTime: '',
        endTime: '',
        applyStatus: '',
        type: '',
      });
      const formLabelWidth = '58px';
      const form = ref({
        name: '',
      });
      /**
       * 定义初始化方法进入页面默认查询
       */
      const init = () => {
        getTableList(queryData.value);
      };
      init();
      /**
       *分页页数
       * @param val
       */
      const handleSizeChange = (val: number) => {
        queryData.value.pageSize = val;
        getTableList(queryData.value);
      };
      /**
       *分页页码
       * @param val
       */
      const handleCurrentChange = (val: number) => {
        queryData.value.pageNum = val;
        getTableList(queryData.value);
      };
      // table 复选框 被选取
      const handleSelectionChange = (val: AddressListParams[]) => {
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
            if (item.applyStatus === '0' || item.applyStatus === '2') {
              template.push(item.id as string);
            } else {
              ifHas = true;
            }
          });
          if (ifHas) {
            return ElMessage({
              message:
                '选中的数据中存在不能删除的数据，您可以在筛选合适状态后再批量删除。',
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
              batchRemove(idArray).then(() => {
                ElMessage({
                  message: '删除成功',
                  type: 'success',
                });
                getTableList(queryData.value);
              });
            })
            .catch(() => ElMessage.info('已取消删除'));
        }
      };
      // 查看详情
      const detailClick = (row: AddressListParams) => {
        // 直接获取表格中的数据，或者访问后台代码
        doneeMsg.value = [];
        idCardMsg.value = [];
        detail(row.id as string).then((res) => {
          detailInfo.value = res;
          detailInfo.value.type = res.type == 0 ? '公益' : '个人';
          detailInfo.value.sex = res.sex == 0 ? '男' : '女';
          detailInfo.value.urgentRelation =
            res.urgentRelation == 1
              ? '父子'
              : '' || res.urgentRelation == 2
              ? '母子'
              : '' || res.urgentRelation == 3
              ? '兄弟姐妹'
              : '' || res.urgentRelation == 4
              ? '朋友'
              : '';
          detailInfo.value.status = res.status == 0 ? '启用' : '停用';
          detailInfo.value.applyStatus =
            res.applyStatus == 0
              ? '待提交'
              : '' || res.applyStatus == 1
              ? '审核中'
              : '' || res.applyStatus == 2
              ? '驳回'
              : '' || res.applyStatus == 3
              ? '已通过'
              : '';
          console.log('1111', res.idCardMsg);
        });
        detailShow.value = true;
      };
      // 新增、添加
      const tableAdd = () => {
        // useUpmsAddressStore.setIsEditing = false;
        // useUpmsAddressStore.setModal = 'add';
        isShowEditPageData.value = true;
      };

      // 关闭 新增/编辑 before
      const closeRefresh = (type) => {
        isShowEditPageData.value = false;
        if (type == 'submit') {
          getTableList(queryData.value);
        }
      };

      // 编辑 按钮
      const modifyHandler = (row: AddressListParams) => {
        // useUpmsAddressStore.setIsEditing = true;
        // useUpmsAddressStore.setModal = 'modify';
        useUpmsAddressStore.setEditDataInfo(row);
        isShowEditPageData.value = true;
      };
      /**
       * 批量提交
       */
      const functionHandler = () => {
        if (multipleSelection.value!.length < 1) {
          ElMessage.warning('请选中可提交的受捐人');
        } else {
          let template: string[] = [];
          let ifHas = false;
          multipleSelection.value.forEach((item) => {
            if (item.applyStatus === '0') {
              template.push(item.id as string);
            } else {
              ifHas = true;
            }
          });
          if (ifHas) {
            return ElMessage({
              message:
                '选中的数据中存在不能提交的数据，您可以在筛选合适状态后再批量提交。',
              type: 'warning',
              duration: 5000,
            });
          }
          const idArray = { ids: template };
          ElMessageBox.confirm('确认提交已选中的数据项?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              batchSubmit(idArray).then(() => {
                ElMessage({
                  message: '提交成功',
                  type: 'success',
                });
                getTableList(queryData.value);
              });
            })
            .catch(() => ElMessage.info('已取消提交'));
        }
      };
      /* 删除 */
      const deleteHandler = (row: AddressListParams) => {
        ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            addressDel(row.id as string).then(() => {
              ElMessage({
                message: '删除成功！',
                type: 'success',
              });
              getTableList(queryData.value);
            });
          })
          .catch(() => ElMessage.info('已取消删除'));
      };
      /* 提交 */
      const submitHandler = (row: AddressListParams) => {
        ElMessageBox.confirm('确认提交已选中的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            activitySubmit(row.id as string).then(() => {
              ElMessage({
                message: '提交成功！',
                type: 'success',
              });
              getTableList(queryData.value);
            });
          })
          .catch(() => ElMessage.info('已取消提交'));
      };
      /**
       * 查询方法
       * @param Data
       */
      function queryTable(Data: AddressQueryParams) {
        getTableList(Data);
      }
      /**
       * 列表请求
       * @param params
       */
      function getTableList(params: AddressQueryParams) {
        console.log(params);

        const loading = ElLoading.service({
          lock: true,
          text: '数据加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        list(params)
          .then((res) => {
            console.log('res', res);

            // tableData.value = res.data.result.records;
            // total.value = res.data.result.total;
            tableData.value = res.records;
            total.value = res.total;
          })
          .finally(() => {
            loading.close();
          });
      }
      // 审批记录
      const approvalShow = ref(false);
      const approval = ref<recordType[]>([
        {
          id: '12',
          checkName: '申请',
          checkOpinion: '11',
          checkStatus: '已驳回',
          createTime: '2021-02-23',
          approverOrg: '说是',
          approverOpinion: '地市',
          approverResult: '说是',
        },
      ]);
      const approvalHandler = () => {
        // getApprovaList(row.id).then((res) => {
        //   console.log(res);
        //   approval.value = res;
        // });
        approvalShow.value = true;
      };

      const statusHandler: handlerFunction<AddressQueryParams> = (
        row: AddressQueryParams,
      ) => {
        // if (row.status === '停用') {
        //   status.value = '启用';
        // } else if (row.status === '启用') {
        //   status.value = '停用';
        // } else if (row.status === '未启用') {
        //   status.value = '启用';
        // }
        if (row.status === '0') {
          ElMessageBox.confirm('确认禁用已选中的数据项?', '停用', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: '',
          })
            .then(() => {
              editStatus(row.id as string, { status: '停用' }).then(() => {
                getTableList(queryData.value);
              });
            })
            .catch(() => ElMessage.info('已取消'))
            .finally(() => {});
        } else if (row.status === '1') {
          ElMessageBox.confirm('确认启用已选中的数据项?', '启用', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: '',
          })
            .then(() => {
              editStatus(row.id as string, { status: '启用' }).then(() => {
                getTableList(queryData.value);
              });
            })
            .catch(() => ElMessage.info('已取消'))
            .finally(() => {});
        }
        // else if (row.status === '未启用') {
        //   ElMessageBox.confirm('确认启用已选中的数据项?', '启用', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: '',
        //   })
        //     .then(() => {
        //       editStatus(row.id, { status: "启用" }).then(() => {
        //         getTableList(queryData.value);
        //       });
        //     })
        //     .catch(() => ElMessage.info('已取消'))
        //     .finally(() => { });
        // }
        // editStatus(row.id, { status: status.value }).then(() => {
        //   getTableList();
        // });
      };
      // ==== 添加 table 的高度自适应 begin
      const isFolder = (obj: seachGroupInfoModel = tableHeightInfo.seachGroupInfo) => {
        isFolderHelper(obj, tableHeightInfo);
      };
      isFolderHelper(tableHeightInfo.seachGroupInfo, tableHeightInfo);
      window.onresize = () => {
        isFolderHelper(tableHeightInfo.seachGroupInfo, tableHeightInfo);
      };
      return {
        idCardMsg,
        doneeMsg,
        zhCn,
        Plus,
        Close,
        statusHandler,
        detailInfo,
        total,
        detailShow,
        tableData,
        tableHeightInfo,
        multipleSelectionNumber,
        multipleTableRef,
        isShowEditPageData,
        queryTable,
        handleSizeChange,
        handleCurrentChange,
        handleSelectionChange,
        deleteChoose,
        detailClick,
        tableAdd,
        closeRefresh,
        modifyHandler,
        isFolder,
        functionHandler,
        queryData,
        approvalShow,
        approvalHandler,
        formLabelWidth,
        form,
        ruleFormRef,
        deleteHandler,
        descriptions,
        approval,
        submitHandler,
        // publishHandler,
      };
    },
  };
</script>
<style scoped>
  @import url('/@/styles/chinapost/admcDefaultStyle.css');
  .edit_page {
    overflow-y: auto;
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
</style>
