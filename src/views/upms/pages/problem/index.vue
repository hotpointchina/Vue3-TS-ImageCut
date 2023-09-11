<route lang="yaml">
name: problem
</route>

<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">常见问题</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="home_content_wrap">
      <div class="table_controll">
        <!-- <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp">
          <el-button
            link
            type="primary"
            size="small"
            @click="functionHandler"
            style="font-size: 14px"
            >批量操作</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteChoose"
            style="font-size: 14px"
            >删除</el-button
          > -->
        <!-- </div> -->
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
          <!-- <el-table-column type="selection" fixed width="55" /> -->
          <el-table-column type="index" fixed width="55" label="序号" />
          <el-table-column
            property="questionHead"
            :show-overflow-tooltip="true"
            label="问题标题"
          />
          <el-table-column
            property="questionType"
            :show-overflow-tooltip="true"
            label="问题类型"
          >
            <template #default="scope">
              <span v-if="scope.row.questionType === '0'">账号问题</span>
              <span v-if="scope.row.questionType === '1'">举报</span>
              <span v-if="scope.row.questionType === '2'">物流问题</span>
              <span v-if="scope.row.questionType === '3'">订单问题</span>
              <span v-if="scope.row.questionType === '4'">订单问题</span>
              <span v-if="scope.row.questionType === '5'">支付问题</span>
              <span v-if="scope.row.questionType === '6'">其他问题</span>
            </template>
          </el-table-column>
          <el-table-column
            property="questionLevel"
            :show-overflow-tooltip="true"
            label="问题级别"
          >
            <template #default="scope">
              <span v-if="scope.row.questionLevel === '1'">一级</span>
              <span v-if="scope.row.questionLevel === '2'">二级</span>
              <span v-if="scope.row.questionLevel === '3'">三级</span>
            </template>
          </el-table-column>
          <el-table-column
            property="questionDescrible"
            :show-overflow-tooltip="true"
            label="问题描述"
            width="300"
          />
          <!-- <el-table-column
            property="remark"
            :show-overflow-tooltip="true"
            label="备注"
            width="120"
          /> -->
          <!-- <el-table-column property="status" :show-overflow-tooltip="true" label="状态">
            <template #default="scope">
              <span v-if="scope.row.status === '0'">启用</span>
              <span v-if="scope.row.status === '1'">停用</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
            property="solution"
            :show-overflow-tooltip="true"
            label="解决办法"
            width="120"
          /> -->
          <el-table-column
            property="createTime"
            :show-overflow-tooltip="true"
            label="创建时间"
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
                @click="modifyHandler(scope.row)"
                v-if="scope.row.status == '1'"
                >编辑</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="statusHandler(scope.row)"
                >{{ scope.row.status == '0' ? '停用' : '启用' }}</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                @click="deleteChoose(scope.row)"
                v-if="scope.row.status == '1'"
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
            <el-descriptions-item label="问题标题" label-align="left" align="center">
              {{ detailInfo.questionHead }}
            </el-descriptions-item>
            <el-descriptions-item label="问题类型" label-align="left" align="center">
              {{ detailInfo.questionType }}
            </el-descriptions-item>
            <el-descriptions-item label="问题级别" label-align="left" align="center">
              {{ detailInfo.questionLevel }}
            </el-descriptions-item>
            <el-descriptions-item label="问题描述" label-align="left" align="center">
              {{ detailInfo.questionDescrible }}
            </el-descriptions-item>
            <el-descriptions-item label="解决办法" label-align="left" align="center">
              {{ detailInfo.solution }}
            </el-descriptions-item>
            <el-descriptions-item label="状态" label-align="left" align="center">
              {{ detailInfo.status }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间" label-align="left" align="center">
              {{ detailInfo.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" label-align="left" align="center">
              {{ detailInfo.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </div>
      <!-- 新增/编辑 -->
      <div class="edit_page" v-if="isShowEditPageData">
        <addPage @closeRefresh="closeRefresh" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="problem">
  import { reactive, ref } from 'vue';
  import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
  import { Plus, Close } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './search/index.vue';
  import addPage from './add/tableAdd.vue';
  import { ProblemListParams, ProblemQueryParams } from '/@/views/upms/model/problem';
  import {
    queryProblem,
    delProblem,
    detailProblem,
    statusProblem,
  } from '/@/views/upms/api/problem';
  import { useUpmsProblem } from '/@/stores/modules/problem';
  import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
  import {
    seachGroupInfoModel,
    autoTableHeightInfoModel,
  } from '/@/api/model/commonModel';
  export default {
    name: 'ProblemTable',
    components: { baseSearch, addPage },
    setup() {
      const useUpmsProblemStore = useUpmsProblem();
      const detailInfo = ref<ProblemListParams>({});
      const total = ref(0);
      const detailShow = ref(false);
      const tableData = ref<ProblemListParams[]>([]);
      // table 的 REF
      const multipleTableRef = ref<InstanceType<typeof ElTable>>();
      // table 复选框已选择的行
      const multipleSelection = ref<ProblemListParams[]>([]);
      // table 复选框已选择的个数
      const multipleSelectionNumber = ref<number>(0);
      const isShowEditPageData = ref<boolean>(false);
      const tableHeightInfo = reactive<autoTableHeightInfoModel>({
        tableHeight: '50vh',
        seachGroupInfo: { status: false, height: '70' },
      });
      // 定义查询参数
      const queryData = ref<ProblemQueryParams>({
        pageNum: 1,
        pageSize: 10,
        questionHead: '',
        questionType: '',
        questionLevel: '',
        questionDescrible: '',
        status: '',
        solution: '',
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
      const handleSelectionChange = (val: ProblemListParams[]) => {
        multipleSelection.value = val;
        multipleSelectionNumber.value = val.length;
      };
      // 批量删除
      const deleteChoose = (row) => {
        if (row.status == '0') {
          return ElMessage({
            message: '当前数据不可删除，您可以在筛选合适状态后再删除。',
            type: 'warning',
            duration: 5000,
          });
        } else {
          let template: string[] = [];
          template.push(row.id as string);
          ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              delProblem(template).then(() => {
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
      const detailClick = (row: ProblemListParams) => {
        // 直接获取表格中的数据，或者访问后台代码
        detailProblem(row.id as any).then((res) => {
          // 数据处理
          detailInfo.value = res;
          // 级别
          detailInfo.value.questionLevel =
            res.questionLevel == 1
              ? '一级'
              : '' || res.questionLevel == 2
              ? '二级'
              : '' || res.questionLevel == 3
              ? '三级'
              : '';
          // 类型
          detailInfo.value.questionType =
            res.questionType == 0
              ? '账号问题'
              : '' || res.questionType == 1
              ? '举报'
              : '' || res.questionType == 2
              ? '物流问题'
              : '' || res.questionType == 3
              ? '订单问题'
              : '' || res.questionType == 4
              ? '奖励规则'
              : '' || res.questionType == 5
              ? '支付问题'
              : '' || res.questionType == 6
              ? '其他问题'
              : '';
          // 状态
          detailInfo.value.status =
            // res.status == 0
            //   ? '未启用'
            //   : '' ||
            res.status == 0 ? '启用' : '停用';
          detailShow.value = true;
        });
      };
      // 新增、添加
      const tableAdd = () => {
        useUpmsProblemStore.isEditing = false;
        useUpmsProblemStore.modal = 'add';
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
      const modifyHandler = (row: ProblemListParams) => {
        useUpmsProblemStore.isEditing = true;
        useUpmsProblemStore.modal = 'modify';
        useUpmsProblemStore.setEditDataInfo(row);
        isShowEditPageData.value = true;
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
      function queryTable(Data: ProblemQueryParams) {
        getTableList(Data);
      }
      /**
       * 列表请求
       * @param params
       */
      function getTableList(params: ProblemQueryParams) {
        const loading = ElLoading.service({
          lock: true,
          text: '数据加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        queryProblem(params)
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
        // statusProblem(row.id).then();
        const status = ref();
        const statusTitle = ref('');
        if (row.status == 1) {
          status.value = 0;
          statusTitle.value = '启用';
        } else if (row.status == 0) {
          status.value = 1;
          statusTitle.value = '停用';
        }
        ElMessageBox.confirm(`是否${statusTitle.value}?`, '警告', {
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
            statusProblem(data)
              .then((res) => {
                getTableList(queryData.value);
                console.log(res);

                // if (status.value == 0 && res.msg == '成功') {
                //   ElMessage.success('该受捐人已启用');
                // } else if (status.value == 1 && res.msg == '成功') {
                //   ElMessage.success('该受捐人已停用');
                // }
                if (status.value == 0) {
                  ElMessage.success('该问题已启用');
                } else if (status.value == 1) {
                  ElMessage.success('该问题已停用');
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
        deleteChoose,
        detailClick,
        tableAdd,
        closeRefresh,
        modifyHandler,
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
