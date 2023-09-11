<template>
  <div ref="searchGroup" class="search_group">
    <el-form :model="ruleForm" label-width="6em"
      class="flash_form flex flex-col px-20px pt-20px overflow-hidden transition-all ease-linear duration-300"
      :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
      <el-row class="justify-between items-start">
        <el-col :span="6">
          <el-form-item label="商品名称" prop="activitiesName" class="search-form-item">
            <el-input v-model="ruleForm.wareName" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品类型" prop="compartmentName" class="search-form-item">
            <el-select v-model="ruleForm.wareType" placeholder="请选择商品类型">
              <el-option label="日用品" value="1" />
              <el-option label="学具" value="2" />
              <el-option label="食品" value="3" />
              <el-option label="衣物" value="4" />
              <el-option label="其他" value="5" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status" class="search-form-item">
            <el-select v-model="ruleForm.status" placeholder="请选择商品状态">
              <el-option label="启用" value="1" />
              <el-option label="停用" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="flex flex-row justify-end items-center">
          <el-button type="primary" @click="submitForm()">查询</el-button>
          <el-button @click="reset()">重置</el-button>
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
      <el-row>
        <el-col :span="24">
          <el-form-item label="上架时间" class="search-form-item">
            <el-col :span="5" >
              <el-date-picker v-model="ruleForm.startTime" type="date" value-format="YYYY-MM-DD" placeholder="开始时间" />
            </el-col>
            <el-col :span="1" style="margin-right: 2%;text-align: center;">
              <span>-</span>
            </el-col>
            <el-col :span="5" >
              <el-date-picker v-model="ruleForm.endTime" type="date" value-format="YYYY-MM-DD" placeholder="结束时间" />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="productSearch">
import { onMounted, reactive, ref, defineEmits } from 'vue'
import { DArrowRight } from '@element-plus/icons-vue'
import { searchI } from './product';

const emit = defineEmits(['searchValue', 'isFolder']);
const props = defineProps(['queryData']);
const ruleForm = ref<searchI>({
  ...props.queryData,
});

onMounted(() => {
  console.log('加载查询项')
})

function submitForm() {
  console.log(ruleForm)
  emit('searchValue', ruleForm.value);
}
function reset() {
  ruleForm.value.wareName = ''
  ruleForm.value.wareType = ''
  ruleForm.value.status = ''
  ruleForm.value.startTime = ''
  ruleForm.value.endTime = ''
  emit('searchValue', ruleForm.value);
}

const searchGroup = ref();
const searchStatus = reactive({
  fold: true,
  show: false,
  title: '展开',
  rowHeight: '70px',
  iconRotate: 'rotate(90deg)'
});

interface formEl {
  wrap: HTMLElement | null,
  row: HTMLElement[] | null,
  rowNumber: number,
  firstRow: number,
  standerHeight: number,
  fullHeight: string,
}
const formEl: formEl = {
  wrap: null,
  row: null,
  rowNumber: 1,
  firstRow: 70,
  standerHeight: 50,
  fullHeight: ''
};
onMounted(() => {
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
      height: searchStatus.rowHeight
    }
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
  width: 90px !important;
  padding: 0 16px 0 6px;
  line-height: 15px;
  justify-content: flex-end;
}

.label_split {
  justify-content: center;
}
</style>
