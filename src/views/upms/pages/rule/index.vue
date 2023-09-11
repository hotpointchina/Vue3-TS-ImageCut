<route lang="yaml">
name: rule
</route>

<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">规则管理</h1>
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
          <el-button link type="danger" size="small" @click="deleteChoose" style="font-size: 14px">批量删除</el-button>
        </div>
      </div>
      <!-- table -->
      <div class="base_table">
        <el-table ref="multipleTableRef" :data="tableData" :maxHeight="tableHeightInfo.tableHeight"
          :style="{ width: '100%' }" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed width="55" />
          <el-table-column property="ruleCode" label="规则标识" width="140" />
          <el-table-column property="ruleName" label="规则名称" width="100" />
          <el-table-column property="ruleLhs" label="规则数据" width="140" :show-overflow-tooltip="true" />
          <el-table-column property="ruleRns" label="规则执行" width="140" :show-overflow-tooltip="true" />
          <el-table-column property="ruleType" label="规则类型" width="90">
            <template #default="scope">
              <span v-if="scope.row.ruleType === '1'">奖励</span>
              <span v-if="scope.row.ruleType === '2'">清分</span>
            </template>
          </el-table-column>
          <el-table-column property="status" label="状态" width="90">
            <template #default="scope">
              <span v-if="scope.row.status === '0'">待发布</span>
              <span v-if="scope.row.status === '1'">已发布</span>
            </template>
          </el-table-column>
          <el-table-column property="createTime" :show-overflow-tooltip="true" label="创建时间" />
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">

              <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="deleteHandler(scope.row)">删除</el-button>
              <el-button link type="primary" size="small" @click="publishHandler(scope.row)"
                v-if="scope.row.status === '0'">发布</el-button>
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
import baseSearch from './ruleSearch.vue';
import addPage from './add/index.vue';
import {
  RuleListParams,
  RuleQueryParams,
} from '/@/views/upms/model/rule';
import {
  queryRule,
  delRule,
  publish
} from '/@/views/upms/api/rule';
import { useUpmsRule } from '/@/stores/modules/rule';
import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
import {
  seachGroupInfoModel,
  autoTableHeightInfoModel,
} from '/@/api/model/commonModel';
export default {
  name: 'RuleTable',
  components: { baseSearch, addPage },
  setup() {
    const useUpmsRuleStore = useUpmsRule();
    const total = ref(0);
    const tableData = ref<RuleListParams[]>([]);
    const ruleFormRef = ref<FormInstance>();
    // table 的 REF
    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    // table 复选框已选择的行
    const multipleSelection = ref<RuleListParams[]>([]);
    // table 复选框已选择的个数
    const multipleSelectionNumber = ref<number>(0);
    const isShowEditPageData = ref<boolean>(false);
    const tableHeightInfo = reactive<autoTableHeightInfoModel>({
      tableHeight: '50vh',
      seachGroupInfo: { status: false, height: '70' },
    });

    // 定义查询参数
    const queryData = ref<RuleQueryParams>({
      pageNum: 1,
      pageSize: 10,
      ruleName: '',
      ruleType: ''
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
    const handleSelectionChange = (val: RuleListParams[]) => {
      multipleSelection.value = val;
      multipleSelectionNumber.value = val.length;
    };

    // 新增、添加
    const tableAdd = () => {
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
    const modifyHandler = (row: RuleListParams) => {
      useUpmsRuleStore.setEditDataInfo(row);
      isShowEditPageData.value = true;
    };
    // 批量删除
    const deleteChoose = () => {
      if (multipleSelection.value!.length < 1) {
        ElMessage.warning('请选中删除数据');
      } else {
        let template: string[] = [];
        multipleSelection.value.forEach((item) => {
          template.push(item.id as string)
        });
        // const idArray = { ids: template };
        ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            delRule(template).then(() => {
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
    /* 删除 */
    const deleteHandler = (row: RuleListParams) => {
      ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delRule([row.id as string]).then(() => {
            ElMessage({
              message: '删除成功！',
              type: 'success',
            });
            getTableList(queryData.value);
          });
        })
        .catch(() => ElMessage.info('已取消删除'));

    };
    /**
     * 查询方法
     * @param Data
     */
    function queryTable(Data: RuleQueryParams) {
      getTableList(Data);
    }
    /**
     * 列表请求
     * @param params
     */
    function getTableList(params: RuleQueryParams) {
      console.log(params);

      const loading = ElLoading.service({
        lock: true,
        text: '数据加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      queryRule(params)
        .then((res) => {
          tableData.value = res.records;
          total.value = res.total;
        })
        .finally(() => {
          loading.close();
        });
    }

    // 发布
    const publishHandler = (row: RuleListParams) => {
      ElMessageBox.confirm('确认发布', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          publish(row.id).then(() => {
            ElMessage({
              message: '发布成功',
              type: 'success',
            });
            getTableList(queryData.value);
          });
        })
        .catch(() => ElMessage.info('已取消发布'));
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
      total,
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
      tableAdd,
      closeRefresh,
      modifyHandler,
      isFolder,
      queryData,
      ruleFormRef,
      deleteHandler,
      publishHandler
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
