<route lang="yaml">
name: editTable
meta:
auth: false
</route>
<template>
  <div class="p-20px">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="pageTabHandler">
      <el-tab-pane label="字段信息" name="second">
        <columnInfoForm :plodData="data.columnInfoFormData" />
      </el-tab-pane>

      <el-tab-pane label="生成信息" name="third">
        <genInfoForm :plodData="genInfoFormData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup name="editTable">
  import {
    //  defineEmits,
    onUnmounted,
    reactive,
    ref,
  } from 'vue';
  import type { TabsPaneContext } from 'element-plus';
  // import basicInfoForm from './components/basicInfoForm.vue';
  import genInfoForm from './components/genInfoForm.vue';
  import columnInfoForm from './components/columnInfoForm.vue';
  import * as typeModel from './model/typeModel';
  import { useCodeGeneration } from '/@/stores/modules/codeGeneration';
  // import { useRouter } from 'vue-router';
  // const emit = defineEmits(['closeRefresh']);
  const userStore = useCodeGeneration();
  // const router = useRouter();

  if (userStore.editTableId === '') {
    userStore.setCloseState(false);
  }

  const activeName = ref('second');
  const pageTabHandler = (tab: TabsPaneContext, event: Event) => {
    if (tab && event) {
      // console.log(tab, event)
    }
  };
  // 基本信息
  const basicInfoFormData: typeModel.basicInfoFormData = reactive({
    tableName: '',
    tableComment: '',
    className: '',
    functionAuthor: '',
    remark: '',
  });
  // 生成信息
  const genInfoFormData: typeModel.genInfoFormData = reactive({
    tplCategory: '',
    packageName: '',
    moduleName: '',
    businessName: '',
    functionName: '',
  });

  interface DataType {
    tableID: string;
    editDataInfo: object;
    editDataRow: typeModel.TableDataType[];
    columnInfoFormData: typeModel.TableDataType[];
  }
  const data: DataType = reactive({
    tableID: userStore.editTableId,
    editDataInfo: {},
    editDataRow: [],
    columnInfoFormData: [],
  });

  // 根据 tableID 获取数据
  const getdata = async () => {
    if (data.tableID) {
      // 获取表详细信息
      const res = (await userStore.getGenTable(data.tableID)) as typeModel.EditData;
      data.editDataInfo = { ...res.info };
      data.editDataRow = JSON.parse(JSON.stringify(res.rows));

      Object.keys(basicInfoFormData).forEach((key) => {
        basicInfoFormData[key] = res.info[key];
      });
      Object.keys(genInfoFormData).forEach((key) => {
        genInfoFormData[key] = res.info[key];
      });
      data.columnInfoFormData = JSON.parse(JSON.stringify(res.rows));
    }
  };
  getdata();

  onUnmounted(() => {
    userStore.repealStore();
  });
</script>
