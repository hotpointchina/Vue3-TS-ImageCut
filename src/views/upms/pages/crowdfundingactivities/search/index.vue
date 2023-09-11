<template>
  <div ref="searchGroup" class="search_group">
    <el-form
      ref="queryFormRef"
      :model="queryForm"
      :rules="rules"
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
      <el-row class="justify-between items-start" :locale="zhCn">
        <el-col :span="5">
          <el-form-item label="项目编号" class="search-form-item">
            <el-input v-model="queryForm.activitiesCode" placeholder="请输入项目编号" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="项目名称" class="search-form-item">
            <!-- <el-input
              v-model="queryForm.activitiesName"
              placeholder="请选择项目名称"
              readonly
              @click="changeName"
            /> -->
            <el-input v-model="queryForm.activitiesName" placeholder="请选择项目名称" />
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="创建起期" prop="startTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.startTime"
              type="datetime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="创建止期" prop="endTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.endTime"
              type="datetime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="flex flex-row justify-end items-start">
          <el-button type="primary" @click="submitForm">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
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
      <el-col :span="5">
        <el-form-item label="活动状态" class="search-form-item" prop="flagStatus">
          <el-select v-model="queryForm.flagStatus" placeholder="请选择">
            <el-option
              v-for="item in flagStatusOptions"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-row class="justify-between items-start"> </el-row>
    </el-form>

    <!-- 项目名称对话框 -->
    <!-- <el-dialog
      v-model="unitDialog"
      width="35%"
      top="15vh"
      :draggable="true"
      title="项目名称选择"
    >
      <div class="base-table">
        <div class="flex">
          <el-input
            class="mr-40px mb-20px"
            placeholder="请按照项目名称搜索"
            v-model="projectName"
          />
          <el-button type="primary" @click="projectSearch">搜索</el-button>
          <el-button type="primary" @click="projectreset">重置</el-button>
        </div>

        <el-table
          ref="multipleTableRef"
          :data="tableData.list"
          :maxHeight="tableData.tableHeight"
          :style="{ width: '100%' }"
          stripe
        >
          <el-table-column type="index" fixed width="80" label="序号" />
          <el-table-column property="activitiesCode" label="项目编码" width="100" />
          <el-table-column property="activitiesName" label="项目名称" width="100" />
          <el-table-column fixed="right" label="操作">
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
  import dayjs from 'dayjs';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import { onMounted, reactive, ref, defineEmits } from 'vue';
  import {
    ElMessage,
    //  ElTable
  } from 'element-plus';
  import type { FormInstance, FormRules } from 'element-plus';

  import { DArrowRight } from '@element-plus/icons-vue';
  import { queryList } from '/@/views/upms/api/dictItem';
  import { CrowdManyList } from '/@/views/upms/model/crowdactivitiesModel';

  const emit = defineEmits(['isFolder', 'queryTable']);

  const queryFormRef = ref<FormInstance>();

  const queryForm: CrowdManyList = reactive({
    activitiesCode: '',
    activitiesName: '',
    startTime: '',
    endTime: '',
    flagStatus: '',
    pageNum: 1,
    pageSize: 10,
  });
  const flagStatusOptions = ref([]);
  const changeGroup = () => {
    queryList('flagStatus').then((res) => {
      flagStatusOptions.value = res.data;
      console.log('flagStatus::  ',res.data)
    });
  };
  /**
   * 有必输校验就加，没有就删除
   */
  const rules = reactive<FormRules>({
    startTime: [
      {
        required: true,
        message: '请输入开始时间',
        trigger: 'blur',
      },
    ],
    endTime: [
      {
        required: true,
        message: '请输入结束时间',
        trigger: 'blur',
      },
    ],
  });

  /**
   * 查询方法
   */
  const submitForm = () => {
    const endTime = new Date(queryForm.endTime).getTime();
    const startTime = new Date(queryForm.startTime).getTime();
    if (startTime > endTime) {
      ElMessage({
        message: '开始时间不得大于结束时间',
        type: 'error',
      });
      return false;
    }
    emit('queryTable', queryForm);
  };
  /**
   * 重置清空方法
   */
  const resetForm = () => {
    Object.keys(queryForm).forEach((key) => {
      if (key !== 'pageNum' && key !== 'pageSize') {
        queryForm[key] = '';
      }
    });
    let endDate = dayjs(new Date()).format('YYYY-MM-DD');
    let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD');
    queryForm.endTime = endDate;
    queryForm.startTime = startDate;
    submitForm();
  };

  /**
   * 不需要改动
   */
  const searchGroup = ref();
  /**
   * 不需要改动
   */
  const searchStatus = reactive({
    fold: true,
    show: false,
    title: '展开',
    rowHeight: '70px',
    iconRotate: 'rotate(90deg)',
  });

  /**
   * dome元素，不需要改动
   */
  interface formEl {
    wrap: HTMLElement | null;
    row: HTMLElement[] | null;
    rowNumber: number;
    firstRow: number;
    standerHeight: number;
    fullHeight: string;
  }

  /**
   * 不需要改动
   */
  const formEl: formEl = {
    wrap: null,
    row: null,
    rowNumber: 1,
    firstRow: 70,
    standerHeight: 50,
    fullHeight: '',
  };

  /**

  * 不需要改动

  */

  onMounted(() => {
    changeGroup();
    let endDate = dayjs(new Date()).format('YYYY-MM-DD');
    let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD');
    queryForm.endTime = endDate;
    queryForm.startTime = startDate;
    // submitForm();
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
  });

  /**

  * 展开 or 收起，不需要改动

  */

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

    emit(
      'isFolder',

      {
        status: searchStatus.fold,

        height: searchStatus.rowHeight,
      },
    );
  };

  // type TableListType = {
  //   id: string;
  //   activitiesCode: string;
  //   activitiesName: string;
  // };
  // interface TableDataType {
  //   // table 的高度
  //   tableHeight: string;
  //   // table 列表数据
  //   list: TableListType[];
  //   // 列表总数
  //   listTotal: number;
  //   pageNum: number;
  //   pageSize: number;
  //   // 每页显示量选取列表
  //   pageSizeList: number[];
  // }
  // table 数据
  // const tableData: TableDataType = reactive({
  //   tableHeight: '50vh',
  //   list: [
  //     {
  //       id: '100',
  //       activitiesCode: '100',
  //       activitiesName: '啊哈哈哈哈',
  //     },
  //   ],
  //   listTotal: 0,
  //   pageNum: 1,
  //   pageSize: 10,
  //   pageSizeList: [10, 20, 30, 40, 50, 100],
  // });
  // table 的 REF
  // const multipleTableRef = ref<InstanceType<typeof ElTable>>();
  // 函数的类型
  // type handlerFunction<T> = (T) => void;
  // 单位表格显示的对话框
  // const unitDialog = ref(false);
  // const projectName = ref('');
  // 获取单位信息
  // const getProject = () => {
  //   const params = {
  //     pageNum: tableData.pageNum,
  //     pageSize: tableData.pageSize,
  //     activitiesName: projectName.value,
  //     endTime: dayjs(new Date()).format('YYYY-MM-DD'),
  //     startTime: dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD'),
  //   };
  //   queryUnit(params).then((res) => {
  //     tableData.list = res.records;
  //     tableData.listTotal = res.total;
  //   });
  // };
  // 点击项目名称
  // const changeName = () => {
  //   unitDialog.value = true;
  //   queryForm.activitiesName = '';
  //   getProject();
  // };

  // 点击选择项目名称
  // const chooseClick: handlerFunction<TableListType> = (row: TableListType) => {
  //   // ElMessageBox.confirm('确认选择已选中的数据项?', '警告', {
  //   //   confirmButtonText: '确定',
  //   //   cancelButtonText: '取消',
  //   //   type: 'warning',
  //   // })
  //   //   .then(() => {
  //   queryForm.activitiesName = row.activitiesName;
  //   unitDialog.value = false;
  //   // })
  //   // .catch(() => ElMessage.info('已取消删除'));
  // };
  // const activitiesName = ref('');
  // 搜索单位
  // const projectSearch = () => {
  //   getProject();
  // };
  // 重置
  // const projectreset = () => {
  //   projectName.value = '';
  //   getProject();
  // };
  // 页码
  // 每页显示量列表点击
  // const handleSizeChange: handlerFunction<number> = (val: number) => {
  //   tableData.pageSize = val;
  //   getProject();
  // };
  // 点击页码
  // const handleCurrentChange: handlerFunction<number> = (val: number) => {
  //   tableData.pageNum = val;
  //   getProject();
  // };
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

    width: 106px !important;

    padding: 0 16px 0 6px;

    line-height: 15px;

    justify-content: flex-end;
  }

  .search-form-item:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
    width: 100%;
  }
</style>
