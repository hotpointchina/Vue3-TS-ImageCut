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
          <el-form-item label="机构名称" prop="orgName" class="search-form-item">
            <el-input v-model="queryForm.orgName" placeholder="请输入机构名称" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="上级机构名称"
            prop="parentOrgName"
            class="search-form-item"
          >
            <el-input
              v-model="queryForm.parentOrgName"
              placeholder="请输入上级机构名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态" prop="status" class="search-form-item">
            <el-select v-model="queryForm.status" placeholder="请选择状态">
              <el-option
                v-for="item in flagStatusOptions"
                :label="item.name"
                :value="item.value"
              />
              <!--              <el-option  v-for="dict in dicLists" :key="dict.value" :label="dict.label" :value="dict.value"/>-->
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="机构编号" prop="orgCode" class="search-form-item">
            <el-input v-model="queryForm.orgCode" placeholder="请输入机构编号" />
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

      <el-row class="justify-start items-start">
        <el-col :span="5">
          <el-form-item label="所在省" prop="provinceName" class="search-form-item">
            <el-select
              v-model="queryForm.provinceName"
              placeholder="请选择所在省"
              @change="proChange"
            >
              <el-option
                v-for="item in proList"
                :key="item.distId"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="所在地市" prop="cityName" class="search-form-item">
            <el-select
              v-model="queryForm.cityName"
              placeholder="请选择所在地市"
              @change="cityChange"
            >
              <el-option
                v-for="item in cityList"
                :key="item.distId"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="所在区县" prop="countyName" class="search-form-item">
            <el-select
              v-model="queryForm.countyName"
              placeholder="请选择所在区县"
              @change="countyChange"
            >
              <el-option
                v-for="item in countyList"
                :key="item.distId"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="BaseSearch">
  import { onMounted, reactive, ref, defineEmits } from 'vue';

  import type { FormInstance, FormRules } from 'element-plus';

  import { DArrowRight } from '@element-plus/icons-vue';

  import { OrgQueryParams } from '/@/views/upms/model/pbdOrgModel';
  import { queryCity, queryCounty, queryPro } from '/@/views/upms/api/amcDistrict';
  import { AmcDistrict } from '/@/views/upms/model/amcDistrictModel';
  import { queryList } from '/@/views/upms/api/dictItem';

  const emit = defineEmits(['isFolder', 'queryTable', 'getTableList']);

  const props = defineProps(['queryData']);

  const queryFormRef = ref<FormInstance>();

  const queryForm = ref<OrgQueryParams>({
    ...props.queryData,
  });

  const proList = ref<AmcDistrict[]>();
  const cityList = ref<AmcDistrict[]>();
  const countyList = ref<AmcDistrict[]>();
  type flagPage = {
    name: string;
    value: string;
  };
  const flagStatusOptions = ref<flagPage[]>([]);

  //查询状态字典
  const queryStatus = () => {
    queryList('orgStatus').then((res) => {
      flagStatusOptions.value = res.data;
    });
  };

  function init() {
    getpro();
    queryStatus();
  }
  init();

  function getpro() {
    queryPro().then((res) => {
      console.log(res);
      proList.value = res;
    });
  }

  function proChange(item) {
    queryForm.value.provinceCode = item.value;
    queryForm.value.provinceName = item.label;
    queryForm.value.cityName = '';
    queryForm.value.countyName = '';
    countyList.value = [];
    cityList.value = [];
    queryCity(item.value).then((res) => {
      console.log(res);
      cityList.value = res;
    });
  }

  function cityChange(item) {
    queryForm.value.cityCode = item.value;
    queryForm.value.cityName = item.label;
    queryCounty(item.value).then((res) => {
      console.log(res);
      countyList.value = res;
    });
  }
  function countyChange(item) {
    queryForm.value.countyCode = item.value;
    queryForm.value.countyName = item.label;
    console.log(queryForm.value);
  }

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
  const queryData = ref<OrgQueryParams>({
    pageNum: 1,
    pageSize: 10,
    provinceName: '',
    cityName: '',
    countyName: '',
    orgCode: '',
    orgName: '',
    parentOrgName: '',
    status: '',
  });
  /**

 * 重置清空方
 * @param formEl
 */
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    queryForm.value.cityCode = '';
    queryForm.value.provinceCode = '';
    queryForm.value.countyCode = '';
    formEl.resetFields();
    emit('getTableList', queryData.value);
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
