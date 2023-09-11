<template>
  <div ref="searchGroup" class="search_group">
    <el-form ref="queryFormRef" :model="queryForm" label-width="7em" class="search_form"
      :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
      <el-row class="search_form_row">
        <el-col :span="5">
          <el-form-item label="规则名称" prop="ruleName" class="search-form-item">
            <el-input v-model="queryForm.ruleName" placeholder="请输入规则名称" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="规则类型" prop="ruleType" class="search-form-item">
            <el-select v-model="queryForm.ruleType" placeholder="请选择规则类型">
              <el-option v-for="dict in ruleTypeList" :key="dict.value" :label="dict.name" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="flex flex-row justify-end items-start">
          <el-button type="primary" @click="submitForm">查询</el-button>
          <el-button @click="resetForm(queryFormRef)">重置</el-button>
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
import { onMounted, reactive, ref, defineEmits } from 'vue';
import { FormInstance } from 'element-plus';
import { DArrowRight } from '@element-plus/icons-vue';
import { RuleQueryParams } from '/@/views/upms/model/rule';
import { getRuleTypeList } from '/@/views/upms/api/rule';
const emit = defineEmits(['isFolder', 'queryTable']);
const props = defineProps(['queryData']);
const queryFormRef = ref<FormInstance>();
const queryForm = ref<RuleQueryParams>({
  ...props.queryData,
});
/**
 * 有必输校验就加，没有就删除
 */
/* 选择框 */
type flagPage = {
  name: string;
  value: string;
};
const ruleTypeList = ref<flagPage[]>([])
const changeGroup = () => {
  getRuleTypeList('ruleType').then((res) => {
    ruleTypeList.value = res.data;
  });

};
/**
 * 查询方法
 * @param formEl
 */
const submitForm = () => {

  emit('queryTable', queryForm.value);

};
/**
 * 重置清空方法
 * @param formEl
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  submitForm()
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
  changeGroup()
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
