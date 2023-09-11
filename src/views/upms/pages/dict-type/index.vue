<route lang="yaml">
  name: dictType
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">字典管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>

    <!-- 搜索组 -->
    <BaseSearch
      :queryData="queryData"
      @queryTable="queryTable"
      @getTableList="getTableList"
    />
    <div class="flex flex-col w-full px-20px">
      <div class="base-table">
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          :maxHeight="tableHeight"
          :style="{ width: '100%' }"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed width="20" />
          <el-table-column property="name" show-overflow-tooltip label="类型名称" />
          <el-table-column
            property="code"
            :show-overflow-tooltip="true"
            label="类型编码"
          />
          <el-table-column
            property="status"
            :show-overflow-tooltip="true"
            label="状态"
          />
          <el-table-column
            property="remark"
            :show-overflow-tooltip="true"
            label="备注"
          />
          <el-table-column fixed="right" label="操作" width="330">
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
                >编辑</el-button
              >
              <el-button link type="danger" size="small" @click="del(scope.row)"
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status === '启用'"
                @click="dictChange(scope.row.id, '启用')"
                >禁用</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status === '禁用'"
                @click="dictChange(scope.row.id, '禁用')"
                >启用</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="dictTypeTend(scope.row)"
                >字典维护</el-button
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
            <el-descriptions-item label="类型名称" label-align="left" align="center">
              {{ detailInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item label="类型编码" label-align="left" align="center">
              {{ detailInfo.code }}
            </el-descriptions-item>
            <el-descriptions-item label="状态" label-align="left" align="center">
              {{ detailInfo.status }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" label-align="left" align="center">
              {{ detailInfo.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>

        <el-dialog
          v-model="isShowEditPageData"
          width="40%"
          top="15vh"
          :title="addflag"
          :destroy-on-close="true"
          :draggable="true"
        >
          <addPage :data="isAddview" @closeRefresh="closeRefresh" />
        </el-dialog>
      </div>

      <!--      字典维护 -->
      <div class="item_page" v-if="isShowItemPageData">
        <itemPage :data="itemPageview" @closeRefresh="closeRefreshitem" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="type">
  import { ref } from 'vue';
  //import { useRouter } from 'vue-router';
  import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import { TypeListParams, TypeQueryParams } from '/@/views/upms/model/dictTypeModel';
  import {
    queryType,
    delType,
    dictTypeChange,
    detailType,
  } from '/@/views/upms/api/dictType';
  import { useUpmsType } from '/@/stores/modules/dictType';
  import BaseSearch from './typeSearch.vue';
  import { ItemListParams } from '/@/views/upms/model/dictItemModel';
  import { useUpmsItem } from '/@/stores/modules/dictItem';
  import addPage from './add/index.vue';
  import itemPage from '../dict-item/index.vue';
  // import {detailOrg} from "/@/views/upms/api/pbdOrg";
  // import {detailItem} from "/@/views/upms/api/dictItem";

  const useUpmsTypeStore = useUpmsType();
  const useUpmsItemStore = useUpmsItem();
  console.log('useUpmsItemStore::', useUpmsItemStore);
  //const router = useRouter();
  const detailInfo = ref<TypeListParams>({
    status: '',
    name: '',
    code: '',
    remark: '',
  });
  const total = ref(0);
  const detailShow = ref(false);
  const tableData = ref<TypeListParams[]>([]);
  const tableHeight = ref('50vh');
  // table 的 REF
  const multipleTableRef = ref<InstanceType<typeof ElTable>>();
  // table 复选框已选择的行
  const multipleSelection = ref<ItemListParams[]>([]);
  // table 复选框已选择的个数
  const multipleSelectionNumber = ref<number>(0);

  const isShowEditPageData = ref<boolean>(false);
  const isShowItemPageData = ref<boolean>(false);
  let addflag = ref('');

  const isAddview = ref<string>('add');
  const itemPageview = ref<string>('add');
  // 定义查询参数
  const queryData = ref<TypeQueryParams>({
    pageNum: 1,
    pageSize: 10,
    name: '',
    code: '',
    status: '',
  });

  /**
   * 定义初始化方法进入页面默认查询
   */
  const init = () => {
    getTableList(queryData.value);
  };

  init();
  const dictChange = (id, status) => {
    console.log(status);
    // 直接获取表格中的数据，或者访问后台代码
    if (status === '启用') {
      ElMessageBox.confirm('确认禁用已选中的数据项?', '禁用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: '',
      })
        .then(() => {
          dictTypeChange(id, status).then(() => {
            getTableList(queryData.value);
          });
        })
        .catch(() => ElMessage.info('已取消'))
        .finally(() => {});
    } else if (status === '禁用') {
      ElMessageBox.confirm('确认启用已选中的数据项?', '启用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: '',
      })
        .then(() => {
          dictTypeChange(id, status).then(() => {
            getTableList(queryData.value);
          });
        })
        .catch(() => ElMessage.info('已取消'))
        .finally(() => {});
    }
  };

  /**
   *
   * @param val
   */
  const handleSizeChange = (val: number) => {
    queryData.value.pageSize = val;
    getTableList(queryData.value);
  };

  /**
   *
   * @param val
   */
  const handleCurrentChange = (val: number) => {
    queryData.value.pageNum = val;
    getTableList(queryData.value);
  };

  // table 复选框 被选取
  const handleSelectionChange = (val: ItemListParams[]) => {
    multipleSelection.value = val;
    multipleSelectionNumber.value = val.length;
  };

  // 查看详情
  const detailClick = (row: TypeListParams) => {
    // 直接获取表格中的数据，或者访问后台代码
    detailType(row.id as string).then((res) => {
      detailInfo.value = res;
    });
    detailShow.value = true;
  };

  // 新增、添加
  const tableAdd = () => {
    isAddview.value = 'add';
    isShowEditPageData.value = true;
    addflag.value = '字典新增';
  };

  const closeRefresh = (type) => {
    isShowEditPageData.value = false;
    if (type == 'submit') {
      getTableList(queryData.value);
    }
  };
  const closeRefreshitem = () => {
    isShowItemPageData.value = false;
  };

  // 编辑 按钮
  const modifyHandler = (row: TypeListParams) => {
    isAddview.value = 'edit';
    useUpmsTypeStore.setEditDataInfo(row);
    isShowEditPageData.value = true;
    addflag.value = '字典编辑';
  };

  //字典维护
  const dictTypeTend = (row: TypeListParams) => {
    itemPageview.value = 'add';
    isShowItemPageData.value = true;
    useUpmsTypeStore.getCode(row);
    // useUpmsItemStore.queryItemList(row);
    /* router.push({ path: '/upms/dict-item', query: { code: row.code } });*/
  };

  //删除 按钮
  const del = (row: TypeListParams) => {
    const loading = ElLoading.service({
      lock: true,
      text: '数据删除中...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    ElMessageBox.confirm('确认删除已选中的数据项?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: '',
    })
      .then(() => {
        delType(row.id as string).then(() => {
          ElMessage({
            message: '删除成功！',
            type: 'success',
          });
          getTableList(queryData.value);
        });
        // res 里如果有参数判断删除成功，请取值判断处理
      })
      .catch(() => ElMessage.info('已取消'))
      .finally(() => {
        loading.close();
      });
  };

  /**
   * 查询方法
   * @param Data
   */
  function queryTable(Data: TypeQueryParams) {
    queryData.value = Data;
    getTableList(queryData.value);
  }

  /**
   * 列表请求
   * @param params
   */
  function getTableList(params: TypeQueryParams) {
    console.log('params----:', params);
    const loading = ElLoading.service({
      lock: true,
      text: 'loading...',
      background: 'rgba(255, 255, 255, 0.7)',
    });

    queryType(params)
      .then((res) => {
        tableData.value = res.records;
        tableData.value.map(function (val) {
          if (val.status == '0') {
            val.status = '启用';
          } else {
            val.status = '禁用';
          }
        });
        total.value = res.total;
      })
      .finally(() => {
        loading.close();
      });
  }
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
  .drawer_title svg {
    color: #cdcdcd;
  }
  .edit_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
  }

  .item_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
  }
</style>
