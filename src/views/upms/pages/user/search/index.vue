<template>
  <div ref="searchGroup" class="search_group">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="6em"
      class="
        flash_form
        flex flex-col
        px-20px
        pt-20px
        overflow-hidden
        transition-all
        ease-linear
        duration-300
      "
      :style="{ height: searchStatus.rowHeight }"
      size="default"
      status-icon
    >
      <el-row class="justify-between items-start">
        <el-col :span="5">
          <el-form-item label="姓名" prop="nickname" class="search-form-item">
            <el-input
              v-model="ruleForm.nickname"
              placeholder="请填写姓名"
              @keyup.enter.native="tab"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="角色" prop="roleId" class="search-form-item">
            <el-select
              v-model="ruleForm.role"
              placeholder="请选择"
              clearable
              @clear="clearRole"
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
                @click="changeRole(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5"></el-col>
        <el-col :span="5"></el-col>
        <!-- <el-col :span="5"> -->
        <!-- <el-form-item label="机构名称" prop="orgCode" class="search-form-item"> -->
        <!-- <el-tree-select
            v-model="ruleForm.org"
            placeholder="请选择机构"
            :load="loadNode"
            @node-click="orgTreeClick"
            :props="props"
          /> -->
        <!-- <VersionTag version="2.2.26" /> show lazy load label: -->
        <!-- <el-tree-select
              v-model="ruleForm.orgCode"
              lazy
              :load="loadNode"
              @node-click="orgTreeClick"
              :props="props"
              check-strictly
            />
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="5">
          <el-form-item label="开始时间" prop="startTime" class="search-form-item">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="datetime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="5">
          <el-form-item label="结束时间" prop="endTime" class="search-form-item">
            <el-date-picker
              v-model="ruleForm.endTime"
              type="datetime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col> -->

        <!-- <el-col :span="5">
          <el-form-item label="机构名称" prop="org" class="search-form-item">
            <el-input
              v-model="ruleForm.org"
              placeholder="请选择机构"
              @click="openUp"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="3" class="flex flex-row justify-end items-center">
          <el-button type="primary" @click="submitForm">查询</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>

          <span
            v-show="searchStatus.show"
            class="flex flex-row justify-start items-center ml-8px"
          >
            <el-button type="default" link @click="folder">
              {{ searchStatus.title }}
              <DArrowRight
                ref="DArrowRightEL"
                :style="{
                  width: '1em',
                  height: '1em',
                  marginLeft: '7px',
                  color: '#18AE66',
                  transition: 'all 0.3s ease',
                  transform: searchStatus.iconRotate,
                }"
              />
            </el-button>
          </span>
        </el-col>
      </el-row>
    </el-form>
    <!-- <el-dialog
      v-model="detailShow"
      width="40%"
      top="15vh"
      :draggable="true"
      title="机构"
    >
      <el-form>
        <el-form-item label="机构名称" prop="unitsName">
          <el-input
            v-model="activities"
            placeholder="请输入"
            @keyup.enter.native="tab"
            class="search-form-item"
          />
          <el-button type="primary" class="ml-10" @click="queryfrom">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="base-table">
        <el-table
          ref="multipleTableRef"
          :data="tableData.list"
          :maxHeight="tableData.tableHeight"
          :style="{ width: '100%' }"
          stripe
        >
          <el-table-column type="index" fixed width="80" label="序号" />

          <el-table-column label="机构名称" property="orgName" show-overflow-tooltip />

          <el-table-column fixed="right" label="操作" width="160px">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="chooseClick(scope.row)"
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination
              v-model:currentPage="tableData.pageNum"
              v-model:page-size="tableData.pageSize"
              :page-sizes="tableData.pageSizeList"
              :small="true"
              :disabled="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.listTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-config-provider>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup name="baseSearch">
  import { onMounted, reactive, ref, defineEmits } from 'vue';
  import type { FormInstance } from 'element-plus';
  // import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  // import { ElMessage } from 'element-plus';
  import { DArrowRight } from '@element-plus/icons-vue';
  import { UserManyList } from '/@/views/upms/model/baseUserAdmin';
  // import dayjs from 'dayjs';
  import { roleParams } from '/@/views/upms/model/basePersonnal';
  import { getAllRole } from '/@/views/upms/api/personnal';
  // import { orgDataList } from '/@/views/upms/api/useradmin';
  // import { OrgQueryParams } from '/@/views/upms/model/pbdOrgModel';
  // import { queryOrg } from '/@/views/upms/api/pbdOrg';
  // import { queryChildOrgTree } from '/@/views/upms/api/pbdOrg';
  // import { getAuthStorage } from '/@/utils/storage/auth';
  // import type Node from 'element-plus/es/components/tree/src/model/node';
  // import { number } from 'echarts';
  const emit = defineEmits(['handleQuery', 'isFolder']);
  const ruleFormRef = ref<FormInstance>();
  // const detailShow = ref(false);
  // interface Tree {
  //   id?: string;
  //   orgName: string;
  //   orgCode?: string;
  //   orgLevel?: string;
  //   leaf?: boolean;
  // }
  const ruleForm = ref<UserManyList>({
    nickname: '',
    // orgCode: '',
    // orgName: '',
    pageNum: 1,
    pageSize: 10,
    // startTime: '',
    // endTime: '',
    role: '',
    roleId: '',
  });

  // const props = {
  //   value: 'orgCode',
  //   label: 'orgName',
  // };
  // const orgTreeClick = (node) => {
  //   // ruleForm.value.orgName = node.orgName;
  //   ruleForm.value.orgCode = node.orgCode;
  // };

  // const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  //   if (node.level === 0) {
  //     let dataTree = getAuthStorage();
  //     let orgTree = [{ orgName: dataTree.orgName, orgCode: dataTree.orgCode }];
  //     return resolve(orgTree);
  //   }
  //   if (node.level > 0) {
  //     queryChildOrgTree(node.data.orgCode).then((res) => {
  //       resolve(res);
  //     });
  //   }
  // };
  // const activities = ref('');
  // type TableListType = {
  //   id: string;
  //   orgCode: string;
  //   orgName: string;
  // };
  // interface TableDataType {
  //   // table 的高度
  //   tableHeight: string;
  //   // table 列表数据
  //   list: OrgQueryParams[];
  //   // 列表总数
  //   listTotal: number;
  //   pageNum: number;
  //   pageSize: number;
  //   // 每页显示量选取列表
  //   pageSizeList: number[];
  // }
  // // table 数据
  // const tableData: TableDataType = reactive({
  //   tableHeight: '50vh',
  //   list: [],
  //   listTotal: 0,
  //   pageNum: 1,
  //   pageSize: 10,
  //   pageSizeList: [10, 20, 30, 40, 50, 100],
  // });
  function tab(e) {
    if (e.keyCode === 13) {
      submitForm();
    }
  }
  //打开机构弹窗
  /**
   * 列表请求
   * @param params
   */
  // const openUp = () => {
  //   detailShow.value = true;
  //   ruleForm.value.org = '';
  //   const params: OrgQueryParams = {
  //     pageNum: tableData.pageNum,
  //     pageSize: tableData.pageSize,
  //     provinceName: '',
  //     cityName: '',
  //     countyName: '',
  //     orgCode: '',
  //     orgName: activities.value,
  //     parentOrgName: '',
  //     status: '',
  //   };
  //   queryOrg(params).then((res) => {
  //     tableData.list = res.records;
  //     tableData.listTotal = res.total;
  //   });
  // };

  // table 的 REF
  // const multipleTableRef = ref<InstanceType<typeof ElTable>>();
  // // 函数的类型
  // type handlerFunction<T> = (T) => void;
  // // 点击选择
  // const chooseClick: handlerFunction<TableListType> = (row: TableListType) => {
  //   ruleForm.value.org = row.orgName;
  //   detailShow.value = false;
  //   // units.value = '';
  // };
  // // 页码
  // // 每页显示量列表点击
  // const handleSizeChange: handlerFunction<number> = () => {
  //   openUp();
  // };
  // // 点击页码
  // const handleCurrentChange: handlerFunction<number> = () => {
  //   openUp();
  // };
  // //机构弹窗搜索
  // const queryfrom = () => {
  //   openUp();
  // };
  // 清空角色
  const clearRole = () => {
    ruleForm.value.role = '';
    ruleForm.value.roleId = '';
    submitForm();
  };
  const roleList = ref<roleParams[]>([]);
  // 角色查询
  const getRole = () => {
    getAllRole().then((res) => {
      if (res.status === 200) {
        roleList.value = res.data.result;
      }
    });
  };
  const changeRole = (item) => {
    ruleForm.value.roleId = item.value;
  };
  //搜索
  const submitForm = () => {
    // const endTime = new Date(ruleForm.value.endTime).getTime();
    // const startTime = new Date(ruleForm.value.startTime).getTime();
    //   if (startTime > endTime) {
    //     ElMessage({
    //       message: '开始时间不得大于结束时间',
    //       type: 'error',
    //     });
    //     return false;
    //   }
    console.log(ruleForm.value, ' ruleForm.value');

    emit('handleQuery', ruleForm.value);
  };
  //重置
  const resetForm = (formEl: FormInstance | undefined) => {
    // ruleForm.value.nickname = '';
    ruleForm.value.role = '';
    if (!formEl) return;
    formEl.resetFields();
    // let endDate = dayjs(new Date()).format('YYYY-MM-DD');
    // let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD');
    // ruleForm.value.endTime = endDate;
    // ruleForm.value.startTime = startDate;
    submitForm();
  };

  const searchGroup = ref();
  const searchStatus = reactive({
    fold: true,
    show: false,
    title: '展开',
    rowHeight: '70px',
    iconRotate: 'rotate(90deg)',
  });

  interface formEl {
    wrap: HTMLElement | null;
    row: HTMLElement[] | null;
    rowNumber: number;
    firstRow: number;
    standerHeight: number;
    fullHeight: string;
  }
  const formEl: formEl = {
    wrap: null,
    row: null,
    rowNumber: 1,
    firstRow: 70,
    standerHeight: 50,
    fullHeight: '',
  };
  onMounted(() => {
    getRole();
    // let endDate = dayjs(new Date()).format('YYYY-MM-DD');
    // let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD');
    // ruleForm.value.endTime = endDate;
    // ruleForm.value.startTime = startDate;
    formEl.wrap = searchGroup.value.querySelector('.el-form') as HTMLElement;
    formEl.row = Array.from(searchGroup.value.querySelectorAll('.el-form .el-row'));
    formEl.rowNumber = formEl.row.length;
    formEl.fullHeight =
      (formEl.rowNumber - 1) * formEl.standerHeight + formEl.firstRow + 'px';

    if (formEl.rowNumber > 1) {
      searchStatus.title = '展开';
      searchStatus.fold = true;
      searchStatus.show = true;
    }
    submitForm();
  });

  // 展开 or 收起
  const folder = () => {
    if (searchStatus.fold) {
      searchStatus.fold = false;
      searchStatus.rowHeight = formEl.fullHeight;
      searchStatus.iconRotate = 'rotate(-90deg)';
      searchStatus.title = '折叠';
    } else {
      searchStatus.fold = true;
      searchStatus.rowHeight = '70px';
      searchStatus.iconRotate = 'rotate(90deg)';
      searchStatus.title = '展开';
    }
    emit('isFolder', {
      status: searchStatus.fold,
      height: searchStatus.rowHeight,
    });
  };
</script>

<style scoped>
  .search-form-item:deep(.el-select.el-select--default),
  .search-form-item:deep(.el-input-number.el-input-number--default) {
    width: 100%;
  }
  .search-form-item:deep(.el-form-item__label) {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 90px !important;
    padding: 0 16px 0 6px;
    line-height: 15px;
    justify-content: flex-end;
  }
  .search-form-item:deep(.el-input__prefix) {
    display: none;
  }
  .search-form-item:deep(.el-input__inner) {
    font-size: 9px;
  }
  :deep(.el-form-item__content) {
    display: contents;
  }
</style>
