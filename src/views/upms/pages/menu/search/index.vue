<template>
  <div ref="searchGroup" class="search_group">
    <el-form ref="queryFormRef" :model="queryForm" :rules="rules" label-width="6em" class="
          flash_form
          flex flex-col
          px-20px
          pt-20px
          overflow-hidden
          transition-all
          ease-linear
          duration-300
        " :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
      <el-row class="justify-between items-start" :locale="zhCn">
        <!-- <el-col :span="5">
          <el-form-item
            label="开始时间"
            prop="activitiesStartTime"
            class="search-form-item"
          >
            <el-date-picker
              v-model="queryForm.activitiesStartTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="结束时间"
            prop="activitiesEndTime"
            class="search-form-item"
          >
            <el-date-picker
              v-model="queryForm.activitiesEndTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="5">
          <el-form-item label="菜单名称" class="search-form-item">
            <el-input v-model="queryForm.name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="菜单级别" class="search-form-item">
            <el-select v-model="queryForm.type" placeholder="请输入菜单级别">
              <el-option label="菜单" value="1" />
              <el-option label="目录" value="2" />
              <el-option label="外链" value="3" />
              <el-option label="按钮" value="4" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="菜单状态" class="search-form-item">
            <el-select v-model="queryForm.visible" placeholder="请选择">
              <el-option label="隐藏" value="0" />
              <el-option label="显示" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5"></el-col>
        <el-col :span="4" class="flex flex-row justify-end items-start">
          <el-button type="primary" @click="submitForm">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
          <span v-show="searchStatus.show" class="flex flex-row justify-start items-center ml-8px">
            <el-button type="default" link @click="folder">
              {{ searchStatus.title }}
              <DArrowRight ref="DArrowRightEL" :style="{
                width: '1em',
                height: '1em',
                marginLeft: '7px',
                color: '#18AE66',
                transition: 'all 0.3s ease',
                transform: searchStatus.iconRotate,
              }" />
            </el-button>
          </span>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="baseSearch">
import dayjs from 'dayjs';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { onMounted, reactive, ref, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

import { DArrowRight } from '@element-plus/icons-vue';

import { MenuQueryParams } from '/@/views/upms/model/baseMenuManag';
// import { queryActivitys } from '/@/views/upms/api/';

const emit = defineEmits(['isFolder', 'queryTable']);

const props = defineProps(['queryData']);

const queryFormRef = ref<FormInstance>();

const queryForm = ref<MenuQueryParams>({
  ...props.queryData,
});

/**
 * 有必输校验就加，没有就删除
 */
const rules = reactive<FormRules>({
  activitiesStartTime: [
    {
      required: true,
      message: '请输入开始时间',
      trigger: 'blur',
    },
  ],
  activitiesEndTime: [
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
  const activitiesEndTime = new Date(queryForm.value.activitiesEndTime).getTime();
  const activitiesStartTime = new Date(queryForm.value.activitiesStartTime).getTime();
  if (activitiesStartTime > activitiesEndTime) {
    ElMessage({
      message: '开始时间不得大于结束时间',
      type: 'error',
    });
    return false;
  }
  emit('queryTable', queryForm.value);
};
/**
 * 重置清空方法
 */
const resetForm = () => {
  Object.keys(queryForm.value).forEach((key) => {
    if (key !== 'pageNum' && key !== 'pageSize') {
      queryForm.value[key] = '';
    }
  });
  let endDate = dayjs(new Date()).format('YYYY-MM-DD');
  let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD');
  queryForm.value.activitiesEndTime = endDate;
  queryForm.value.activitiesStartTime = startDate;
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
  let endDate = dayjs(new Date()).format('YYYY-MM-DD');
  let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD');
  queryForm.value.activitiesEndTime = endDate;
  queryForm.value.activitiesStartTime = startDate;
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
