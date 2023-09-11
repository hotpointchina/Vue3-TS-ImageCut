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
      <el-row class="justify-between items-start">
        <el-col :span="5">
          <el-form-item label="字典类型编码" prop="typeCode" class="search-form-item">
            <el-input v-model="queryForm.typeCode" placeholder="请输入字典类型编码" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="字典项名称" prop="name" class="search-form-item">
            <el-input
              v-model="queryForm.name"
              placeholder="请输入字典项名称"
              disabled
            />
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

      <el-row class="justify-between items-start">
        <el-col :span="5">
          <el-form-item label="字典项值" prop="value" class="search-form-item">
            <el-input v-model="queryForm.value" placeholder="请输入字典项值" />
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="排序" prop="sort" class="search-form-item">
            <el-input v-model="queryForm.sort" placeholder="请输入排序" />
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="状态" prop="status" class="search-form-item">
            <el-select v-model="queryForm.status" placeholder="请选择状态" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="baseSearch">
  import { onMounted, reactive, ref, defineEmits } from 'vue';

  import type { FormInstance, FormRules } from 'element-plus';

  import { DArrowRight } from '@element-plus/icons-vue';

  import { ItemQueryParams } from '/@/views/upms/model/dictItemModel';

  const emit = defineEmits(['isFolder', 'queryTable']);

  const props = defineProps(['queryData']);

  const queryFormRef = ref<FormInstance>();

  const queryForm = ref<ItemQueryParams>({
    ...props.queryData,
  });

  /**
   * 有必输校验就加，没有就删除
   */
  const rules = reactive<FormRules>({});

  /**
   * 查询方法
   * @param formEl
   */
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
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
</style>
