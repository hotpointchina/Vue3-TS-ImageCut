<!--
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 13:40:02
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-15 14:21:40
 * @FilePath: \gongyi_vue_demo\src\views\upms\pages\tenant\member.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<route lang="yaml">
name: personnel
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">人员管理</h1>
      <div class="button-group px-20px flex" v-if="buttonRights.includes('add')">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
        <el-button type="primary" :icon="Plus" @click="tableAdd2"> 支付测试 </el-button>
      </div>
    </div>

    <!-- 搜索组 -->
    <baseSearch @isFolder="isFolder" @getForm="getForm" />

    <div class="flex flex-col w-full px-20px">
      <div class="table_controll">
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
      </div>

      <!-- table -->
      <div class="base-table">
        <el-table
          ref="multipleTableRef"
          :data="personnelStore.list"
          :maxHeight="tableData.tableHeight"
          :style="{ width: '100%' }"
          stripe
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table ref="multipleTableRef" :data="personnelStore.list" :maxHeight="tableHeightInfo.tableHeight"
                      :style="{ width: '100%' }" stripe @selection-change="handleSelectionChange"> -->
          <el-table-column type="selection" fixed width="55" />
          <el-table-column property="pwoName" label="公益组织" width="150" />
          <el-table-column property="username" label="登陆账号" width="120" />
          <el-table-column property="nickname" label="姓名" width="100" />
          <el-table-column property="role" label="角色" />
          <el-table-column property="mobile" label="手机号" width="150" />
          <el-table-column property="email" label="邮箱" />
          <el-table-column property="idNumber" label="身份证" width="180" />
          <el-table-column fixed="right" label="操作" width="300">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                v-if="buttonRights.includes('query')"
                @click="detailClick(scope.row as object)"
                >查看</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="buttonRights.includes('edit')"
                @click="modifyHandler(scope.row)"
                >编辑</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                v-if="buttonRights.includes('remove')"
                @click="deleteHandler(scope.row)"
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="buttonRights.includes('resetpwd')"
                @click="resetHandler(scope.row)"
                >重置密码</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="buttonRights.includes('roles')"
                @click="roleHandler(scope.row)"
                >分配角色</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div v-if="buttonRights.includes('pages')" class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination
              v-model:currentPage="personnelStore.pageNum"
              v-model:page-size="personnelStore.pageSize"
              :page-sizes="personnelStore.pageSizeList"
              :small="true"
              :disabled="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="personnelStore.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-config-provider>
        </div>
      </div>
    </div>
    <!-- table 查看详情 -->
    <el-dialog
      v-model="tableData.detailShow"
      title="详情"
      width="65%"
      top="15vh"
      :draggable="true"
    >
      <el-descriptions
        class="margin-top"
        :column="3"
        size="default"
        :style="''"
        :border="true"
      >
        <el-descriptions-item
          v-for="des in tableData.descriptions"
          :key="des.prop"
          :label="des.label"
          width="40px"
          label-align="center"
        >
          <template> </template>
          {{ tableData.detailInfo[des.prop as string] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 重置成功对话框 -->
    <el-dialog
      v-model="tableData.ressetSuccessDialog"
      title="密码重置成功"
      width="30%"
      top="30vh"
      :draggable="true"
    >
      <p class="mt-20px mb-20px text-xl font-black">您重置后的密码是{{ successPwd }}</p>
      <el-row class="flex w-full mt-20px justify-end">
        <el-button type="primary" @click="determinePassword">确定</el-button>
      </el-row>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      v-model="tableData.roleDialog"
      title="分配角色"
      width="40%"
      top="15vh"
      :draggable="true"
      @close="closeRoleDialog"
    >
      <el-checkbox-group v-model="checkedRoleList">
        <el-checkbox
          v-for="item in roleList"
          :key="item.value"
          :label="item.label"
          size="large"
          :value="item.value"
          @change="changeRole"
        />
      </el-checkbox-group>

      <!-- <el-select v-model="role.label">
                                  <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.label"
                                      @click="changeRole(item)">
                                  </el-option>
                              </el-select> -->
      <el-row class="flex w-full mt-20px justify-end">
        <el-button @click="roleDelete">取消</el-button>
        <el-button type="primary" @click="submitRole">确定</el-button>
      </el-row>
    </el-dialog>
    <!-- 新增/编辑 -->
    <div class="edit_page" v-if="personnelStore.isShowEditPageData">
      <editPage @submit="submitEditPage" />
    </div>
  </div>
</template>

<script lang="ts" name="personnel" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { ElTable, ElMessage, ElMessageBox, ElLoading } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './search/index.vue';
  import editPage from './edit/index.vue';
  import { usePersonnalStore } from '/@/stores/modules/personnel';
  import { useMenuInfoStore } from '/@/stores/modules/menuInfo';
  import {
    UserSaveParams,
    Userparams,
    editPageSubmitModal,
    detaliParams,
    UserListParams,
    roleParams,
  } from '/@/views/upms/model/basePersonnal';
  import {
    savePersonnal,
    delPersonnal,
    getOnlyPersonnal,
    editPersonnal,
    resetPwd,
    queryRole,
    updateRole,
    tradePagePay,
  } from '/@/views/upms/api/personnal';
  const personnelStore = usePersonnalStore();
  const menuInfoStore = useMenuInfoStore();

  type TableDescriptionType = {
    prop: string;
    label: string;
  };

  interface seachGroupInfoModel {
    status: boolean;
    height: string;
  }

  interface TableDataType {
    // table 的高度
    tableHeight: string;
    // 搜索组的状态
    seachGroupInfo: seachGroupInfoModel;
    // 是否显示详细信息弹窗
    detailShow: boolean;
    // 详细信息的column数据
    descriptions: TableDescriptionType[];
    // 详细信息的数据
    detailInfo: detaliParams;
    // 重置密码弹窗
    resetDialog: boolean;
    // 重置成功弹窗
    ressetSuccessDialog: boolean;
    // 分配角色弹窗
    roleDialog: boolean;
    // 角色列表
    roleList: roleParams[];
  }
  // table 数据
  const tableData: TableDataType = reactive({
    tableHeight: '50vh',
    seachGroupInfo: { status: false, height: '70' },
    detailShow: false,
    descriptions: [
      {
        prop: 'username',
        label: '用户名',
      },
      {
        prop: 'nickname',
        label: '账号',
      },
      {
        prop: 'role',
        label: '角色',
      },
      {
        prop: 'pwoName',
        label: '公益组织',
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
        prop: 'idNumber',
        label: '身份证号',
      },
      {
        prop: 'provinceName',
        label: '省',
      },
      {
        prop: 'cityName',
        label: '市',
      },
      {
        prop: 'countyName',
        label: '县',
      },
    ],
    detailInfo: {
      pwoName: '',
      username: '',
      nickname: '', //账号
      idNumber: '',
      role: '',
      provinceName: '',
      cityName: '',
      countyName: '',
      mobile: '',
      email: '',
      orgName: '',
      roleName: [''],
    },
    resetDialog: false,
    ressetSuccessDialog: false,
    roleDialog: false,
    roleList: [],
  });

  // ==== 添加 table 的高度自适应 begin
  const isFolder = (obj: seachGroupInfoModel = tableData.seachGroupInfo) => {
    let height = {
      // body: document.body.offsetHeight,
      body: '100vh',
      subtract: 64 + 24 + 41 + 36 + 63 + 40 + parseInt(obj.height),
      str: '',
    };
    // height.str = height.body - height.subtract + '';
    height.str = `calc(${height.body} - ${height.subtract}px)`;
    tableData.tableHeight = height.str;
    tableData.seachGroupInfo = { ...obj };
  };
  isFolder();
  window.onresize = () => {
    isFolder();
  };
  // ==== 添加 table 的高度自适应 begin

  // table 的 REF
  const multipleTableRef = ref<InstanceType<typeof ElTable>>();
  // table 复选框已选择的行
  const multipleSelection = ref<UserListParams[]>([]);
  // table 复选框已选择的个数
  const multipleSelectionNumber = ref<number>(0);

  // 函数的类型
  type voidFunction = () => void;
  type handlerFunction<T> = (T) => void;

  // table 复选框 被选取
  const handleSelectionChange: handlerFunction<UserListParams[]> = (
    val: UserListParams[],
  ) => {
    multipleSelection.value = val;
    multipleSelectionNumber.value = val.length;
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
        const idparam = { ids: ids };
        delPersonnal(idparam)
          .then((res) => {
            if (res.status === 200) {
              ElMessage({
                message: '删除成功',
                type: 'success',
              });
            }
            // ElMessage.success('删除成功');
          })
          .finally(() => {
            personnelStore.getList();
          });
      })
      .catch(() => ElMessage.info('已取消删除'));
  };
  // 删除
  const deleteHandler: handlerFunction<UserListParams> = (row: UserListParams) => {
    ElMessageBox.confirm('确认删除这条数据?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        delPersonnal({ ids: [row.id] })
          .then((res) => {
            if (res.status === 200) {
              ElMessage({
                message: '删除成功',
                type: 'success',
              });
            }
          })
          .finally(() => {
            personnelStore.getList();
          });
      })
      .catch(() => ElMessage.info('已取消删除'));
  };
  // 查看详情
  const detailClick: handlerFunction<UserListParams> = (row: UserListParams) => {
    getOnlyPersonnal(row.id).then((res) => {
      if (res.status === 200) {
        tableData.detailShow = true;
        Object.keys(res.data.result).forEach((key) => {
          tableData.detailInfo[key] = res.data.result[key];
        });
        tableData.detailInfo.role = tableData.detailInfo.roleName.join('，');
      }
    });
  };
  // 页码
  // 每页显示量列表点击
  const handleSizeChange: handlerFunction<number> = (val: number) => {
    personnelStore.setPageInfo({
      pageNum: personnelStore.$state.pageNum,
      pageSize: val,
    });
    personnelStore.getList();
  };
  // 点击页码
  const handleCurrentChange: handlerFunction<number> = (val: number) => {
    personnelStore.setPageInfo({ pageNum: val });
    personnelStore.getList();
  };

  // 查询
  function getForm(data: Userparams) {
    const loading = ElLoading.service({
      lock: true,
      text: 'loading...',
      background: 'rgba(255, 255, 255, 0.7)',
    });

    loading.close();
    personnelStore.getList(data);
  }
  const buttonRights = ref<string[]>([]);
  onMounted(async () => {
    personnelStore.$state.list.length === 0 && (await personnelStore.getList());
    buttonRights.value = menuInfoStore.getSingleMenu('/upms/personnel');
  });

  // 新增、添加
  // const isShowEditPageData = ref<boolean>(false);
  // 新增
  const tableAdd = () => {
    personnelStore.readyAdd();
    personnelStore.isShowEditPageData = true;
  };
  const tableAdd2 = () => {
    const bizDataObj = {
      platformCode: 'O',
      taskType: 'INTERFACE_AUTH',
      agentOpParam: {
        redirectUri: 'https://example.com',
        appTypes: ['WEBAPP'],
        isvAppId: '2021000122616517',
      },
    };
    const bizData = encodeURIComponent(JSON.stringify(bizDataObj));
    const link = `https://b.alipay.com/page/message/tasksDetail?bizData=${bizData}`;
    const qrcode = `alipays://platformapi/startapp?appId=2021000122616517&page=pages%2Fauthorize%2Findex%3FbizData%3D${bizData}`;

    console.log(link);
    console.log(qrcode);
    /*tradePagePay().then((res) => {
      console.log(res.data.result);
      document.write(res.data.result);
    });*/
  };
  // 编辑
  const modifyHandler = (obj: UserSaveParams) => {
    personnelStore.$state.pageTitle = '编辑';
    personnelStore.editHandler();
    getOnlyPersonnal(obj.id).then((res) => {
      if (res.status === 200) {
        personnelStore.isShowEditPageData = true;
        Object.keys(personnelStore.$state.editData).forEach((key) => {
          personnelStore.$state.editData[key] = res.data.result[key];
        });
      }
    });
  };

  // 新增/编辑 页的提交
  const submitEditPage = (modal: editPageSubmitModal, data: UserSaveParams) => {
    switch (modal) {
      case 'cancel':
        personnelStore.isShowEditPageData = false;
        return;
      case 'add':
        // 这里调用新增请求
        savePersonnal(data).then((res) => {
          if (res.status === 200) {
            ElMessage({
              message: '新增成功',
              type: 'success',
            });
            personnelStore.isShowEditPageData = false;
            personnelStore.getList();
          }
        });
        break;

      case 'modify':
        // 这里调用编辑请求
        editPersonnal(data).then((res) => {
          if (res.status === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success',
            });
            personnelStore.isShowEditPageData = false;
            personnelStore.getList();
          }
        });
        break;
    }
  };

  //接受需要重置密码的id
  const userId = ref('');
  // 重置后的密码
  const successPwd = ref('');
  //重置密码
  const resetHandler = (obj: UserSaveParams) => {
    successPwd.value = '';
    userId.value = obj.id;
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
  };

  // 提示重置密码按钮
  const determinePassword = () => {
    tableData.ressetSuccessDialog = false;
  };

  const roleList = ref<roleParams[]>([]);
  // 选中的数据
  const checkedRoleList = ref<string[]>([]);
  const checkedRoleId = ref<string[]>([]);
  const pwoId = ref('');
  //点击角色按钮
  const roleHandler = (obj: UserSaveParams) => {
    userId.value = obj.id;
    pwoId.value = obj.pwoId;
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
    //分配角色接口
    updateRole(pwoId.value, userId.value, checkedRoleId.value).then((res) => {
      if (res.status === 200) {
        tableData.roleDialog = false;
        personnelStore.getList();
      }
    });
  };
  // 关闭分配角色对话框
  const closeRoleDialog = () => {
    checkedRoleList.value = [];
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

  .edit_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
    overflow: auto;
  }

  :deep(.el-checkbox-group) {
    margin-top: 20px;
    margin-left: 20px;
  }

  :deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
    width: 16px;
    height: 16px;
  }

  :deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
    font-size: 16px;
  }

  :deep(.el-checkbox__inner::after) {
    width: 6px;
    top: 1px;
    left: 4px;
  }
</style>
