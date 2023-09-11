<route lang="yaml">
name: typeItem
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">字典维护</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
        <el-button @click="closeRefresh" plain> 返回 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <!--    <BaseSearch :queryData="queryData" @queryTable="queryTable" />-->
    <div class="flex flex-col w-full px-20px">
      <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp pl-30px">
          <!--          <el-button-->
          <!--            link-->
          <!--            type="primary"-->
          <!--            size="small"-->
          <!--            @click="functionHandler"-->
          <!--            style="font-size: 14px"-->
          <!--            >批量操作</el-button-->
          <!--          >-->
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
          <el-table-column type="selection" fixed width="55" />

          <el-table-column
            property="typeCode"
            :show-overflow-tooltip="true"
            label="字典类型编码"
          />
          <el-table-column
            property="name"
            :show-overflow-tooltip="true"
            label="字典项名称"
          />
          <el-table-column
            property="value"
            :show-overflow-tooltip="true"
            label="字典项值"
          />
          <el-table-column property="sort" :show-overflow-tooltip="true" label="排序" />
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
                >编辑</el-button
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
                @click="dictChangeStatus(scope.row.id, '禁用')"
                >启用</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination
              v-model:currentPage="queryItemData.pageNum"
              v-model:page-size="queryItemData.pageSize"
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
            <el-descriptions-item
              label="字典类型编码"
              label-align="left"
              align="center"
            >
              {{ detailInfo.typeCode }}
            </el-descriptions-item>
            <el-descriptions-item label="字典项名称" label-align="left" align="center">
              {{ detailInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item label="字典项值" label-align="left" align="center">
              {{ detailInfo.value }}
            </el-descriptions-item>

            <el-descriptions-item label="状态" label-align="left" align="center">
              {{ detailInfo.status }}
            </el-descriptions-item>

            <el-descriptions-item label="备注" label-align="left" align="center">
              {{ detailInfo.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
        <div v-if="useUpmsItemStore.addShow">
          <el-dialog
            v-model="useUpmsItemStore.addShow"
            :title="addflag"
            width="40%"
            top="15vh"
            :draggable="true"
          >
            <addPage ref="addEditPageRef" @close="addEditClose" />
            <el-row class="flex justify-start w-full is-justify-center">
              <el-button @click="closeDialog">取消</el-button>
              <el-button type="primary" @click="submitFrom()">提交</el-button>
            </el-row>
          </el-dialog>
        </div>
      </div>

      <div class="edit_page" v-if="isShowEditPageData">
        <addPage :data="isAddView" @closeRefreshItem="closeRefreshItem" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ItemType">
  import { ref } from 'vue';
  //import { useRouter, useRoute } from 'vue-router';
  import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import { ItemListParams, ItemQueryParams } from '/@/views/upms/model/dictItemModel';
  import {
    queryItem,
    delItem,
    editItemStatus,
    detailItem,
  } from '/@/views/upms/api/dictItem';
  import { useUpmsItem } from '/@/stores/modules/dictItem';
  import { useUpmsType } from '/@/stores/modules/dictType';
  //import  BaseSearch  from './itemSearch.vue'
  import { TypeQueryParams } from '/@/views/upms/model/dictTypeModel';
  import addPage from './add/index.vue';

  const addEditPageRef = ref<any>();
  const useUpmsItemStore = useUpmsItem();
  const useUpmsTypeStore = useUpmsType();
  const isShowEditPageData = ref<boolean>(false);
  const isAddView = ref<string>('add');
  const emit = defineEmits(['closeRefresh', 'closeRefreshItem']);
  let addflag = ref('');

  const detailInfo = ref<ItemListParams>({
    id: '',
    typeCode: '',
    name: '',
    value: '',
    sort: '',
    status: '',
    remark: '',
  });

  const total = ref(0);

  const detailShow = ref(false);
  const tableData = ref<ItemListParams[]>([]);
  //const tableHeight = ref(String);

  // table 的 REF

  const multipleTableRef = ref<InstanceType<typeof ElTable>>();

  // table 复选框已选择的行

  const multipleSelection = ref<ItemListParams[]>([]);

  // table 复选框已选择的个数

  const multipleSelectionNumber = ref<number>(0);

  // 定义查询参数
  const queryData = ref<TypeQueryParams>({
    pageNum: 1,
    pageSize: 10,
    name: '',
    code: '',
    status: '',
  });

  const queryItemData = ref<ItemQueryParams>({
    pageNum: 1,
    pageSize: 10,
    name: '',
    value: '',
    status: '',
    sort: '',
    typeCode: '',
  });

  /**
   * 定义初始化方法进入页面默认查询
   */
  const init = () => {
    // const typeQuery = {
    //   pageNum: 1,
    //   pageSize: 10,
    //   name: useUpmsItemStore.$state.itemInfo.name,
    //   code: useUpmsItemStore.$state.itemInfo.code,
    //   status: useUpmsItemStore.$state.itemInfo.status,
    // };
    useUpmsItemStore.typeCode = useUpmsTypeStore.code;
    getTableList();
    // queryData.value.name = typeQuery.name;
    // queryData.value.code = typeQuery.code;
    // queryData.value.status = typeQuery.status;
  };

  init();

  /**

 *
 * @param val
 */
  const handleSizeChange = (val: number) => {
    queryData.value.pageSize = val;
    getTableList();
  };

  const dictChange = (id, status) => {
    ElMessageBox.confirm('确认禁用已选中的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        // 直接获取表格中的数据，或者访问后台代码
        editItemStatus(id, status).then(() => {
          getTableList();
        });
      })
      .catch(() => ElMessage.info('已取消' + status));
  };
  const dictChangeStatus = (id, status) => {
    ElMessageBox.confirm('确认启用已选中的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        // 直接获取表格中的数据，或者访问后台代码
        editItemStatus(id, status).then(() => {
          getTableList();
        });
      })
      .catch(() => ElMessage.info('已取消' + status));
  };

  const closeRefreshItem = (type) => {
    isShowEditPageData.value = false;
    if (type == 'submit') {
      getTableList();
    }
  };

  /* const showEditPageClose = ()=>{
    useUpmsItemStore.addShow =false;
    useUpmsItemStore.resetState();
  }*/

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

  // 批量删除
  const deleteChoose = () => {
    let id: String[] = [];
    multipleSelection.value.forEach((item) => {
      id.push(item.id as string);
    });

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
        delItem({ ids: id })
          .then()
          .then(() => {
            ElMessage({
              message: '删除成功！',
              type: 'success',
            });
            getTableList();
          });
        // res 里如果有参数判断删除成功，请取值判断处理
      })
      .catch(() => ElMessage.info('已取消'))
      .finally(() => {
        loading.close();
      });
  };

  // 查看详情

  const detailClick = (row: ItemListParams) => {
    // 直接获取表格中的数据，或者访问后台代码
    detailItem(row.id as string).then((res) => {
      detailInfo.value = res;
    });
    detailShow.value = true;
  };

  // 新增/编辑 页面
  // 新增、添加

  const tableAdd = () => {
    // isAddView.value = 'add'
    // isShowEditPageData.value = true;
    addflag.value = '新增';
    useUpmsItemStore.addShow = true;
    /*useUpmsTypeStore.getCode()*/
  };

  const closeRefresh = (type) => {
    // type?'close':type
    emit('closeRefresh', type);
    // useUpmsItemStore.resetState();
  };

  const addEditClose = () => {
    useUpmsItemStore.addShow = false;
    getTableList();
  };
  // 关闭 新增/编辑 before
  // const showEditPageClose = () => {
  //   editPageData.show = false;
  // };

  // 编辑 按钮
  const modifyHandler = (row: ItemListParams) => {
    isAddView.value = 'edit';
    addflag.value = '编辑';
    useUpmsItemStore.addShow = true;
    useUpmsItemStore.setEditItemDataInfo(row);
    // isShowEditPageData.value = true;
  };

  const closeDialog = () => {
    useUpmsItemStore.addShow = false;
    useUpmsItemStore.resetState();
  };

  const submitFrom = () => {
    addEditPageRef.value.dicSubmitFrom(addEditPageRef.value.ruleFormRef);
    // useUpmsItemStore.submitFrom(addEditPageRef.value.ruleFormRef,addEditPageRef.value.ruleFormRef)
    // useUpmsItemStore.submitFrom();
    // getTableList();
  };

  /**
   * 批量操作，有进行方法修改，没有就删除
   */
  // const functionHandler = () => {
  //   console.log('批量操作');
  // };

  /**
   * 查询方法
   * @param Data
   */
  //字典维护 携带参数查询子节点列表
  // function queryTable(Data: TypeQueryParams) {
  //   getTableList();
  // }

  /**
   * 列表请求
   * @param params
   */
  function getTableList() {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    const params = {
      pageNum: queryItemData.value.pageNum,
      pageSize: queryItemData.value.pageSize,
      id: '',
      name: '',
      code: useUpmsTypeStore.code,
      status: '',
    };
    queryItem(params)
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
</style>
