<route lang="yaml">
name: menu-manag
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">菜单管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>
  <!-- 搜索组 -->
  <BaseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
  <div class="flex flex-col w-full px-20px">
    <!-- <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp pl-30px">
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteChoose"
            style="font-size: 14px"
                                                    >批量删除</el-button
                                                  >
                                                </div>
                                              </div> -->
      <!-- table :maxHeight="tableHeight" -->
      <div class="base-table">
        <el-table ref="multipleTableRef" :data="tableData" maxHeight="50vh" :style="{ width: '100%' }" stripe
          @selection-change="handleSelectionChange" row-key="id" @row-click="handleRowClick">
          <el-table-column property="label" label="菜单名称" width="200px" />
          <el-table-column property="typeName" :show-overflow-tooltip="true" label="菜单级别" width="150px">
            <template #default="scope">
              <span v-if="scope.row.type === 'CATALOG'">目录</span>
              <span v-if="scope.row.type === 'MENU'">菜单</span>
              <span v-if="scope.row.type === 'BUTTON'" style="color: #f67e7e">按钮</span>
            <span v-if="scope.row.type === 'EXTLINK'">外链</span>
          </template></el-table-column>
        <el-table-column property="path" :show-overflow-tooltip="true" label="路由路径" width="380" />
        <!-- <el-table-column
            property="permPath"
              :show-overflow-tooltip="true"
              label="权限路径"
              width="320px"
            /> -->
          <el-table-column property="permStr" :show-overflow-tooltip="true" label="权限字符串" width="180" />
          <el-table-column property="visible" :show-overflow-tooltip="true" label="状态" width="100" />
          <!--          <el-table-column-->
          <!--            property="component"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--            label="组件路径"-->
          <!--          />-->
          <!--          <el-table-column-->
          <!--            property="status"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--            label="状态"-->
          <!--          />-->
          <el-table-column property="sort" :show-overflow-tooltip="true" label="排序" />

          <el-table-column fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="addHandler(scope.row)"
              v-if="scope.row.type == 'CATALOG' || scope.row.type == 'MENU'">新增</el-button>
            <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteHandler(scope.row)">删除</el-button>
            <!-- <el-button
                link
                type="primary"
                size="small"
                @click="statusHandler(scope.row)"
                >{{
                  scope.row.status === '停用' || scope.row.status === '未启用'
                                                            ? '启用'
                                                            : '停用'
                                                        }}</el-button
                                                      > -->
            </template>
        </el-table-column>
      </el-table>

      <!-- <div class="py-5 flex justify-end">
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
          </div> -->

        <!-- table 查看详情 -->
        <el-dialog :title="editPageData.title" v-model="editPageData.show" @close="cancel" width="750px"
          :destroy-on-close="true">
          <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="父级菜单" prop="parentId">
              <el-tree-select v-model="formData.parentId" placeholder="选择上级菜单" :data="menuOptions" :prop="defineProp"
                filterable check-strictly :render-after-expand="false" />
            </el-form-item>

            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入菜单名称" />
            </el-form-item>

            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio label="CATALOG">目录</el-radio>
                <el-radio label="MENU">菜单</el-radio>
                <el-radio label="BUTTON">按钮</el-radio>
                <el-radio label="EXTLINK">外链</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="formData.type == 'EXTLINK'" label="外链地址" prop="path">
            <el-input v-model="formData.path" placeholder="请输入外链完整路径" />
          </el-form-item>

          <!-- <el-form-item
              label="路由路径"
              prop="path"
              v-if="formData.type == 'CATALOG' || formData.type == 'MENU'"
            >
              <el-input
                v-if="formData.type == 'CATALOG'"
                v-model="formData.path"
                placeholder="/system  (目录以/开头)"
              />
              <el-input
                v-else
                                                        v-model="formData.path"
                                                        placeholder="/system  (目录以/开头)"
                                                      />
                                                    </el-form-item> -->
            <el-form-item label="路由路径" prop="path" v-if="formData.type == 'CATALOG' || formData.type == 'MENU'">
            <el-input v-model="formData.path" placeholder="/" />
            <!-- <el-input v-else v-model="formData.path" placeholder="user" /> -->
            </el-form-item>
            <!-- <el-form-item>
                <text>注:uiii</text>
              </el-form-item> -->
            <text style="margin-left: 100px; color: red; margin-bottom: 10px" v-if="formData.type == 'BUTTON'">注: GET-查询,
              POST-新增/查询, PUT-修改, DELETE-删除</text>
            <el-form-item prop="path" label="路由路径" class="w-full" v-if="formData.type == 'BUTTON'">
              <el-input v-model="formData.path" placeholder="/">
                <template #prepend>
                  <el-select v-model="formData.method" style="width: 115px">
                    <el-option label="GET" value="GET" />
                    <el-option label="POST" value="POST" />
                    <el-option label="PUT" value="PUT" />
                    <el-option label="DELETE" value="DELETE" />
                  </el-select>
                </template>
            </el-input>
          </el-form-item>
          <!-- 组件页面完整路径 -->
          <!-- <el-form-item
              v-if="formData.type == 'MENU'"
                                                      prop="urlPerm"
              label="组件路径"
                                                      class="w-full"
            > -->
          <!-- <el-input v-model="formData.urlPerm" placeholder="请输入" />
                                                    </el-form-item> -->
            <!-- <el-form-item label="请求方式" prop="perm">
              <el-input v-model="formData.method" placeholder="请输入" />
            </el-form-item> -->
          <!-- 权限标识 -->
          <!-- <el-form-item
              v-if="formData.type == 'BUTTON'"
              label="权限路径"
                                                      prop="permPath"
                                                    >
                                                      <el-input v-model="formData.permPath" placeholder="/" />
                                                    </el-form-item> -->

            <el-form-item label="跳转路由" v-if="formData.type == 'CATEGORY'">
              <el-input v-model="formData.redirect" placeholder="跳转路由" />
            </el-form-item>

            <el-form-item label="状态" v-if="
              formData.type == 'CATALOG' ||
              formData.type == 'MENU' ||
              formData.type == 'BUTTON'
            ">
              <el-radio-group v-model="formData.visible">
                <el-radio label="1">显示</el-radio>
                <el-radio label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="按钮标识" prop="permStr" v-if="formData.type == 'BUTTON'">
              <el-input v-model="formData.permStr" placeholder="sys:user:add" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" style="width: 100px" controls-position="right" :min="0" />
            </el-form-item>
          </el-form>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="menu-manag">
import { ref, reactive, h } from 'vue';
import { ElTable, ElMessage, ElMessageBox, ElForm, ElLoading } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
// import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import BaseSearch from './search/index.vue';
import {
  MenuQueryParams,
  MenuListParams,
  FormMenuType,
} from '/@/views/upms/model/baseMenuManag';
import {
  treeTableMenu,
  getParentTree,
  addTable,
  deleteTable,
  editTable,
  detailTable,
} from '/@/views/upms/api/menu-manag';
// 函数的类型
type handlerFunction<T> = (T) => void;

interface seachGroupInfoModel {
  status: boolean;
  height: string;
}
const defineProp = {
  label: 'label',
  children: 'children',
  value: 'value',
};
// const total = ref(0);
const dataFormRef = ref(ElForm);
const emit = defineEmits(['menuClick']);
const tableData = ref<MenuListParams[]>([]);
let formData = ref<FormMenuType>({
  id: '',
  label: '',
  path: '',
  name: '',
  component: '',
  sort: 0,
  visible: '1',
  redirect: '',
  type: '',
  permPath: '',
  parentId: 0,
  urlPerm: '',
  method: 'GET',
  permStr: '',
});
interface elDrawer {
  show: boolean;
  header?: boolean;
  title: string;
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt';
  size?: number | string;
  modal?: boolean;
  'close-on-click-modal'?: boolean;
  'close-on-press-escape'?: boolean;
}
const editPageData: elDrawer = reactive({
  show: false,
  header: false,
  title: '新增',
  direction: 'rtl',
  size: '30%',
  modal: true,
  'close-on-click-modal': true,
  'close-on-press-escape': true,
});

// table 的 REF

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

// table 复选框已选择的行

const multipleSelection = ref<MenuListParams[]>([]);

// table 复选框已选择的个数

const multipleSelectionNumber = ref<number>(0);

// table 高度

const tableHeight = ref('50vh');
const seachGroupInfo = ref<seachGroupInfoModel>({ status: false, height: '70' });

// 定义查询参数

const queryData = ref<MenuQueryParams>({
  pageNum: 1,
  pageSize: 10,
  name: '',
  type: '',
  visible: '',
  activitiesStartTime: '',
  activitiesEndTime: '',
});

// ==== 添加 table 的高度自适应 begin
const isFolder = (obj: seachGroupInfoModel = seachGroupInfo.value) => {
  let height = {
    body: document.body.offsetHeight,
    subtract: 64 + 24 + 41 + 36 + 63 + 40 + parseInt(obj.height),
    str: '',
  };
  height.str = height.body - height.subtract + '';
  tableHeight.value = height.str;
  seachGroupInfo.value = { ...obj };
};
//   height.str = height.body - height.subtract + '';
//   tableHeight.value = height.str;
//   seachGroupInfo.value = { ...obj };
// };
isFolder();
window.onresize = () => {
  isFolder();
};
// ==== 添加 table 的高度自适应 begin
/**
 * 定义初始化方法进入页面默认查询
 */

/**

     *

     * @param val

     */

// const handleSizeChange = (val: number) => {
//   queryData.value.pageSize = val;
//   getTableList(queryData.value);
// };

/**
 *
 * @param val
 */
// const handleCurrentChange = (val: number) => {
//   queryData.value.pageNum = val;
//   getTableList(queryData.value);
// };

// table 复选框 被选取

const handleSelectionChange = (val: MenuListParams[]) => {
  multipleSelection.value = val;

  multipleSelectionNumber.value = val.length;
};
// 删除
const deleteHandler: handlerFunction<MenuListParams> = (row: MenuListParams) => {
  ElMessageBox.confirm('是否删除该菜单?', '警告', {
    message: h('p', null, [
      row.children.length !== 0
        ? h('p', { style: 'color: red' }, '该菜单存在下级菜单，无法进行该删除操作')
        : h('span', null, '是否删除该菜单?'),
    ]),
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      if (row.children.length == 0) {
        deleteTable(row.id).then(() => {
          ElMessage({
            message: '删除成功',
            type: 'success',
          });
          getTableList(queryData.value);
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

/**

     * 查询方法

     * @param Data

     */

function queryTable(Data: MenuQueryParams) {
  const loading = ElLoading.service({
    lock: true,
    text: 'loading...',
    background: 'rgba(255, 255, 255, 0.7)',
  });

  loading.close();
  queryData.value = Data;
  getTableList(queryData.value);
  // getTableList(queryData.value);
}
/**

     * 列表请求

     * @param params

     */
// const menuOptions = [] ;
const menuOptions: any[] = reactive([]);
function getTableList(val) {
  treeTableMenu(val).then((res) => {
    tableData.value = res;
  });
}
getTableList(queryData.value);
//下拉加载树
async function loadMenuData() {
  const menuOptionsList: any[] = [];
  await getParentTree().then((data) => {
    const menuOption = { value: 0, label: '顶级菜单', children: data };
    menuOptionsList.push(menuOption);
    Object.keys(menuOptionsList).forEach((key) => {
      menuOptions[key] = menuOptionsList[key];
    });
  });
}
// 新增、添加
async function tableAdd() {
  await loadMenuData();
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = key == 'parentId' ? 0 : '';
  });
  editPageData.title = '新增';
  editPageData.show = true;
  formData.value.parentId = 0;
  formData.value.visible = '1';
  formData.value.type = 'CATALOG';
  formData.value.method = 'GET';
}
// 编辑 按钮
async function modifyHandler(row: FormMenuType) {
  await loadMenuData();
  editPageData.title = '编辑';
  const id = row.id as string;
  detailTable(id).then((res) => {
    editPageData.show = true;
    if (res.type == 'CATALOG') {
      res.parentId = 0;
    }
    Object.keys(res).forEach((key) => {
      formData.value[key] = res[key];
      // 后端给的值是数字 需要转成字段串回显
      if (key === 'visible') {
        formData.value.visible = String(res[key]);
      }
      if (res.visible == 1) {
        formData.value.visible = '1';
      } else {
        formData.value.visible = '0';
      }
      // console.log(formData.value.method, ' formData.value.method');
      // console.log(formData.value.path, ' formData.value.path');
    });
    if (res.path.indexOf(':') != -1) {
      formData.value.method = res.path.split(':')[0];
      formData.value.path = res.path.split(':')[1];
    }

    console.log(formData.value.method, ' formData.value.method');
    console.log(formData.value.path, ' formData.value.path');
  });
}
/**
 * 取消关闭弹窗
 */
function cancel() {
  dataFormRef.value.resetFields();
  editPageData.show = false;
}
function submitForm() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      if (formData.value.id) {
        if (formData.value.type != 'CATALOG' && formData.value.type != 'MENU') {
          formData.value.path = formData.value.method + ':' + formData.value.path;
        }
        editTable(formData.value.id, formData.value).then(() => {
          ElMessage.success('修改成功');
          cancel();
          getTableList(queryData.value);
        });
      } else {
        if (formData.value.type != 'CATALOG' && formData.value.type != 'MENU') {
          formData.value.path = formData.value.method + ':' + formData.value.path;
        }
        addTable(formData.value).then(() => {
          ElMessage.success('新增成功');
          cancel();
          getTableList(queryData.value);
        });
      }
    }
  });
}

const currentRow = ref(undefined);
function handleRowClick(row: any) {
  currentRow.value = JSON.parse(JSON.stringify(row));
  emit('menuClick', row);
}
async function addHandler(row: any) {
  await loadMenuData();
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = key == 'parentId' ? 0 : '';
  });
  editPageData.title = '新增';
  editPageData.show = true;
  formData.value.method = 'GET';

  if (row.id) {
    // 行点击新增
    formData.value.parentId = row.id;
  }
  //新增显示
  if (row.type == 'CATALOG') {
    formData.value.type = 'MENU';
  } else if (row.type == 'MENU') {
    formData.value.type = 'BUTTON';
  } else {
    formData.value.type = 'EXTLINK';
  }
}
const rules = {
  parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件完整路径', trigger: 'blur' }],
  method: [{ required: true, message: '请选择', trigger: 'blur' }],
};
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

:deep(.el-dialog__body) {
  padding-top: 0px;
}

.info-title {
  border: 1px solid #ebeef5;
  padding: 8px 11px;
  font-weight: 700;
  color: var(--el-text-color-regular);
  background: #f5f7fa;
}
</style>
