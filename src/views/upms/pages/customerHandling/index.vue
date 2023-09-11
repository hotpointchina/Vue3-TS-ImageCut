<route lang="yaml">
name: customer
</route>

<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">客户维护</h1>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="home_content_wrap">
      <div class="table_controll"> </div>
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
          <!-- <el-table-column type="selection" fixed width="55" /> -->
          <el-table-column type="index" fixed width="55" label="序号" />
          <el-table-column
            property="username"
            :show-overflow-tooltip="true"
            label="用户名"
          />
          <el-table-column
            property="nickname"
            :show-overflow-tooltip="true"
            label="用户昵称"
          />
          <el-table-column
            property="mobile"
            :show-overflow-tooltip="true"
            label="电话"
          />
          <el-table-column
            property="provinceName"
            :show-overflow-tooltip="true"
            label="省"
          />

          <el-table-column
            property="cityName"
            :show-overflow-tooltip="true"
            label="市"
          />
          <el-table-column
            property="countyName"
            :show-overflow-tooltip="true"
            label="区县"
            width="120"
          />
          <el-table-column
            property="addr"
            :show-overflow-tooltip="true"
            label="详细地址"
            width="120"
          />
          <el-table-column
            property="email"
            :show-overflow-tooltip="true"
            label="邮箱"
          />
          <el-table-column property="status" :show-overflow-tooltip="true" label="状态">
            <template #default="scope">
              <!-- <span v-if="scope.row.status === '0'">未启用</span> -->
              <span v-if="scope.row.status === '0'">启用</span>
              <span v-if="scope.row.status === '1'">停用</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200">
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
                @click="statusHandler(scope.row)"
                >{{ scope.row.status == '0' ? '停用' : '启用' }}</el-button
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
          width="60%"
          top="15vh"
          :draggable="true"
        >
          <el-descriptions
            class="margin-top"
            :column="2"
            :size="'default'"
            :style="''"
            :border="true"
          >
            <el-descriptions-item label="用户名" label-align="left" align="center">
              {{ detailInfo.username }}
            </el-descriptions-item>
            <el-descriptions-item label="用户昵称" label-align="left" align="center">
              {{ detailInfo.nickname }}
            </el-descriptions-item>
            <el-descriptions-item label="头像" label-align="left" align="center">
              <!-- {{ detailInfo.avatarUrl }} -->
              <span><img :src="detailInfo.avatarUrl" alt="" /> </span>
            </el-descriptions-item>
            <el-descriptions-item label="账号" label-align="left" align="center">
              {{ detailInfo.username }}
            </el-descriptions-item>
            <!-- <el-descriptions-item label="密码" label-align="left" align="center">
              {{ detailInfo.password }}
            </el-descriptions-item> -->
            <el-descriptions-item label="联系电话" label-align="left" align="center">
              {{ detailInfo.mobile }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱" label-align="left" align="center">
              {{ detailInfo.email }}
            </el-descriptions-item>
            <el-descriptions-item label="省" label-align="left" align="center">
              {{ detailInfo.provinceName }}
            </el-descriptions-item>
            <el-descriptions-item label="市" label-align="left" align="center">
              {{ detailInfo.cityName }}
            </el-descriptions-item>
            <el-descriptions-item label="区县" label-align="left" align="center">
              {{ detailInfo.countyName }}
            </el-descriptions-item>
            <el-descriptions-item label="详细地址" label-align="left" align="center">
              {{ detailInfo.addr }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="problem">
  import { reactive, ref } from 'vue';
  import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
  import { Plus, Close } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './search.vue';
  import {
    CustomerListParams,
    CustomerQueryParams,
    CustomerDetailParams,
  } from '/@/views/upms/model/customerModel';
  import {
    queryCustomer,
    getOnlyCustomer,
    saveCustomer,
  } from '/@/views/upms/api/customerHand';
  import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
  import {
    seachGroupInfoModel,
    autoTableHeightInfoModel,
  } from '/@/api/model/commonModel';
  export default {
    name: 'customer',
    components: { baseSearch },
    setup() {
      const detailInfo = ref<CustomerDetailParams>({});
      const total = ref(0);
      const detailShow = ref(false);
      const tableData = ref<CustomerListParams[]>([]);
      // table 的 REF
      const multipleTableRef = ref<InstanceType<typeof ElTable>>();
      // table 复选框已选择的行
      const multipleSelection = ref<CustomerListParams[]>([]);
      // table 复选框已选择的个数
      const multipleSelectionNumber = ref<number>(0);
      const isShowEditPageData = ref<boolean>(false);
      const tableHeightInfo = reactive<autoTableHeightInfoModel>({
        tableHeight: '50vh',
        seachGroupInfo: { status: false, height: '70' },
      });
      // 定义查询参数
      const queryData = ref<CustomerQueryParams>({
        pageNum: 1,
        pageSize: 10,
        username: '',
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
      const handleSelectionChange = (val: CustomerListParams[]) => {
        multipleSelection.value = val;
        multipleSelectionNumber.value = val.length;
      };
      // 查看详情
      const detailClick = (row: CustomerListParams) => {
        // 直接获取表格中的数据，或者访问后台代码
        getOnlyCustomer(row.id as any).then((res) => {
          // 数据处理
          detailInfo.value = res;
          detailShow.value = true;
        });
      };
      /**
       * 批量操作，有进行方法修改，没有就删除
       */
      const functionHandler = () => {
        console.log('批量操作');
      };
      /**
       * 查询方法
       * @param Data
       */
      function queryTable(Data: CustomerQueryParams) {
        getTableList(Data);
      }
      /**
       * 列表请求
       * @param params
       */
      function getTableList(params: CustomerQueryParams) {
        const loading = ElLoading.service({
          lock: true,
          text: '数据加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        queryCustomer(params)
          .then((res) => {
            tableData.value = res.records;
            total.value = res.total;
            queryData.value.pageSize = res.size;
            queryData.value.pageNum = res.current;
          })
          .finally(() => {
            loading.close();
          });
      }
      /**
       * 停用启用
       * @param params
       */
      function statusHandler(row) {
        console.log(row);
        // saveCustomer(row.id).then();
        const status = ref();
        const statusTitle = ref('');
        if (row.status == 1) {
          status.value = 0;
          statusTitle.value = '启用';
        } else if (row.status == 0) {
          status.value = 1;
          statusTitle.value = '停用';
        }
        ElMessageBox.confirm(`是否${statusTitle.value}该客户?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const loading = ElLoading.service({
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            });
            const data = { id: row.id, status: status.value };
            saveCustomer(data)
              .then((res) => {
                getTableList(queryData.value);
                console.log(res);

                // if (status.value == 0 && res.msg == '成功') {
                //   ElMessage.success('该受捐人已启用');
                // } else if (status.value == 1 && res.msg == '成功') {
                //   ElMessage.success('该受捐人已停用');
                // }
                if (status.value == 0) {
                  ElMessage.success('该客户已启用');
                } else if (status.value == 1) {
                  ElMessage.success('该客户已停用');
                }
              })
              .finally(() => {
                loading.close();
              });
          })
          .catch(() => ElMessage.info(`已取消${statusTitle.value}`));
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
        Plus,
        Close,
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
        detailClick,
        isFolder,
        functionHandler,
        queryData,
        statusHandler,
      };
    },
  };
</script>
<style scoped>
  @import url('/@/styles/common/admcDefaultStyle.css');
</style>
