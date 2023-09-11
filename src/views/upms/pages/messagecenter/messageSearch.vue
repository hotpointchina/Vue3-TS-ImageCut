<template>
  <div ref="searchGroup" class="search_group">
    <el-form
      ref="queryFormRef"
      :model="queryForm"
      :rules="rules"
      label-width="6em"
      class="search_form"
      :style="{ height: searchStatus.rowHeight }"
      size="default"
      status-icon
    >
      <el-row class="search_form_row">
        <el-col :span="5">
          <el-form-item label="消息名称" prop="noticeTitle" class="search-form-item">
            <el-input v-model="queryForm.noticeTitle" placeholder="请输入通知标题" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="开始时间" prop="startTime" class="search-form-item">
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
          <el-form-item label="结束时间" prop="validityTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.endTime"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择过期时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5"></el-col>
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
    </el-form>
  </div>
</template>

<script lang="ts" setup name="baseSearch">
  import { onMounted, reactive, ref, defineEmits } from 'vue';
  import { FormInstance, FormRules, ElMessage } from 'element-plus';
  import { DArrowRight } from '@element-plus/icons-vue';
  import { NoticeQueryParams } from '/@/views/upms/model/massageModel';
  import dayjs from 'dayjs';
  const emit = defineEmits(['isFolder', 'queryTable']);
  const props = defineProps(['queryData']);
  const queryFormRef = ref<FormInstance>();
  const queryForm = ref<NoticeQueryParams>({
    ...props.queryData,
  });
  /**
   * 有必输校验就加，没有就删除
   */
  const rules = reactive<FormRules>({
    // noticeTitle: [{ required: true, message: '请输入${$comment}', trigger: 'blur' }],
    // startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    // validityTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
  });
  /**
   * 查询方法
   * @param formEl
   */
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        if (valid) {
          const endTime = new Date(queryForm.value.endTime as string).getTime();
          const startTime = new Date(queryForm.value.startTime as string).getTime();
          if (startTime > endTime) {
            ElMessage({
              message: '开始时间不得大于结束时间',
              type: 'error',
            });
            return false;
          }
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
    let endDate = dayjs(new Date()).format('YYYY-MM-DD 23:59:59');
    let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD 00:00:00');
    queryForm.value.endTime = endDate;
    queryForm.value.startTime = startDate;
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
    let endDate = dayjs(new Date()).format('YYYY-MM-DD 23:59:59');
    let startDate = dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD 00:00:00');
    queryForm.value.endTime = endDate;
    queryForm.value.startTime = startDate;
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
</style>
