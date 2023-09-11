<template>
  <div ref="searchGroup" class="search_group">
    <el-form
      ref="queryFormRef"
      :model="queryForm"
      label-width="7em"
      class="search_form"
      :style="{ height: searchStatus.rowHeight }"
      size="default"
      status-icon
    >
      <el-row class="search_form_row">
        <el-col :span="5">
          <el-form-item label="受捐人" prop="doneeName" class="search-form-item">
            <el-input v-model="queryForm.doneeName" placeholder="请输入受捐人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间" prop="createTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              format="YYYY-MM-DD  HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="defaultcreateTime"
              placeholder="请选择创建时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="申请状态" prop="applyStatus" class="search-form-item">
            <el-select v-model="queryForm.applyStatus" placeholder="请选择申请状态">
              <el-option
                v-for="dict in applyStatusList"
                :key="dict.value"
                :label="dict.name"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="flex flex-row justify-end items-start">
          <el-button type="primary" @click="submitForm(queryFormRef)">查询</el-button>
          <el-button @click="resetForm(queryFormRef)">重置</el-button>
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
      <el-row class="search_form_row">
        <!-- <el-col :span="5">
          <el-form-item label="创建起期" prop="startTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.startTime"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="创建止期" prop="endTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.endTime"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择结束时间"
            />
          </el-form-item>
        </el-col> -->

        <el-col :span="5">
          <el-form-item label="状态" prop="status" class="search-form-item">
            <el-select v-model="queryForm.status" placeholder="请选择状态">
              <el-option
                v-for="dict in statusList"
                :key="dict.value"
                :label="dict.name"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5"></el-col>
        <el-col :span="5"></el-col>
        <el-col :span="5"></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="baseSearch">
  import { onMounted, reactive, ref, defineEmits } from 'vue';
  import { FormInstance, ElMessage } from 'element-plus';
  import { DArrowRight } from '@element-plus/icons-vue';
  import { AddressQueryParams } from '/@/views/upms/model/doneeModel';
  import { queryList } from '/@/views/upms/api/doneeDecla';
  import dayjs from 'dayjs';
  const emit = defineEmits(['isFolder', 'queryTable', 'getTableList']);
  const props = defineProps(['queryData']);
  const queryFormRef = ref<FormInstance>();
  const defaultcreateTime = ref([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ]);
  const queryForm = ref<AddressQueryParams>({
    ...props.queryData,
  });

  /**
   * 有必输校验就加，没有就删除
   */
  // const rules = reactive<FormRules>({
  //   createTime: [{ required: true, message: '请输入创建日期', trigger: 'blur' }],
  // });

  //时间格式转换
  const parseDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
  };
  /* 选择框 */
  type flagPage = {
    name: string;
    value: string;
  };

  const typeList = ref<flagPage[]>([]);
  const applyStatusList = ref<flagPage[]>([]);
  const statusList = ref<flagPage[]>([]);
  const changeGroup = () => {
    queryList('publicType').then((res) => {
      console.log('publicType', res);
      typeList.value = res.data;
    });
    queryList('applyStatus').then((res) => {
      console.log(res);
      res.data.splice(4, 1);
      applyStatusList.value = res.data;
    });
    queryList('status').then((res) => {
      console.log(res);
      statusList.value = res.data;
    });
  };
  /**
   * 查询方法
   * @param formEl
   */
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        queryForm.value.startTime = parseDate(queryForm.value.createTime[0]);
        queryForm.value.endTime = parseDate(queryForm.value.createTime[1]);
        if (queryForm.value.startTime > queryForm.value.endTime) {
          ElMessage({
            message: '开始时间不得大于结束时间',
            type: 'error',
          });
          return false;
        }
        emit('queryTable', queryForm.value);
      } else {
        //校验不通过处理，根据需求补充
        console.log('error submit!', fields);
      }
    });
  };
  /**
   * 重置清空方法
   * @param formEl
   */
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    queryForm.value.startTime = '';
    queryForm.value.endTime = '';
    emit('queryTable', queryForm.value);
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
    emit('isFolder', {
      status: searchStatus.fold,
      height: searchStatus.rowHeight,
    });
  };
</script>

<style scoped>
  @import url('/@/styles/chinapost/admcDefaultStyle.css');
  :deep(.search_form_row) {
    justify-content: flex-start;
  }
</style>
