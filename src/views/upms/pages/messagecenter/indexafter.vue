<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">消息中心</h1>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="home_content_wrap">
      <div class="table_controll">
        <!-- <span>已选择 {{ multipleSelectionNumber }} 项</span> -->
        <div class="button_grounp">
          <el-button
            link
            type="primary"
            size="small"
            @click="functionHandler"
            style="font-size: 14px"
            >全部已读</el-button
          >
          <el-divider direction="vertical" />
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
            property="noticeTitle"
            :show-overflow-tooltip="true"
            label="消息名称"
            width="120"
          />
          <el-table-column
            property="isRead"
            :show-overflow-tooltip="true"
            label="消息状态"
            width="120"
          >
            <template #default="scope">
              <span v-if="scope.row.isRead === '1'">已读</span>
              <span v-if="scope.row.isRead === '2'">未读</span>
            </template>
          </el-table-column>
          <el-table-column
            property="noticeContent"
            :show-overflow-tooltip="true"
            label="消息内容"
          />
          <el-table-column
            property="publishTime"
            :show-overflow-tooltip="true"
            label="消息接收时间"
            width="200"
          >
            <template #default="scope">{{ scope.row.publishTime }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="detailClick(scope.row)"
                >详情</el-button
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
            :column="3"
            :size="'default'"
            :style="''"
            :border="true"
          >
            <el-descriptions-item label="通知标题" label-align="left" align="center">
              {{ detailInfo.noticeTitle }}
            </el-descriptions-item>
            <el-descriptions-item label="通知内容" label-align="left" align="center">
              {{ detailInfo.noticeContent }}
            </el-descriptions-item>
            <el-descriptions-item label="开始时间" label-align="left" align="center">
              {{ detailInfo.publishTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="notice">
  import { reactive, ref } from 'vue';
  import { ElTable, ElLoading, ElMessage } from 'element-plus';
  import { Plus, Close } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './messageSearch.vue';
  import {
    NoticeListParams,
    NoticeQueryParams,
  } from '/@/views/upms/model/massageModel';
  import { queryNotice, delNotice, messageRead } from '/@/views/upms/api/messageCenter';
  //   import { useUpmsNotice } from '/@/stores/modules/notice';
  import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
  import { useTenantStore } from '/@/stores/modules/tenant';
  import {
    seachGroupInfoModel,
    autoTableHeightInfoModel,
  } from '/@/api/model/commonModel';
  export default {
    name: 'MessageTable',
    components: { baseSearch },
    setup() {
      //   const useUpmsNoticeStore = useUpmsNotice();
      const detailInfo = ref<NoticeListParams>({});
      const total = ref(0);
      const detailShow = ref(false);
      const tableData = ref<NoticeListParams[]>([]);
      // table 的 REF
      const multipleTableRef = ref<InstanceType<typeof ElTable>>();
      // table 复选框已选择的行
      const multipleSelection = ref<NoticeListParams[]>([]);
      // table 复选框已选择的个数
      const multipleSelectionNumber = ref<number>(0);
      const isShowEditPageData = ref<boolean>(false);
      const useTenant = useTenantStore();
      const tableHeightInfo = reactive<autoTableHeightInfoModel>({
        tableHeight: '50vh',
        seachGroupInfo: { status: false, height: '70' },
      });
      // 定义查询参数
      const queryData = ref<NoticeQueryParams>({
        pageNum: 1,
        pageSize: 10,
        // noticeType: '',
        noticeTitle: '',
        startTime: '',
        endTime: '',
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
      const handleSelectionChange = (val: NoticeListParams[]) => {
        multipleSelection.value = val;
        multipleSelectionNumber.value = val.length;
      };
      // 批量删除
      const deleteChoose = () => {
        if (multipleSelection.value!.length < 1) {
          ElMessage.warning('请选中删除的活动');
        } else {
          let template: string[] = [];
          multipleSelection.value.forEach((item) => {
            template.push(item.id as string);
          });

          ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const loading = ElLoading.service({
                lock: true,
                text: '数据删除中...',
                background: 'rgba(0, 0, 0, 0.7)',
              });
              delNotice(template)
                .then(() => {
                  ElMessage({
                    message: '删除成功',
                    type: 'success',
                  });
                  getTableList(queryData.value);
                })
                .finally(() => {
                  loading.close();
                });
            })
            .catch(() => ElMessage.info('已取消删除'));
        }
      };
      // 查看详情
      const detailClick = (row: NoticeListParams) => {
        // 直接获取表格中的数据，或者访问后台代码
        detailInfo.value = row;
        detailShow.value = true;
      };

      /**
       * 一键已读
       */
      const functionHandler = () => {
        // console.log('批量操作');
        // if (multipleSelection.value.length == 0) {
        //   ElMessage({
        //     message: '请选择需要进行操作的数据！',
        //     type: 'error',
        //   });
        //   return;
        // }
        // let template: string[] = [];
        // multipleSelection.value.forEach((item) => {
        //   template.push(item.id as string);
        // });
        messageRead().then(() => {
          // ElMessage({
          //   message: '全部已读',
          //   type: 'success',
          // });
          getTableList(queryData.value);
          useTenant.setProjectList();
        });
      };
      /**
       * 查询方法
       * @param Data
       */
      function queryTable(Data: NoticeQueryParams) {
        getTableList(Data);
      }
      /**
       * 列表请求
       * @param params
       */
      function getTableList(params: NoticeQueryParams) {
        const loading = ElLoading.service({
          lock: true,
          text: '数据加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        queryNotice(params)
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
        deleteChoose,
        detailClick,
        isFolder,
        functionHandler,
        queryData,
      };
    },
  };
</script>
<style scoped>
  @import url('/@/styles/common/admcDefaultStyle.css');
</style>
