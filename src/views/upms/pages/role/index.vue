<route lang="yaml">
name: role
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">角色管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="flex flex-col w-full px-20px">
      <div class="base-table">
        <el-table ref="multipleTableRef" :data="tableData" maxHeight="50vh" :style="{ width: '100%' }" stripe
          @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" fixed width="55" /> -->
          <el-table-column type="index" width="60" label="序号" center />
          <el-table-column property="name" label="角色名称" width="200" :show-overflow-tooltip="true" />
          <!-- <el-table-column property="pwoName" label="所属组织" width="200" /> -->
          <!-- <el-table-column property="code" :show-overflow-tooltip="true" label="角色编码" width="150" /> -->
          <el-table-column property="createTime" label="创建时间" width="300" show-overflow-tooltip />
          <el-table-column property="updateTime" label="修改时间" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
              <el-button link type="primary" size="small" @click="menuHandler(scope.row)">权限</el-button>
              <el-button link type="danger" size="small" @click="deleteHandler(scope.row)">删除</el-button>
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

        <!-- table 编辑/添加 -->
        <el-dialog v-model="addRoleShow" width="40%" top="15vh" :draggable="true" :title="dialogTitle"
          @close="closeDialog(ruleFormRef)">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="84px"
            class="gy-form flex flex-col flex-wrap justify-center item-start w-full" size="default" status-icon>
          <el-form-item prop="name" label="角色名称" class="w-full">
            <el-input v-model="ruleForm.name" placeholder="请输入角色名称" clearable />
            </el-form-item>
          <!-- <el-form-item label="角色编码" prop="code" class="w-full">
                                    <el-input v-model="ruleForm.code" placeholder="请输入角色编码" />
                                </el-form-item> -->
          <!-- <el-form-item prop="pwoId" label="所属组织" class="w-full">
                            <el-select v-model="ruleForm.pwoName" placeholder="请选择公益组织" :disabled="dialogTitle == '编辑'"
                                clearable>
                                                              <el-option v-for="item in pwoList" :key="item.value" :label="item.label" :value="item.value"
                                                                  @click.native="changePwo(item)" />
                                                          </el-select>
                                                      </el-form-item> -->
          </el-form>
          <el-row class="flex justify-center w-full mt-40px">
            <el-button @click="showEditPageClose">取消</el-button>
            <el-button type="primary" @click="submitFromRole(ruleFormRef)">提交</el-button>
            <!-- <el-button type="primary" @click="testTableAdd(ruleFormRef)">[测试] 提交</el-button> -->
          </el-row>
        </el-dialog>

        <!-- 权限对话框  -->
        <div v-if="menuDialogShow">
          <el-dialog v-model="menuDialogShow" width="40%" top="15vh" :draggable="true" title="选择菜单权限">
            <el-tree class="gy_tree menuTree" :data="data" :props="defaultProps" show-checkbox node-key="value"
              :default-checked-keys="checkedMenu" :check-on-click-node="true" ref="treeRef" :default-expand-all="false" />
            <el-row class="flex justify-center w-full mt-20px">
              <el-button @click="menuDialogClose">取消</el-button>
              <el-button type="primary" @click="submitFromMenu">提交</el-button>
            </el-row>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ItemType">
import { ref, reactive } from 'vue';
import {
  ElTable,
  ElMessage,
  ElMessageBox,
  FormRules,
  FormInstance,
  ElTree,
  ElLoading,
} from 'element-plus';
import type { TreeKey } from 'element-plus/es/components/tree/src/tree.type';
import { Plus } from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import baseSearch from './itemSearch.vue';
import {
  roleQueryParams,
  roleListParams,
  formType,
} from '/@/views/upms/model/roleModel';
import {
  queryRoles,
  editRole,
  saveRoles,
  delRole,
  //  queryOrganize,
  getOnlyRole,
  getjurisdiction,
  getRoleMenuIds,
  updateRoleMenus,
} from '/@/views/upms/api/role';
// import { testSaveRoles } from '/@/api/sys/index';
// 函数的类型
type handlerFunction<T> = (T) => void;
interface seachGroupInfoModel {
  status: boolean;
  height: string;
}

const total = ref(0);

const tableData = ref<roleListParams[]>([]);
// 用来代替status的数据
// table 的 REF

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

// table 复选框已选择的行

const multipleSelection = ref<roleListParams[]>([]);

// table 复选框已选择的个数

const multipleSelectionNumber = ref<number>(0);

// table 高度

const tableHeight = ref('50vh');
const seachGroupInfo = ref<seachGroupInfoModel>({ status: false, height: '70' });

// 定义查询参数

const queryData = ref<roleQueryParams>({
  pageNum: 1,
  pageSize: 10,
  name: '',
  pwoName: '',
  pwoId: '',
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
isFolder();
window.onresize = () => {
  isFolder();
};
// ==== 添加 table 的高度自适应 begin
/**
 * 定义初始化方法进入页面默认查询
 */
/**

* 条件查询传递数据

* @param Data

*/

function queryTable(Data: roleQueryParams) {
  const loading = ElLoading.service({
    lock: true,
    text: 'loading...',
    background: 'rgba(255, 255, 255, 0.7)',
  });

  loading.close();
  let sendData: any = { ...Data };
  // 后端不需要的内容删除
  delete sendData.pwoName;
  queryData.value = sendData;
  getTableList(queryData.value);
  // 将占用的空间释放
  sendData = null;
}

/**

* 列表请求

* @param params

*/

function getTableList(params: roleQueryParams) {
  queryRoles(params).then((res) => {
    tableData.value = res.records;
    total.value = res.total;
  });
}
const handleSizeChange = (val: number) => {
  queryData.value.pageSize = val;
  getTableList(queryData.value);
};

const handleCurrentChange = (val: number) => {
  queryData.value.pageNum = val;
  getTableList(queryData.value);
};

// table 复选框 被选取

const handleSelectionChange = (val: roleListParams[]) => {
  multipleSelection.value = val;

  multipleSelectionNumber.value = val.length;
};

// 删除

const deleteHandler: handlerFunction<roleListParams> = (row: roleListParams) => {
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delRole(row.id).then((res) => {
        if (res.status === 200) {
          getTableList(queryData.value);
        }
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
};

// 所属组织数据
// const pwoList = ref<pwoListType[]>([]);
// 获取公益组织
// const getPwo = () => {
//     // 查询公益组织
//     queryOrganize().then(res => {
//         pwoList.value = res
//     })
// }
// 选择公益组织 选择对应id
// const changePwo = (item) => {
//     ruleForm.pwoName = item.label,
//         ruleForm.pwoId = item.value
// }

// 新增/编辑
const ruleFormRef = ref<FormInstance>();
// 新增/编辑 对话框
const addRoleShow = ref(false);
// 新增/编辑 标题
const dialogTitle = ref('');
// 新增/编辑 表单
const ruleForm: formType = reactive({
  name: '',
  pwoName: '',
  pwoId: '',
  code: '',
});
// 角色编码非中文
// const isNum = (rule, value, callback) => {
//     console.log(rule)
//     const reg = new RegExp('^[\u4E00-\u9FFF]+$');
//     if (reg.test(value)) {
//         callback(new Error('角色编码不能为中文'))
//     } else {
//         callback()
//     }
// }
// 角色名称不能为数字
const noNum = (rule, value, callback) => {
  console.log(rule);
  const num = /^[0-9]*$/;
  const exp = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;
  if (num.test(value)) {
    callback(new Error('角色名称不能为纯数字'));
  } else if (exp.test(value)) {
    callback(new Error('不能包含特殊字符'));
  } else {
    callback();
  }
};
// 新增、添加名址表单的校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { validator: noNum, trigger: 'blur' },
  ],
  // code: [
  //     {
  //         required: true,
  //         message: '请输入角色编码',
  //         trigger: 'blur',
  //     },
  //     { validator: isNum, trigger: 'blur' }
  // ],
  // pwoId: [
  //     {
  //         required: true,
  //         message: '请选择公益组织',
  //         trigger: 'change',
  //     },
  // ]
});

// 编辑按钮点击
const modifyHandler = (row: formType) => {
  ruleForm.id = row.id;
  getOnlyRole(row.id!)
    .then((res) => {
      Object.keys(ruleForm).forEach((key) => {
        ruleForm[key] = res[key];
      });
    })
    .finally(() => {
      dialogTitle.value = '编辑';
      addRoleShow.value = true;
    });
};

// 新增按钮点击
const tableAdd = () => {
  Object.keys(ruleForm).forEach((key) => {
    ruleForm[key] = '';
  });
  addRoleShow.value = true;
  dialogTitle.value = '添加';
  // 移除校验结果
  setTimeout(() => {
    ruleFormRef.value!.clearValidate();
  }, 0);
};
// 取消按钮点击 新增/编辑
const showEditPageClose = () => {
  addRoleShow.value = false;
};
// 关闭弹窗的事件
const closeDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 提交 新增/编辑 表单
const submitFromRole = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 表单校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '添加') {
        saveRoles(ruleForm).then((res) => {
          if (res.status === 200) {
            ElMessage({
              message: '新增成功',
              type: 'success',
            });
            showEditPageClose();
            getTableList(queryData.value);
          }
        });
      } else {
        // 编辑请求
        editRole(ruleForm).then((res) => {
          if (res.status === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success',
            });
            showEditPageClose();
            getTableList(queryData.value);
          }
        });
      }
    } else {
      console.log('error submitFrom!', fields);
    }
  });
};

// 【测试】提交 新增/编辑 表单
// const testTableAdd = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   // 表单校验
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       if (dialogTitle.value === '添加') {
//         testSaveRoles(ruleForm)
//           .then(() => {
//             ElMessage({
//               message: '新增成功',
//               type: 'success',
//             });
//           })
//           .finally(() => {
//             getTableList(queryData.value);
//           });
//       } else {
//         editRole(ruleForm)
//           .then(() => {
//             ElMessage({
//               message: '修改成功',
//               type: 'success',
//             });
//           })
//           .finally(() => {
//             getTableList(queryData.value);
//           });
//       }
//       showEditPageClose();
//     } else {
//       console.log('error submitFrom!', fields);
//     }
//   });
// };

// 权限对话框
const menuDialogShow = ref(false);
const treeRef = ref<InstanceType<typeof ElTree>>();
// 权限树类型
interface Tree {
  value?: number;
  label: string;
  hotarea?: boolean; // 热区
  children?: Tree[];
  type: string;
}
// 被选角色类型
interface Role {
  id: string;
  name: string;
}
// 菜单所有权限
const data = ref<Tree[]>([]);
// 选中的权限
const checkedMenu = ref<TreeKey[]>([]);
// 被选中的角色
const checkedRoleToMenu: Role = reactive({
  id: '',
  name: '',
});
const defaultProps = {
  children: 'children',
  label: 'label',
};
// 点击权限按钮
const menuHandler = (row: formType) => {
  menuDialogShow.value = true;
  // 每次点击权限按钮时 将之前的内容清空
  checkedMenu.value = [];
  checkedRoleToMenu.id = row.id!;
  // 获取所有菜单权限
  getjurisdiction().then((res) => {
    data.value = res;
    // 角色获取的权限
    getRoleMenuIds(row.id).then((data) => {
      // 勾选回显
      const checkedMenuIds = data;
      checkedMenuIds.forEach((menuId) =>
        treeRef.value!.setChecked(menuId, true, false),
      );
    });
  });
};
// 关闭 权限对话框
const menuDialogClose = () => {
  menuDialogShow.value = false;
  // 每次关闭权限对话框时 将之前的内容清空
  checkedMenu.value = [];
};
// 提交
const submitFromMenu = () => {
  // 这里调添加或者修改权限的接口 将选中和半选中的值的id传过去
  const checkedValue = ref<TreeKey[]>([]);
  checkedValue.value = [
    ...treeRef.value!.getCheckedKeys(),
    ...treeRef.value!.getHalfCheckedKeys(),
  ];
  updateRoleMenus(checkedRoleToMenu.id, checkedValue.value).then(() => {
    ElMessage({
      message: '权限分配成功',
      type: 'success',
    });
  });
  menuDialogClose();
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

/* :deep(.el-dialog .el-input) {
    width: 60%;
}

:deep(.el-select-dropdown__wrap) {
    width: 60%;
} */

:deep(.el-tree) {
  height: 50vh;
  overflow-y: scroll;
}

:deep(.el-tree)::-webkit-scrollbar {
  display: none;
}

.info-title {
  border: 1px solid #ebeef5;
  padding: 8px 11px;
  font-weight: 700;
  color: var(--el-text-color-regular);
  background: #f5f7fa;
}
</style>
