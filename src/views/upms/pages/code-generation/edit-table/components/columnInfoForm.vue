<template>
  <div class="flex flex-col w-full p-20px box-border">
    <el-table
      ref="multipleTableRef"
      :data="data.tableData"
      style="width: 100%;height:100%;"
      :header-row-style="{backgroundColor:'#fafafa'}"
      :header-cell-style="{backgroundColor:'#fafafa'}"
    >
      <el-table-column type="index" width="50" />
      <el-table-column property="columnName" label="列名" align="center" width="120" show-overflow-tooltip />
      <el-table-column label="字段描述" align="center" width="160">
        <template #default="scope">
          <el-input v-model="scope.row.columnComment" clearable placeholder="证件编号" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="Java类型" align="center" width="140">
        <template #default="scope">
          <el-select v-model="scope.row.javaType" placeholder="Java类型">
            <el-option label="Long" value="Long" />
            <el-option label="String" value="String" />
            <el-option label="Integer" value="Integer" />
            <el-option label="Double" value="Double" />
            <el-option label="BigDecimal" value="BigDecimal" />
            <el-option label="Date" value="Date" />
          </el-select>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="java属性" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.javaField" clearable placeholder="java属性" />
        </template>
      </el-table-column> -->
      <el-table-column label="插入" align="center" width="60">
        <template #default="scope">
          <el-checkbox v-model="scope.row.insert" />
        </template>
      </el-table-column>
      <el-table-column label="编辑" align="center" width="60">
        <template #default="scope">
          <el-checkbox v-model="scope.row.edit" />
        </template>
      </el-table-column>
      <el-table-column label="列表" align="center" width="60">
        <template #default="scope">
          <el-checkbox v-model="scope.row.list" />
        </template>
      </el-table-column>
      <el-table-column label="查询" align="center" width="60">
        <template #default="scope">
          <el-checkbox v-model="scope.row.query" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="查询方式" align="center" width="160">
        <template #default="scope">
          <el-select v-model="scope.row.queryType" placeholder="查询方式">
            <el-option label="=" value="EQ" />
            <el-option label="!=" value="NE" />
            <el-option label=">" value="GT" />
            <el-option label=">=" value="GTE" />
            <el-option label="<" value="LT" />
            <el-option label="<=" value="LTE" />
            <el-option label="LIKE" value="LIKE" />
            <el-option label="BETWEEN" value="BETWEEN" />
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="必填" align="center" width="60">
        <template #default="scope">
          <el-checkbox v-model="scope.row.required" />
        </template>
      </el-table-column>
      <el-table-column label="显示类型" align="center">
        <template #default="scope">
          <el-select v-model="scope.row.htmlType" placeholder="显示类型">
            <el-option label="文本框" value="input" />
            <el-option label="文本域" value="textarea" />
            <el-option label="下拉框" value="select" />
            <el-option label="单选框" value="radio" />
            <el-option label="复选框" value="checkbox" />
            <el-option label="日期控件" value="datetime" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="字典" align="center">
        <template #default="scope">
          <el-select v-model="scope.row.dictType" placeholder="字典">
            <el-option label="菜单状态" value="sys_show_hide" />
          </el-select>
        </template>
      </el-table-column>

    </el-table>

    <div class="flex flex-row justify-center items-center pt-20px">
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
      <el-button type="primary" @click="handleGenTable">代 码 生 成</el-button>
    </div>
  </div>
</template>

<script lang='ts' name='columnInfoForm'>
import {ref, watch, reactive, onMounted} from 'vue';
import { ElTable } from 'element-plus';
import { useCodeGeneration } from '/@/stores/modules/codeGeneration';
import { editTableHandle } from '../function';
export default {
  name: 'columnInfoForm',
  props:{
    plodData:{
      type: Object,

    }
  },
  setup(props) {
    const userStore = useCodeGeneration();
    interface TableDataType {
      columnName: string
      columnComment: string
      // javaType: string
      // javaField: string
      isInsert: string
      isEdit: string
      isList: string
      isQuery: string
      // queryType: string
      isRequired: string
      htmlType: string
      dictType: string
      insert: boolean
      edit:boolean
      list:boolean
      query:boolean
      required:boolean
    }
    // interface plodDataType<T> { plodData: T }


    // const props = withDefaults(defineProps<plodDataType<TableDataType[]>>(),{
    //   plodData: ()=> {return [{
    //     columnName: '',
    //     columnComment: '',
    //     javaType: '',
    //     javaField: '',
    //     insert: false,
    //     edit:false,
    //     list:false,
    //     query:false,
    //     required:false,
    //     isInsert: '0',
    //     isEdit: '0',
    //     isList: '0',
    //     isQuery: '0',
    //     queryType: '',
    //     isRequired: '0',
    //     htmlType: '',
    //     dictType: '',
    //   }]}
    // });

    interface DataType {
      tableData: TableDataType[]
    };
    const data: DataType = reactive({
      tableData:[]
    })

    const init = ()=>{
      console.log(props.plodData)
      data.tableData = JSON.parse( JSON.stringify(props.plodData) );
    };
    onMounted(()=>{
      init();
    });
    // onUpdated(()=>{
    //   init();
    // })
    watch(
      ()=> props.plodData,
      (val)=>{
        data.tableData = JSON.parse( JSON.stringify(val) );
      },
      // { deep: true  },
    );
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()


    const { submitUpdateGenTable } = editTableHandle();
    const handleSubmit = ()=>{
      data.tableData.forEach(item => {
        item.isInsert = item.insert?"1":"0"
        item.isEdit = item.edit?"1":"0"
        item.isList = item.list?"1":"0"
        item.isQuery = item.query?"1":"0"
        item.isRequired = item.required?"1":"0"
      })
      submitUpdateGenTable({
        ...userStore.EditDataInfo,
        columns: data.tableData
      });
    };
    const handleGenTable = ()=>{
      // downLoadZip('/system/gen/batchGenCode?tables=' + this.data.info.tableName, 'ysb')
    };
    return {
      handleGenTable,handleSubmit,multipleTableRef,data,userStore
    }
  }
}


</script>

<style scoped>

</style>
