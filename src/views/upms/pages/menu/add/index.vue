<template>
  <div class="dept-all">
    <div class="dept-left" :class="deptLeftCol" ref="LeftTree">
      <BasicTree :expandedKeys="[nodeData]" :treeTitle="treeTitle" :data="treeData" ref="menuTree" :props="props"
        @nodeClick="nodeClick" :accordion="true" :checkedKeys="treeData" />
    </div>
    <div class="dept-right" :class="deptRightExp">
      <el-card shadow="never">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="dept_title">
              <el-icon>
                <Fold v-if="deptLeftCol === ''" @click="colse" />
                <Expand v-if="deptLeftCol !== ''" @click="expand" />
              </el-icon>
              {{ title }}
            </div>
            <div>
              <el-button type="primary" @click="tableAdd">+新建菜单</el-button>
            </div>
          </div>
        </template>
        <div>
          <el-form ref="ruleFormRef" :model="ruleForm" label-width="6em" class="
                flash_form
                flex flex-col
                pt-20px
                overflow-hidden
                transition-all
                ease-linear
                duration-300
              " size="default" status-icon>
            <el-row class="items-start">
              <el-col :span="5">
                <el-form-item v-if="nodeType === 'CATALOG' || nodeType === ''" label="菜单名称" prop="id"
                  class="search-form-item">
                  <el-input placeholder="输入名称" v-model="MenuData.detailInfo.name" @keyup.enter.native="seachEnter" />
                </el-form-item>
                <el-form-item v-if="nodeType === 'MENU'" label="权限名称" prop="id" class="search-form-item">
                  <el-input placeholder="输入名称" v-model="tableData.detailInfo.name" @keyup.enter.native="seachEnter" />
                </el-form-item>
              </el-col>
              <el-col :span="5" />
              <el-col :span="5" />
              <el-col :span="5" />
              <el-col :span="4" class="flex flex-row justify-end items-start">
                <el-button type="primary" @click="handleQuery">查询</el-button>
                <el-button @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          </el-form>

          <!-- 一级的新增和删除按钮 -->
          <div class="table_controll" v-show="selectCatalog">
            <span>已选择 {{ multipleSelectionNumber }} 项</span>
            <div class="button_grounp pl-30px">
              <!-- <el-button link type="danger" size="small" @click="tabledelete" style="font-size: 14px">删除</el-button> -->
            </div>
          </div>

          <!-- 二级的新增和删除按钮 -->
          <div class="table_controll" v-show="selectMenu">
            <span>已选择 {{ multipleSelectionNumber }} 项</span>
            <div class="button_grounp pl-30px">
              <!-- <el-button
                link
                type="danger"
                size="small"
                @click="deleteChoose"
                style="font-size: 14px"
                >删除</el-button
              > -->
              <el-button link type="success" size="small" @click="addDialog(ruleFormRef)"
                style="font-size: 14px; margin-left: 4px">
                新增</el-button>
            </div>
          </div>

          <!-- 一级菜单的表格 -->
          <div class="" v-show="typeCatalog">
            <div class="base-table">
              <el-table ref="multipleTableRef" :data="MenuData.list" stripe @selection-change="handleSelectionChange"
                :height="data.tableHeight">
                <el-table-column type="index" fixed width="100" label="序号" />
                <el-table-column property="typeName" label="菜单类型" width="150">
                  <template #default="scope">
                    <span v-if="scope.row.type === 'CATALOG'">目录</span>
                    <span v-if="scope.row.type === 'MENU'">菜单</span>
                    <span v-if="scope.row.type === 'BUTTON'">按钮</span>
                    <span v-if="scope.row.type === 'EXTLINK'">外链</span>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="菜单名称" width="150" />
                <el-table-column property="visible" label="状态" width="180" />
                <!-- <el-table-column v-if="nodeType.value === 'MENU'" property="component" label="组件" width="180" />
                <el-table-column property="path" label="路由路径" width="180" /> -->
                <el-table-column property="isCache" label="是否缓存" width="180" /> -->
                <el-table-column property="sort" label="排序" width="120" />
                <!-- <el-table-column property="redirect" label="跳转路径" width="180" /> -->
                <el-table-column fixed="right" label="操作">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="detailClick(scope.row as object)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="py-5 flex justify-end">
                <el-config-provider>
                  <el-pagination v-model:currentPage="MenuData.pageNum" v-model:page-size="MenuData.pageSize"
                    :page-sizes="MenuData.pageSizeList" :small="true" :disabled="false"
                    layout="total, sizes, prev, pager, next, jumper" :total="MenuData.listTotal"
                    @size-change="handleSizeChangeMenu" @current-change="handleCurrentChangeMenu" />
                </el-config-provider>
              </div>
            </div>
          </div>

          <!-- 二级菜单权限表格 -->
          <div class="" v-show="typeMenu">
            <div class="base-table">
              <el-table ref="multipleTableRef" :data="tableData.list" stripe @selection-change="handleSelectionChange"
                :height="data.tableHeight">
                <el-table-column type="index" fixed width="100" label="序号" />
                <el-table-column property="name" label="名称" width="230" />
                <el-table-column property="visible" label="状态" width="230" />
                <el-table-column property="typeName" label="类型" width="230" />
                <el-table-column v-if="typeBtn == '1'" property="component" label="组件" width="180" />
                <el-table-column v-if="typeBtn == '1'" property="path" label="路由路径" width="180" />
                <el-table-column v-if="typeBtn !== '1'" property="urlPerm" label="路由路径" width="180" />
                <el-table-column v-if="typeBtn == '1'" property="isCache" label="是否缓存" width="180" />
                <el-table-column v-if="typeBtn !== '1'" property="isCache" label="是否隐藏" width="180" />
                <el-table-column v-if="typeBtn !== '1'" property="method" label="请求方式" width="180" />
                <el-table-column v-if="typeBtn !== '1'" property="btnPerm" label="权限字符串" width="230" />
                <el-table-column fixed="right" label="操作">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
                    <el-button v-if="typeBtn == '1'" link type="primary" size="small"
                      @click="detailClick(scope.row as object)">删除
                    </el-button>
                    <el-button v-show="typeBtn !== '1'" link type="primary" size="small"
                      @click="detailThree(scope.row as object)">删除三级
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="py-5 flex justify-end">
                <el-config-provider>
                  <el-pagination v-model:currentPage="tableData.pageNum" v-model:page-size="tableData.pageSize"
                    :page-sizes="tableData.pageSizeList" :small="true" :disabled="false"
                    layout="total, sizes, prev, pager, next, jumper" :total="tableData.listTotal"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-config-provider>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { BasicTree } from '/@/components/sys/BasicTree';
import { ref, reactive, onMounted, h } from 'vue';
import { ElForm, ElTable, FormInstance, ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import {
  getTreeMenu,
  getMenuForm,
  deleteMenuForm,
  getBtnForm,
  deleteBtnForm,
} from '/@/views/upms/api/menu-manag';
const router = useRouter();

// 定义新增或修改类型
const type = ref('add');
// 一级新增或删除是否显示
const selectCatalog = ref(true);
// 二级新增或删除是否显示
const selectMenu = ref(false);
// 一级菜单是否显示
const typeCatalog = ref(true);
// 二级菜单是否显示
const typeMenu = ref(false);
//三级菜单删除按钮是否显示
const typeBtn = ref('1');

// 标题
const title = ref('');
// table 的 REF
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// table 复选框已选择的行
const multipleSelection = ref<TableListType[]>([]);
// table 复选框已选择的个数
const multipleSelectionNumber = ref<number>(0);
// 编辑权限选中的某行数据id
const menuformId = ref('');
// 编辑菜单选中的某行数据id
// const ID = ref('');
const data = ref({
  // 表格高度
  tableHeight: window.innerHeight - 360,
});
// 菜单树ref值
const menuTree = ref<InstanceType<typeof BasicTree>>();
// 获取菜单树
let treeData = ref([]);
// 菜单树名称
let treeTitle = ref('菜单列表');
// 菜单选中的某行数据id和标题
let nodeData = ref('');
let nodeType = ref('');
const props = {
  label: 'name',
  children: 'children',
};

// 获取所有菜单
const getMenu = () => {
  getTreeMenu().then((res) => {
    console.log(res);
    treeData.value = res;
  });
};
getMenu();

// 函数的类型
// type voidFunction = () => void;
type handlerFunction<T> = (T) => void;
// 菜单列表
type MenuListType = {
  id: string;
  label: string;
  path: string; //路由路径
  name: string; //菜单名称
  component: string; //组件路径
  icon?: string;
  meta?: string;
  sort: string; //排序
  redirect: string; //跳转路径
  type: string; //菜单类型
  visible: number; //状态
  parentId: null;
  typeName?: string;
};
// 菜单表格及分页
interface MenuDataType {
  // table 列表数据
  list: MenuListType[];
  // 列表总数
  listTotal: number;
  // 当前页码
  pageNum: number;
  // 每页显示量
  pageSize: number;
  // 每页显示量选取列表
  pageSizeList: number[];
  // 详细信息的数据
  detailInfo: MenuListType;
}
// 菜单表格及分页
const MenuData: MenuDataType = reactive({
  list: [],
  // 总数据条数
  listTotal: 0,
  pageNum: 1,
  pageSize: 10,
  pageSizeList: [5, 10, 15],
  detailInfo: {
    id: '',
    label: '',
    path: '',
    name: '',
    component: '',
    icon: '',
    meta: '',
    sort: '',
    redirect: '',
    type: '',
    visible: 0, //状态
    parentId: null,
    typeName: '',
  },
});
// 权限 table列表
type TableListType = {
  id: string;
  name: string;
  isCache: string; //是否缓存
  method: string; //请求
  btnPerm: string; //字符串
  // urlPerm: string;
  typeName: string;
  type: string;
};
// 权限 表格及分页
interface TableDataType {
  // table 列表数据
  list: TableListType[];
  // 列表总数
  listTotal: number;
  // 当前页码
  pageNum: number;
  // 每页显示量
  pageSize: number;
  // 每页显示量选取列表
  pageSizeList: number[];
  // 详细信息的数据
  detailInfo: TableListType;
}
// 权限 table及分页数据
const tableData: TableDataType = reactive({
  list: [],
  // 总数据条数
  listTotal: 0,
  pageNum: 1,
  pageSize: 10,
  pageSizeList: [5, 10, 15],
  detailInfo: {
    id: '',
    name: '',
    isCache: '', //是否缓存
    method: '', //请求
    btnPerm: '', //字符串
    urlPerm: '',
    typeName: '',
    type: '',
  },
});
// ============= 二级菜单权限
// 新增/编辑 页面
const ruleFormRef = ref<FormInstance>();
// 表单的数据格式
type FormListType = {
  menuId: string;
  name: string;
  requestPath: string;
  btnPerm: string;
  id?: string;
};
// 新增/编辑 表单
let ruleForm: FormListType = reactive({
  name: '',
  btnPerm: '',
  menuId: '',
  requestPath: '',
  id: '',
});

// 点击新增权限按钮
const addDialog: handlerFunction<TableListType> = (
  formEl: FormInstance | undefined,
) => {
  // 判读点击的是否是二级菜单 如果是二级菜单才打开对话框
  if (nodeType.value === 'MENU') {
    type.value = 'add';
    // dialogFormVisible.value = true;
    if (!formEl) return;
    formEl.resetFields();
  } else {
    ElMessage.error('请选择二级菜单后再进行添加');
  }
};
// table 复选框 被选取
const handleSelectionChange: handlerFunction<TableListType[]> = (
  val: TableListType[],
) => {
  multipleSelection.value = val;
  multipleSelectionNumber.value = val.length;
};

// 编辑权限
const modifyHandler = (row: TableListType) => {
  router.push({
    path: '/upms/menu/addmenu',
    query: {
      type: 'edit',
      name: title.value,
      nodeType: nodeType.value,
      nodeData: nodeData.value,
      id: row.id,
    },
  });
};

// 点击 菜单
async function nodeClick(data) {
  nodeData.value = data.id;
  nodeType.value = data.type;
  title.value = data.name;
  if (nodeType.value === 'CATALOG') {
    selectMenu.value = true;
    typeMenu.value = true;
    selectCatalog.value = false;
    typeCatalog.value = false;
    typeBtn.value = '1';
    getData();
  } else if (nodeType.value === 'MENU') {
    typeBtn.value = '2';
    getThreeMenuData();
  }
}
// 获取二级菜单权限数据
function getData() {
  const params = {
    pageNum: tableData.pageNum,
    pageSize: tableData.pageSize,
    id: nodeData.value,
    keywords: MenuData.detailInfo.name,
  };
  getMenuForm(params).then((res) => {
    tableData.list = res.records;
    tableData.listTotal = res.total;
  });
}

// =============一级菜单和二级菜单
// 获取一级菜单数据
function getFirMenuData() {
  const params = {
    pageNum: MenuData.pageNum,
    pageSize: MenuData.pageSize,
    id: 0,
    keywords: MenuData.detailInfo.name,
  };
  getMenuForm(params).then((res) => {
    MenuData.list = res.records;
    MenuData.listTotal = res.total;
  });
}
getFirMenuData();
//根据二级菜单id获取三级菜单数据
function getThreeMenuData() {
  const params = {
    pageNum: tableData.pageNum,
    pageSize: tableData.pageSize,
    parentId: nodeData.value,
    keywords: tableData.detailInfo.name,
  };
  getBtnForm(params).then((res) => {
    tableData.list = res.records;
    tableData.listTotal = res.total;
  });
}

// 单个删除权限
const detailClick: handlerFunction<TableListType> = (row) => {
  menuformId.value = row.id;
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    message: h('p', null, [
      row.size !== 0
        ? h('p', { style: 'color: red' }, '该菜单存在下级菜单，无法进行该删除操作')
        : h('span', null, '是否删除该菜单?'),
    ]),
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      if (row.size == 0) {
        deleteMenuForm(menuformId.value).then(() => {
          ElMessage({
            message: '删除成功',
            type: 'success',
          });
          getData();
          getMenu();
        });
      } else {
        ElMessage({
          message: '该菜单存在下级菜单，无法进行该删除操作',
          type: 'error',
        });
      }
    })
    .catch(() => ElMessage.info('已取消删除'));
};

// 三级批量删除权限
const detailThree = (row) => {
  let template: String[] = [];
  template.push(row.id);
  const idArray = { ids: template };
  // 将获取到的id数据改正，字符串格式
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      console.log(idArray);

      deleteBtnForm(idArray).then(() => {
        ElMessage.success('删除成功');
        //  重新渲染表格
        getThreeMenuData();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
};
// 新增、添加菜单
const tableAdd = () => {
  router.push({
    path: '/upms/menu/addmenu',
    query: {
      type: 'add',
      name: title.value,
      nodeType: nodeType.value,
      nodeData: nodeData.value,
    },
  });
  return;
};
// 查询一级菜单或二级菜单
const handleQuery = () => {
  if (nodeType.value === '') {
    getFirMenuData();
    console.log(nodeType.value);
  } else if (nodeType.value === 'CATALOG') {
    getData();
  } else if (nodeType.value === 'MENU') {
    getThreeMenuData();
  }
};
// 回车搜索
function seachEnter(e) {
  if (e.keyCode === 13) {
    handleQuery();
  }
}
// 重置
function resetQuery() {
  if (nodeType.value === '') {
    MenuData.detailInfo.name = '';
    getFirMenuData();
  } else if (nodeType.value === 'CATALOG') {
    MenuData.detailInfo.name = '';
    // getSedMenuData();
    getData();
  } else if (nodeType.value === 'MENU') {
    tableData.detailInfo.name = '';
    getThreeMenuData();
  }
}

// 页码=============
// 权限每页显示量列表点击
const handleSizeChange: handlerFunction<number> = () => {
  getData();
};
// 权限点击页码
const handleCurrentChange: handlerFunction<number> = () => {
  getData();
};
// 菜单每页显示量列表点击
const handleSizeChangeMenu: handlerFunction<number> = () => {
  getFirMenuData();
};
// 菜单点击页码
const handleCurrentChangeMenu: handlerFunction<number> = () => {
  getFirMenuData();
};

// 点击图标收起或展开左侧树
let deptLeftCol = ref('');
let deptRightExp = ref('');
// 点击关闭
const colse = () => {
  deptLeftCol.value = 'dept-left-col';
  deptRightExp.value = 'dept-right-exp';
};
// 点击展开
const expand = () => {
  deptLeftCol.value = '';
  deptRightExp.value = '';
};

// 虚拟化表格
onMounted(() => {
  window.onresize = () => {
    data.value.tableHeight = window.innerHeight - 360;
  };
});
</script>
<style scoped>
.dept-all {
  display: flex;
  background: #f0f0f0;
  height: calc(100vh - 84px);
}

.dept-left {
  width: 280px;
  min-width: 280px;
  margin: 5px;
  background: white;
}

.dept-left-col {
  min-width: 0px;
  width: 0;
  display: none;
}

.dept-right {
  width: calc(100% - 295px);
  margin: 5px;
  background: white;
}

.dept-right-exp {
  width: 100%;
}

.el-card :deep(.el-card__header) {
  padding: 5px 10px;
}

.el-card {
  border: none;
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

.dept_title {
  padding: 11px 17px;
}

.base-table {
  width: 100%;
}

.el-table :deep(el-table__header-wrappe) {
  background-color: #f1f7f7;
}

.gy_dialog_bottom_line {
  position: relative;
  text-align: left;
}

.gy_dialog_bottom_line::after {
  content: ' ';
  display: block;
  float: none;
  position: absolute;
  left: -20px;
  bottom: -10px;
  width: calc(100% + 56px);
  height: 1px;
  background-color: #e8e8e8;
}
</style>
