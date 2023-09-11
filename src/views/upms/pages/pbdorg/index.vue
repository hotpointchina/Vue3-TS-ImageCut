<route lang="yaml">
name: pbdorg
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">机构管理</h1>

      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>

    <!-- 搜索组 -->

    <Search
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
<!--          <el-table-column type="selection" fixed width="55" />-->

          <el-table-column
            property="orgCode"
            :show-overflow-tooltip="true"
            label="机构编号"
            width="115"
          />

          <el-table-column
            property="orgName"
            :show-overflow-tooltip="true"
            label="机构名称"
            width="115"
          />

          <el-table-column
            property="parentOrgCode"
            :show-overflow-tooltip="true"
            label="上级机构编号"
            width="115"
          />

          <el-table-column
            property="parentOrgName"
            :show-overflow-tooltip="true"
            label="上级机构名称"
            width="115"
          />
          <el-table-column
            property="provinceName"
            :show-overflow-tooltip="true"
            label="所在省"
            width="115"
          />

          <el-table-column
            property="cityName"
            :show-overflow-tooltip="true"
            label="所在地市"
            width="115"
          />

          <el-table-column
            property="countyName"
            :show-overflow-tooltip="true"
            label="所在区县"
            width="115"
          />

          <el-table-column
            property="addr"
            :show-overflow-tooltip="true"
            label="详细地址"
          />

          <el-table-column
            property="status"
            :show-overflow-tooltip="true"
            label="状态"
            width="115"
          />

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
              >编辑</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status === '启用'"
                @click="usedChange(scope.row.id, '启用')"
              >禁用</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="scope.row.status === '禁用'"
                @click="usedChange(scope.row.id, '禁用')"
              >启用</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                @click="deleteChoose(scope.row)"
                style="font-size: 14px"
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
            :column="3"
            :size="'default'"
            :style="''"
            :border="true"
          >
            <el-descriptions-item label="机构名称" label-align="left" align="center">
              {{ detailInfo.orgName }}
            </el-descriptions-item>

            <el-descriptions-item label="负责人" label-align="left" align="center">
              {{ detailInfo.head }}
            </el-descriptions-item>

            <el-descriptions-item label="联系电话" label-align="left" align="center">
              {{ detailInfo.phoneNumber }}
            </el-descriptions-item>

            <el-descriptions-item label="所在省" label-align="left" align="center">
              {{ detailInfo.provinceName }}
            </el-descriptions-item>

            <el-descriptions-item label="所在地市" label-align="left" align="center">
              {{ detailInfo.cityName }}
            </el-descriptions-item>

            <el-descriptions-item label="所在区县" label-align="left" align="center">
              {{ detailInfo.countyName }}
            </el-descriptions-item>

            <el-descriptions-item label="详细地址" label-align="left" align="center">
              {{ detailInfo.addr }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </div>
      <!--     控制新增页面显隐-->
      <div class="edit_page" v-if="isShowEditPageData">
        <orgAdd :data="isAddView" @closeRefresh="closeRefresh" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="pbdorg">
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import Search from './orgSearch.vue';
import { OrgListParams, OrgQueryParams } from '/@/views/upms/model/pbdOrgModel';
import { queryOrg, delOrg, useChange, detailOrg } from '/@/views/upms/api/pbdOrg';
import { useUpmsOrg } from '/@/stores/modules/pbd';
import orgAdd from './add/index.vue';
const useUpmsOrgStore = useUpmsOrg();
const detailInfo = ref<OrgListParams>({
  id: '',
  status: '',
});
const total = ref(0);
const detailShow = ref(false);
const tableData = ref<OrgListParams[]>([]);
const tableHeight = ref('50vh');
// table 的 RE
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// table 复选框已选择的行
const multipleSelection = ref<OrgListParams[]>([]);
// table 复选框已选择的个数
const multipleSelectionNumber = ref<number>(0);

const isShowEditPageData = ref<boolean>(false);
const isAddView = ref<string>('add');
// 定义查询参数
const queryData = ref<OrgQueryParams>({
  pageNum: 1,
  pageSize: 10,
  provinceName: '',
  cityName: '',
  countyName: '',
  orgCode: '',
  orgName: '',
  parentOrgName: '',
  orgLevel: '',
  status: '',
});

/**
 * 定义初始化方法进入页面默认查
 */
const init = () => {
  getTableList(queryData.value);
};
init();

/**
 *
 * @param val
 */
const handleSizeChange = (val: number) => {
  queryData.value.pageSize = val;
  console.log(queryData.value);
  getTableList(queryData.value);
};

// 关闭 新增/编辑 before
const closeRefresh = (type) => {
  isShowEditPageData.value = false;
  if (type == 'submit') {
    getTableList(queryData.value);
  }
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
const handleSelectionChange = (val: OrgListParams[]) => {
  multipleSelection.value = val;
  multipleSelectionNumber.value = val.length;
};

// 批量删除
const deleteChoose = (row) => {
  let id: String[] = [];
  id.push(row.id);
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
      // res 里如果有参数判断删除成功，请取值判断处理

      delOrg({ ids: id }).then(() => {
        ElMessage({
          message: '删除成功！',
          type: 'success',
        });
        getTableList(queryData.value);
      });
    })
    .catch(() => ElMessage.info('已取消'))
    .finally(() => {
      loading.close();
    });
};

// 查看详情
const detailClick = (row: OrgListParams) => {
  // 直接获取表格中的数据，或者访问后台代码
  detailOrg(row.id).then((res) => {
    detailInfo.value = res;
  });
  detailShow.value = true;
};
const usedChange = (id, status) => {
  // 直接获取表格中的数据，或者访问后台代码
  if (status === '启用') {
    ElMessageBox.confirm('确认禁用已选中的数据项?', '禁用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: '',
    })
      .then(() => {
        useChange(id, status).then(() => {
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
        useChange(id, status).then(() => {
          getTableList(queryData.value);
        });
      })
      .catch(() => ElMessage.info('已取消'))
      .finally(() => {});
  }
};

// 新增/编辑 页面

// const ruleFormRef = ref<FormInstance>();

// 新增、添加

const tableAdd = () => {
  isAddView.value = 'add';
  isShowEditPageData.value = true;
  useUpmsOrgStore.addFlag = '机构新增';
};

// 关闭 新增/编辑 before

/*const showEditPageClose = () => {
editPageData.show = false;
};*/

// 新增、添加名址表单的校验规则   根据实际业务填写

// const rules = reactive<FormRules>({});

// 编辑 按钮

const modifyHandler = (row: OrgListParams) => {
  isAddView.value = 'edit';
  useUpmsOrgStore.setEditDataInfo(row);
  isShowEditPageData.value = true;
  useUpmsOrgStore.addFlag = '机构编辑';
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
function queryTable(Data: OrgQueryParams) {
  queryData.value = Data;
  getTableList(queryData.value);
}

/**
 * 列表请求
 * @param params
 */
function getTableList(params: OrgQueryParams) {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  queryOrg(params)
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
@import url('/@/styles/common/admcDefaultStyle.css');
</style>
