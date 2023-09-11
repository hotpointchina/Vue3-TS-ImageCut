<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">组织管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="add"> 新增 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <organSearch :queryData="queryData" @searchValue="searchTable" />

    <div class="flex flex-col w-full px-20px">
      <!-- table -->
      <div class="base-table">
        <el-table ref="multipleTableRef" :data="table" :style="{ width: '100%' }" stripe maxHeight="50vh"
          >
          <el-table-column property="pwoCode" :show-overflow-tooltip="true" label="公益组织编号" width="120" />
          <el-table-column property="pwoName" :show-overflow-tooltip="true" label="公益组织名称" width="120" />
          <el-table-column property="recordCode" :show-overflow-tooltip="true" label="备案编号" />
          <el-table-column property="provinceName" :show-overflow-tooltip="true" label="省" width="120" />
          <el-table-column property="cityName" :show-overflow-tooltip="true" label="市" width="120" />
          <el-table-column property="countyName" :show-overflow-tooltip="true" label="县" width="120" />
          <el-table-column property="addr" :show-overflow-tooltip="true" label="详细地址" width="180" />
          <el-table-column property="head" :show-overflow-tooltip="true" label="负责人" />
          <el-table-column property="phoneNumber" :show-overflow-tooltip="true" label="联系方式" />
          <el-table-column fixed="right" label="操作" width="220">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="look(scope.row)">详情</el-button>
              <el-button link type="primary" size="small" @click="power(scope.row)">授权</el-button>
              <el-button link type="primary" size="small" @click="update(scope.row)">编辑</el-button>
              <!-- <el-button link type="primary" size="small" @click="stop(scope.row)">停用</el-button> -->
              <el-button link type="primary" size="small" style="color: red;" @click="Delete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination v-model:currentPage="queryData.pageNum" v-model:page-size="queryData.pageSize"
              :page-sizes="[10, 20, 50, 100]" :small="true" :disabled="false"
              layout="total,sizes,prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </el-config-provider>
        </div>
        <!-- 详情 -->
        <el-dialog v-model="detailShow" title="详情" width="60%" top="15vh" :draggable="true">
          <el-descriptions class="margin-top" :column="2" :size="'default'" :border="true">
            <el-descriptions-item label="公益组织编号" width="150px" label-align="left" align="center">
              {{ detailInfo.pwoCode }}
            </el-descriptions-item>
            <el-descriptions-item label="公益组织名称" label-align="left" align="center">
              {{ detailInfo.pwoName }}
            </el-descriptions-item>
            <el-descriptions-item label="公益组织备案编号" label-align="left" align="center">
              {{ detailInfo.recordCode }}
            </el-descriptions-item>
            <el-descriptions-item label="省" width="150px" label-align="left" align="center">
              {{ detailInfo.provinceName }}
            </el-descriptions-item>
            <el-descriptions-item label="市" label-align="left" align="center">
              {{ detailInfo.cityName }}
            </el-descriptions-item>
            <el-descriptions-item label="区/县" label-align="left" align="center">
              {{ detailInfo.countyName }}
            </el-descriptions-item>
            <el-descriptions-item label="地址" label-align="left" align="center">
              {{ detailInfo.addr }}
            </el-descriptions-item>
            <el-descriptions-item label="邮编" label-align="left" align="center">
              {{ detailInfo.postalCode }}
            </el-descriptions-item>
            <el-descriptions-item label="负责人" label-align="left" align="center">
              {{ detailInfo.head }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话" label-align="left" align="center">
              {{ detailInfo.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="公益简介" label-align="left" align="center" width="220px">
              {{ detailInfo.pwoIntroduce }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
        <!-- 授权
        <el-dialog v-model="detailPower" title="选择权限" width="50%" top="15vh" :draggable="true">
          <div style="height: 400px; overflow: auto">
            <el-tree class="gy_tree menuTree" :data="data" :props="defaultProps" show-checkbox node-key="value"
              :default-checked-keys="checkedMenu" :check-on-click-node="true" ref="treeRef" />
          </div>
          <el-row class="flex justify-center w-full mt-20px">
            <el-button @click="menuDialogClose">取消</el-button>
            <el-button type="primary" @click="submitFromMenu">提交</el-button>
          </el-row>
        </el-dialog> -->
        <!-- 授权角色 -->
        <el-dialog v-model="detailPower" title="选择角色" width="40%" top="15vh" :draggable="true">
          <el-checkbox-group v-model="checkedRoleList">
            <el-checkbox v-for="item in roleList" :key="item.value" :label="item.label" size="large" :value="item.value"
              @change="changeRole" />
          </el-checkbox-group>
          <el-row class="flex w-full mt-20px justify-end">
            <el-button @click="menuDialogClose">取消</el-button>
            <el-button type="primary" @click="submitFromMenu">确定</el-button>
          </el-row>
        </el-dialog>
      </div>
      <!-- 新增/编辑页面加载 -->
      <div class="edit_page" v-if="detailAdd">
        <organAdd @isClose="cancel4" />
      </div>
      <div class="edit_page" v-if="detailEdit">
        <organEdit :editData="editData" @isClose="cancel5" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="user">
import { ref, onMounted } from 'vue';
import { ElTable } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import organSearch from './organSearch.vue';
import organAdd from './add.vue';
import organEdit from './edit.vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
// 实体
import { tableData, Search } from './organ';
// api
import {
  getOrgan,
  deleteOrganCheck,
  getrangeOrgan,
  getSearch,
  rangeOrgan
} from '/@/views/upms/api/charityorgan';
// 定义查询参数
const queryData = ref<Search>({
  pageNum: 1,
  pageSize: 10,
  pwoName: '',
  cityName: '',
  countyName: '',
  provinceName: '',
  pwoCode: '',
  cityCode: '',
  countyCode: '',
  provinceCode: '',
});
interface roleParams {
  value: string;
  label: string;
}
// /**table数据实体*/
const table = ref<tableData[]>([]);
//详情实体
const detailInfo = ref<tableData>({});
// 编辑实体
const editData = ref<tableData>({});
//分页
const total = ref(0);
// 详情
const detailShow = ref(false);
// 新增
const detailAdd = ref(false);
// 编辑
const detailEdit = ref(false);
// 授权
const detailPower = ref(false);
// 多选
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// table 复选框已选择的个数
const multipleSelectionNumber = ref<number>(0);


/**
 * 定义初始化方法进入页面默认查询
 */
onMounted(() => {
  getTableList(queryData.value);
})
/**
 *控制页面显示条数
 *
 */
const handleSizeChange = (val: number) => {
  queryData.value.pageSize = val;
  getTableList(queryData.value);
};
/**
 *
 * 控制页面页数
 */
const handleCurrentChange = (val: number) => {
  queryData.value.pageNum = val;
  getTableList(queryData.value);
};
/**
 *查看详情
 *
 */
function look(row: tableData) {
  detailInfo.value = row;
  detailShow.value = true;
};
/**
 *删除
 *
 */
function Delete(row: tableData) {
  detailInfo.value = row;
  DeleteBox()
};
/**
 *新增
 *
 */
function add() {
  detailAdd.value = true;
};
/**
 *编辑
 *
 */
function update(row: tableData) {
  detailEdit.value = true;
  editData.value = row
  getTableList(queryData.value);
};
/**
 *取消新增
 *
 */
function cancel4() {
  detailAdd.value = false;
  getTableList(queryData.value);
}
/**
 *取消编辑
 *
 */
function cancel5() {
  detailEdit.value = false;
  getTableList(queryData.value);
}

/**
 * 查询方法
 * @param
 */
function searchTable(Data: Search) {
  const loading = ElLoading.service({
    lock: true,
    text: 'loading...',
    background: 'rgba(255, 255, 255, 0.7)',
  });
  getSearch(Data).then((res) => {
    table.value = res.records
    total.value = res.total
    for (var i = 0; i < table.value.length; i++) {
      table.value[i].index = i + 1
    }
  }).finally(() => { loading.close(); });

}
/**
 * 列表请求
 * @param params
 */
function getTableList(val) {
  const loading = ElLoading.service({
    lock: true,
    text: 'loading...',
    background: 'rgba(255, 255, 255, 0.7)',
  });
  getOrgan(val).then((res) => {
    total.value = res.total
    for (var i = 0; i < res.records.length; i++) {
      res.records[i].index = i + 1
    }
    table.value = res.records
  }).finally(() => { loading.close(); });
}
/**
 *删除
 *
 */
function DeleteBox() {
  ElMessageBox.confirm(
    '确认删除该公益组织?',
    '提示',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      type: 'warning',
    }
  )
    .then(() => {
      deleteOrganCheck(detailInfo.value.id).then(
        () => {
          ElMessage({
            type: 'success',
            message: '已删除',
          });
          getTableList(queryData.value);
        }
      )
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
};
/**
 * 授权角色
 */
const organID = ref('')
// 角色集合
const roleList = ref<roleParams[]>([]);
// 已勾选角色
const checkedRoleList = ref<string[]>([]);
// 单角色值
const checkedRoleId = ref<string[]>([]);
// 角色选中函数
const changeRole = () => {
  checkedRoleId.value = [];
  roleList.value.forEach((obj) => {
    checkedRoleList.value.forEach((item) => {
      if (item === obj.label) {
        checkedRoleId.value.push(obj.value);
      }
    });
  });
};
/**获取授权范围 */
const power = (row: tableData) => {
  // 获取所有菜单权限
  organID.value = row.id as string
  getrangeOrgan(row.id).then(res => {
    console.log(res)
    // if (res.status === 200) {
      detailPower.value = true
      roleList.value = res.checkBox;
      checkedRoleList.value = [];
      checkedRoleId.value = res.checked;
      // id对应label值
      roleList.value.forEach((obj) => {
        checkedRoleId.value.forEach((item) => {
          if (item === obj.value) {
            checkedRoleList.value.push(obj.label);
          }
        });
      });
    }
  // }
  )
}
// 关闭 权限对话框
const menuDialogClose = () => {
  detailPower.value = false
  // 每次关闭权限对话框时 将之前的内容清空
  checkedRoleList.value = []
}
// 提交
const submitFromMenu = () => {
  rangeOrgan(organID.value, checkedRoleId.value).then((res) => {
    // if (res.status === 200) {
      console.log(res)
      detailPower.value = false
      getTableList(queryData.value)
      menuDialogClose()
    }
  // }
  )
}
// // 权限对话框
// const treeRef = ref<InstanceType<typeof ElTree>>();
// // 权限树类型
// interface Tree {
//   value?: number,
//   label: string,
//   hotarea?: boolean, // 热区
//   children?: Tree[],
//   type: string,
// }
// // 被选角色类型
// interface Role {
//   id: string;
//   name: string
// }
// // 菜单所有权限
// const data = ref<Tree[]>([])
// // 选中的权限
// const checkedMenu = ref<TreeKey[]>([])
// // 被选中的角色
// const checkedRoleToMenu: Role = reactive({
//   id: '',
//   name: ''
// })
// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }
// 点击权限按钮
// const power = (row: tableData) => {
//   detailPower.value = true
//   // 每次点击权限按钮时 将之前的内容清空
//   checkedMenu.value = []
//   checkedRoleToMenu.id = row.id!
//   // 获取所有菜单权限
//   getrangeOrgan(row.id).then(res => {
//     console.log(res)
//     data.value = res
//     // 角色获取的权限
//     getrangeOrganOk(row.id).then(data => {
//       // 勾选回显
//       const checkedMenuIds = data;
//       checkedMenuIds.forEach((menuId) =>
//         treeRef.value!.setChecked(menuId, true, false)
//       );
//     })
//   })
// }
// // 关闭 权限对话框
// const menuDialogClose = () => {
//   detailPower.value = false
//   // 每次关闭权限对话框时 将之前的内容清空
//   checkedMenu.value = []
// }
// // 提交
// const submitFromMenu = () => {
//   // 这里调添加或者修改权限的接口 将选中和半选中的值的id传过去
//   const checkedValue = ref<TreeKey[]>([])
//   checkedValue.value = [...(treeRef.value!.getCheckedKeys()), ...(treeRef.value!.getHalfCheckedKeys())]
//   rangeOrgan(checkedRoleToMenu.id, checkedValue.value).then(() => {
//     ElMessage({
//       message: '权限分配成功',
//       type: 'success',
//     })
//   })
//   menuDialogClose()
// }
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
