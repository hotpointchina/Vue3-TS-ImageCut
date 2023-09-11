<template>
  <div ref="searchGroup" class="search_group">

    <el-form ref="queryFormRef" :model="queryForm" label-width="6em"
      class="flash_form flex flex-col px-20px pt-20px overflow-hidden transition-all ease-linear duration-300"
      @submit.native.prevent :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
      <el-row class=" items-start" :locale="zhCn">
        <!-- <el-col :span="5">
          <el-form-item label="所属组织" class="search-form-item" prop="pwoName">
            <el-select v-model="queryForm.pwoId" placeholder="请选择">
              <el-option v-for="item in pwoList" :key="item.value" :label="item.label" :value="item.value"
                @click.native="changePwo(item)" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="5">
          <el-form-item label="角色名称" prop="name" class="search-form-item">
            <el-input v-model="queryForm.name" placeholder="请输入角色名称" @keydown.enter="submit" />
          </el-form-item>
        </el-col>
        <el-col :span="19" class="flex flex-row justify-end items-start">
          <el-button type="primary" @click="submitForm">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>



<script lang="ts" setup name="baseSearch">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { onMounted, reactive, ref, defineEmits } from 'vue';
import type { FormInstance } from 'element-plus'

// import { DArrowRight } from '@element-plus/icons-vue'
import {
  roleQueryParams,
  // pwoListType
} from '/@/views/upms/model/roleModel';
// import { queryOrganize } from '/@/views/upms/api/role'
const emit = defineEmits(['isFolder', 'queryTable']);

const props = defineProps(['queryData']);
const queryFormRef = ref<FormInstance>()

const queryForm = ref<roleQueryParams>({
  ...props.queryData
})
// 所属组织数据
// const pwoList = ref<pwoListType[]>();
// 选择组织
// const pwoChange = () => {
//   // 查询公益组织
//   queryOrganize().then(res => {
//     pwoList.value = res
//   })
// }
// pwoChange()
// 选择公益组织
// const changePwo = (item) => {
//   queryForm.value.pwoName = item.label
// }
/**
 * 有必输校验就加，没有就删除
 */


/**
 * 查询方法
 */
const submitForm = () => {
  emit('queryTable', queryForm.value);
}
/**
 * 重置清空方法
 */
const resetForm = () => {
  Object.keys(queryForm.value).forEach((key) => {
    if (key !== 'pageNum' && key !== 'pageSize') {
      queryForm.value[key] = ''
    }
  })
  submitForm()
}
// 回车事件
const submit = () => {
  submitForm()
}
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
  iconRotate: 'rotate(90deg)'
});

/**
 * dome元素，不需要改动
 */
interface formEl {
  wrap: HTMLElement | null,
  row: HTMLElement[] | null,
  rowNumber: number,
  firstRow: number,
  standerHeight: number,
  fullHeight: string,
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
  fullHeight: ''
};

/**

 * 不需要改动

 */

onMounted(() => {
  submitForm()
  formEl.wrap = searchGroup.value.querySelector('.el-form') as HTMLElement;

  formEl.row = Array.from(searchGroup.value.querySelectorAll('.el-form .el-row'));

  formEl.rowNumber = formEl.row.length;

  formEl.fullHeight = ((formEl.rowNumber - 1) * formEl.standerHeight + formEl.firstRow) + 'px';



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

// const folder = () => {

//   if (searchStatus.fold) {

//     searchStatus.fold = false;

//     searchStatus.rowHeight = formEl.fullHeight;

//     searchStatus.iconRotate = 'rotate(-90deg)';

//     searchStatus.title = '折叠';

//   } else {

//     searchStatus.fold = true;

//     searchStatus.rowHeight = '70px';

//     searchStatus.iconRotate = 'rotate(90deg)';

//     searchStatus.title = '展开';

//   }

//   emit(

//     'isFolder',

//     {

//       status: searchStatus.fold,

//       height: searchStatus.rowHeight

//     }

//   );

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
