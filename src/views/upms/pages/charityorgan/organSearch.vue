<template>
  <div ref="searchGroup" class="search_group">
    <el-form :model="ruleForm" label-width="6em"
      class="flash_form flex flex-col px-20px pt-20px overflow-hidden transition-all ease-linear duration-300"
      :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
      <el-row class="justify-between items-start">
        <el-col :span="5">
          <el-form-item label="组织名称" class="search-form-item">
            <el-input style="width: 200px" v-model="ruleForm.pwoName" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="省" class="search-form-item">
            <el-select v-model="ruleForm.provinceName" clearable placeholder="请选择省份" @change="Change">
              <el-option v-for="item in optionPro" :key="item.distId" :label="item.label" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="市" class="search-form-item">
            <el-select v-model="ruleForm.cityName" clearable placeholder="请选择城市" @change="ChangeCity">
              <el-option v-for="item in optionCity" :key="item.distId" :label="item.label" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="区/县" class="search-form-item">
            <el-select v-model="ruleForm.countyName" clearable placeholder="请选择区/县" @change="ChangeCounty">
              <el-option v-for="item in optionCounty" :key="item.distId" :label="item.label" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="flex flex-row justify-end items-center">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button @click="reset">重置</el-button>
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
        <el-col :span="5">
          <el-form-item label="组织编号" class="search-form-item">
            <el-input style="width: 200px" v-model="ruleForm.pwoCode" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="organSearch">
import { onMounted, reactive, ref, defineEmits } from 'vue'
import { DArrowRight } from '@element-plus/icons-vue'
import { Search, AmcDistrict } from './organ';
import { queryPro, queryCity, queryCounty } from '/@/views/upms/api/charityorgan';

const emit = defineEmits(['searchValue','isFolder']);
const props = defineProps(['queryData']);
const ruleForm = ref<Search>({
  ...props.queryData,
});
const optionPro = ref<AmcDistrict[]>();
const optionCity = ref<AmcDistrict[]>();
const optionCounty = ref<AmcDistrict[]>();
onMounted(() => {
  getpro();
})
function getpro() {
  queryPro().then(res => {
    optionPro.value = res
  })
}
function Change(item) {
  ruleForm.value.provinceCode = item.value
  ruleForm.value.provinceName = item.label
  //获取城市
  queryCity(item.value).then(res => {
    optionCity.value = res
  })
}
function ChangeCity(item) {
  ruleForm.value.cityCode = item.value
  ruleForm.value.cityName = item.label
  //获取区县
  queryCounty(item.value).then(res => {
    optionCounty.value = res

  })
}
function ChangeCounty(item) {
  ruleForm.value.countyCode = item.value
  ruleForm.value.countyName = item.label
}
function submit() {
  emit('searchValue', ruleForm.value);
}
function reset() {
  ruleForm.value.cityCode = ''
  ruleForm.value.cityName = ''
  ruleForm.value.countyCode = ''
  ruleForm.value.countyName = ''
  ruleForm.value.provinceCode = ''
  ruleForm.value.provinceName = ''
  ruleForm.value.pwoCode = ''
  ruleForm.value.pwoName = ''
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
</style>
