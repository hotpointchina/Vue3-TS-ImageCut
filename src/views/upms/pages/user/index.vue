<!--
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 13:40:02
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-15 14:21:40
 * @FilePath: \gongyi_vue_demo\src\views\upms\pages\tenant\member.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<route lang="yaml">
name: useradmin
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">用户管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>

    <!-- 搜索组 -->
    <baseSearch @isFolder="isFolder" @senderMany="senderMany" @handleQuery="handleQuery" />

    <div class="flex flex-col w-full px-20px">
      <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp pl-30px">
          <el-button link type="danger" size="small" @click="deleteChoose" style="font-size: 14px">删除</el-button>
        </div>
      </div>

      <!-- table -->
      <div class="base-table">
        <el-table ref="multipleTableRef" :data="userStore.list" :maxHeight="tableData.tableHeight"
          :style="{ width: '100%' }" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed width="55" />
          <el-table-column property="nickname" label="姓名" width="130" />
          <el-table-column property="username" label="登陆账号" width="130" />
          <el-table-column property="role" label="角色" width="130" />
          <el-table-column property="orgName" label="机构名称" width="200" />
          <el-table-column property="orgCode" label="机构号" width="120" />
          <el-table-column property="status" label="状态" width="120">
            <template #default="scope">
              {{ scope.row.status === 0 ? '停用' : '启用' }}
            </template>
          </el-table-column>
          <el-table-column property="mobile" label="手机号" width="170" show-overflow-tooltip />
          <el-table-column property="email" label="邮箱" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="280">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="resetPassword(scope.row)">重置密码</el-button>
              <el-button link type="primary" size="small" @click="detailClick(scope.row as object)">查看</el-button>
              <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
              <el-button link type="primary" size="small" @click="roleHandler(scope.row)">分配角色</el-button>
              <el-button link type="primary" size="small" @click="statusHandler(scope.row)">{{ scope.row.status === 0 ?
                '启用' : '停用' }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination v-model:currentPage="tableData.pageNum" v-model:page-size="tableData.pageSize"
              :page-sizes="tableData.pageSizeList" :small="true" :disabled="false"
              layout="total, sizes, prev, pager, next, jumper" :total="userStore.total" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </el-config-provider>
        </div>
        <PassWord :dialogFormVisible="dialogFormVisible" @clickHangdle="resetPassword"
          v-model:dialogFormVisibl="dialogFormVisible" />
      </div>
      <!-- table 查看详情 -->
      <el-dialog v-model="tableData.detailShow" title="详情" width="60%" top="15vh" :draggable="true">
        <el-descriptions class="margin-top" :column="3" :size="'default'" :style="''" :border="true">
          <el-descriptions-item v-for="des in tableData.descriptions" :key="des.prop" :label="des.label">
            <template v-if="des.prop == 'status'">
              <el-tag class="ml-2" :type="tableData.detailInfo[des.prop as string] == '启用' ? 'success' : 'danger'">{{
                tableData.detailInfo[des.prop as string] }}</el-tag>
            </template>
            <template v-else>
              {{ tableData.detailInfo[des.prop as string] }}
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
      <!-- 重置成功对话框 -->
      <el-dialog v-model="tableData.ressetSuccessDialog" title="密码重置成功" width="30%" top="30vh" :draggable="true">
        <p class="mt-20px mb-20px text-xl font-black">您重置后的密码是{{ successPwd }}</p>
        <el-row class="flex w-full mt-20px justify-end">
          <el-button type="primary" @click="determinePassword">确定</el-button>
        </el-row>
      </el-dialog>
      <el-dialog v-model="tableData.roleDialog" title="分配角色" width="40%" top="15vh" :draggable="true"
        @close="closeRoleDialog">
        <el-checkbox-group v-model="checkedRoleList">
          <el-checkbox v-for="item in roleList" :key="item.value" :label="item.label" size="large" :value="item.value"
            @change="changeRole" />
        </el-checkbox-group>
        <div v-if="roleList.length == 0" style="color: darkgray">暂无可分配的角色</div>
        <el-row class="flex w-full mt-20px justify-end">
          <el-button @click="roleDelete">取消</el-button>
          <el-button type="primary" @click="submitRole">确定</el-button>
        </el-row>
      </el-dialog>
      <div class="edit_page" v-if="userStore.isShowEditPageData">
        <editPage @submit="submitEditPage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="useradmin">
import { reactive, ref, onMounted } from 'vue';
import { ElTable, ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Plus, Close } from '@element-plus/icons-vue';
import PassWord from './changePasswd/index.vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
// import dayjs from 'dayjs';
import baseSearch from './search/index.vue';
import {
  delUser,
  detailUser,
  editStatus,
  updateRole,
} from '/@/views/upms/api/useradmin';
import editPage from './newAddpro/index.vue';
import { useUserAdminStore } from '/@/stores/modules/userModul';
import {
  UserManyList,
  editPageSubmitModal,
  UserSaveParams,
} from '/@/views/upms/model/baseUserAdmin';
import { resetPwd } from '/@/views/upms/api/personnal';
import { ItemListParams } from '/@/views/upms/model/dictItemModel';
import { queryRole } from '/@/views/upms/api/personnal';
import { roleParams } from '/@/views/upms/model/basePersonnal';
import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
export default {
  name: 'zmockTest',
  components: {
    baseSearch,
    PassWord,
    editPage,
  },
  setup() {
    const userStore = useUserAdminStore();
    // const isShowEditPageData = ref<boolean>(false);
    // table
    type TableListType = {
      id: string; //id
      username: string; //用户名
      nickname: string; //登录名称
      orgCode: string; //机构ID
      orgName: string; //机构名称
      roleName: string[]; //角色
      mobile: string; //手机号
      email: string; //邮箱
      role?: string;
      status?: string; //状态
    };
    type TableDescriptionType = {
      prop: string;
      label: string;
    };

    interface seachGroupInfoModel {
      status: boolean;
      height: string;
    }
    interface autoTableHeightInfoModel {
      tableHeight: string;
      // 搜索组的状态
      seachGroupInfo: seachGroupInfoModel;
    }
    interface TableDataType {
      // table 的高度
      tableHeight: string;
      // 搜索组的状态
      seachGroupInfo: seachGroupInfoModel;
      autoTableHeightInfo: autoTableHeightInfoModel;
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
      // 是否显示详细信息弹窗
      detailShow: boolean;
      // 详细信息的column数据
      descriptions: TableDescriptionType[];
      // 详细信息的数据
      detailInfo: TableListType;
      ressetSuccessDialog: boolean;
      roleDialog: boolean;
    }

    // table 数据
    const tableData: TableDataType = reactive({
      tableHeight: '50vh',
      seachGroupInfo: { status: false, height: '70' },
      autoTableHeightInfo: {
        tableHeight: '50vh',
        seachGroupInfo: { status: false, height: '70' },
      },
      list: [],
      listTotal: 0,
      pageNum: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 30, 40, 50, 100],
      detailShow: false,
      ressetSuccessDialog: false,
      roleDialog: false,
      descriptions: [
        {
          prop: 'username',
          label: '登录账号',
        },
        {
          prop: 'nickname',
          label: '用户名',
        },
        {
          prop: 'orgCode',
          label: '机构号',
        },
        {
          prop: 'orgName',
          label: '机构名称',
        },
        {
          prop: 'mobile',
          label: '手机号',
        },
        {
          prop: 'email',
          label: '邮箱',
        },
        {
          prop: 'role',
          label: '角色',
        },
      ],
      detailInfo: {
        id: '', //id
        username: '', //用户名
        nickname: '', //登录名称
        orgCode: '', //机构ID
        orgName: '', //机构名称
        role: '',
        roleName: [''], //角色
        mobile: '', //手机号
        email: '', //邮箱
      },
    });
    // tableData.listTotal = tableData.list.length;

    // table 的 REF
    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    // ==== 添加 table 的高度自适应 begin
    const isFolder = (
      obj: seachGroupInfoModel = tableData.autoTableHeightInfo.seachGroupInfo,
    ) => {
      isFolderHelper(obj, tableData.autoTableHeightInfo);
    };
    isFolderHelper(
      tableData.autoTableHeightInfo.seachGroupInfo,
      tableData.autoTableHeightInfo,
    );
    window.onresize = () => {
      isFolderHelper(
        tableData.autoTableHeightInfo.seachGroupInfo,
        tableData.autoTableHeightInfo,
      );
    };
    // ==== 添加 table 的高度自适应 begin

    // table 复选框已选择的行
    const multipleSelection = ref<TableListType[]>([]);
    // table 复选框已选择的个数
    const multipleSelectionNumber = ref<number>(0);

    // 函数的类型
    type voidFunction = () => void;
    type handlerFunction<T> = (T) => void;

    // table 复选框 被选取
    const handleSelectionChange: handlerFunction<TableListType[]> = (
      val: TableListType[],
    ) => {
      multipleSelection.value = val;
      multipleSelectionNumber.value = val.length;
      console.log(val, 'val');
    };

    // 批量删除
    const deleteChoose: voidFunction = () => {
      const ids: string[] = [];
      multipleSelection.value.forEach((item) => {
        ids.push(item.id);
      });
      ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (multipleSelection.value!.length < 1) {
            ElMessage({
              message: '请选中需要删除的',
              type: 'warning',
            });
          } else {
            const idparam = { ids: ids };
            delUser(idparam).then(() => {
              ElMessage.success('删除成功');
              userStore.getList();
            });
          }
        })
        .catch(() => ElMessage.info('已取消删除'));
    };
    // 新增/编辑 页的提交
    const submitEditPage = (modal: editPageSubmitModal) => {
      console.log(' submitEditPage modal -> ', modal);
      switch (modal) {
        case 'cancel':
          userStore.isShowEditPageData = false;
          return;

        case 'add':
          // zmockStore.addHandler(data);
          userStore.getList();
          break;

        case 'modify':
          // zmockStore.saveEdited(data);
          userStore.getList();
          break;
      }
      // console.log(' 新增/编辑 页的提交', zmockStore.$state.list);

      // 如果需要在此请求列表，开放下一行的注释
      // zmockStore.getList();
      userStore.isShowEditPageData = false;
    };

    // 查看详情
    const detailClick: handlerFunction<TableListType> = (row: TableListType) => {
      detailUser(row.id!).then((res) => {
        tableData.detailShow = true;
        Object.keys(res).forEach((key) => {
          tableData.detailInfo[key] = res[key];
        });
        tableData.detailInfo.role = tableData.detailInfo.roleName.join('，');
      });
      //  = row;
    };

    // 页码
    // 每页显示量列表点击
    const handleSizeChange: handlerFunction<number> = (val: number) => {
      userStore.setPageInfo({
        pageNum: userStore.$state.pageNum,
        pageSize: val,
      });
      userStore.getList();
    };
    // 点击页码
    const handleCurrentChange: handlerFunction<number> = (val: number) => {
      userStore.setPageInfo({ pageNum: val });
      userStore.getList();
    };
    // 新增、添加
    const tableAdd = () => {
      userStore.isShowEditPageData = true;
      userStore.readyAdd();
    };
    // 停用==========
    const statusHandler: handlerFunction<ItemListParams> = (row) => {
      const status = ref();
      const statusTitle = ref('');
      if (row.status == 1) {
        status.value = 0;
        statusTitle.value = '停用';
      } else if (row.status == 0) {
        status.value = 1;
        statusTitle.value = '启用';
      }
      ElMessageBox.confirm(`是否${statusTitle.value}该用户?`, '警告', {
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
          // productStatus(row.id, { status: status.value })
          //   .then(() => {
          //     queryTable(queryData.value);
          //   })
          editStatus(row.id, status.value)
            .then(() => {
              userStore.getList();
              if (status.value == 1) {
                ElMessage.success('该用户已启用');
              } else {
                ElMessage.success('该用户已停用');
              }
            })
            .finally(() => {
              loading.close();
            });
        })
        .catch(() => ElMessage.info(`已取消${statusTitle.value}`));
      // editStatus(row.id, status.value).then(() => {
      //   userStore.getList();
      //   if (status.value == 1) {
      //     ElMessage.success('该数据已启用');
      //   } else {
      //     ElMessage.success('该数据已停用');
      //   }
      // });
    };

    //接受需要重置密码的id
    const userId = ref('');
    // 重置后的密码
    const successPwd = ref('');
    const determinePassword = () => {
      tableData.ressetSuccessDialog = false;
    };
    //重置密码
    const dialogFormVisible = ref(false);
    function resetPassword(row) {
      console.log(row, 'pass');

      // dialogFormVisible.value = true;
      userId.value = row.id;
      ElMessageBox.confirm('确认重置密码?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          resetPwd(userId.value).then((res) => {
            if (res.status === 200) {
              tableData.ressetSuccessDialog = true;
              successPwd.value = res.data.result.success;
            }
          });
        })
        .catch(() => ElMessage.info('已取消重置密码'));
    }

    // 编辑 按钮
    const modifyHandler = (obj) => {
      userStore.isShowEditPageData = true;
      userStore.editHandler(obj);
    };

    // 批量操作
    const functionHandler = () => {
      console.log('批量操作');
    };
    function senderMany(Data: Object) {
      console.log(Data);
    }
    // 查询
    function handleQuery(data: UserManyList) {
      userStore.getList(data);
    }
    const roleList = ref<roleParams[]>([]);
    // 选中的数据
    const checkedRoleList = ref<string[]>([]);
    const checkedRoleId = ref<string[]>([]);
    const pwoIdrole = ref('');
    //点击角色按钮
    const roleHandler = (obj: UserSaveParams) => {
      userId.value = obj.id;
      pwoIdrole.value = obj.pwoId as string;
      // 调所有角色接口
      queryRole(obj.pwoId, userId.value).then((res) => {
        console.log(res);
        if (res.status === 200) {
          roleList.value = res.data.result.checkBox;
          tableData.roleDialog = true;
          checkedRoleId.value = res.data.result.checked;
          // 这里将选中的数据id 对应label
          roleList.value.forEach((obj) => {
            checkedRoleId.value.forEach((item) => {
              if (item === obj.value) {
                checkedRoleList.value.push(obj.label);
              }
            });
          });
        }
      });
    };
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
    // 取消分配
    const roleDelete = () => {
      tableData.roleDialog = false;
      checkedRoleList.value = [];
    };
    // 确定分配
    const submitRole = () => {
      // console.log('pwoIdrole.value', pwoIdrole.value);
      // console.log('userId.value', userId.value);
      // console.log('checkedRoleId.value', checkedRoleId.value.length);
      // if (checkedRoleId.value.length > 0) {
      updateRole(pwoIdrole.value, userId.value, checkedRoleId.value).then((res) => {
        if (res.status === 200) {
          tableData.roleDialog = false;
          userStore.getList();
        }
      });
      // } else {
      //   ElMessage.info('请选择要分配的角色');
      // }
      //分配角色接口
    };
    // 关闭分配角色对话框
    const closeRoleDialog = () => {
      checkedRoleList.value = [];
    };
    onMounted(async () => {
      // userStore.getList();
      // handleQuery();
      userStore.$state.list.length === 0 && (await userStore.getList());
    });
    return {
      zhCn,
      Plus,
      Close,
      senderMany,
      // table
      multipleTableRef,
      tableData,
      multipleSelectionNumber, // table 复选框已选择的个数
      handleSelectionChange, // table 复选框 被选取
      deleteChoose, // 批量删除
      detailClick, // 查看详情
      handleSizeChange, // 每页显示量列表点击
      handleCurrentChange, // 点击页码
      isFolder, // 是否折叠了 查询组
      // 新增/编辑 页面
      resetPassword, //重置密码
      tableAdd, // 新增、添加
      modifyHandler, // 编辑 按钮
      functionHandler, // 批量操作
      dialogFormVisible, //密码弹出框
      handleQuery,
      userStore,
      submitEditPage,
      userId,
      successPwd,
      determinePassword,
      statusHandler,
      //分配角色
      roleHandler,
      changeRole,
      roleDelete,
      submitRole,
      closeRoleDialog,
      checkedRoleList,
      roleList,
      status,
    };
  },
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

.edit_page {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  width: 100%;
  height: calc(100vh - 60px);
  background: white none;
  overflow-y: auto;
}
</style>
