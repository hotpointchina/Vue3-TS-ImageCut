<template>
  <div>
    <el-config-provider :locale="zhCn">
      <el-form
        style="margin: 10px;"
        ref="queryTableForm"
        :model="queryForm"
        class="demo-form-inline" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="表名" prop="tableName">
              <el-input v-model="queryForm.tableName" placeholder="表名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="1">
          </el-col>
          <el-col :span="8">
            <el-form-item label="表描述" prop="tableComment">
              <el-input v-model="queryForm.tableComment" placeholder="表描述" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item style="float:right;">
              <div style="">
                <el-button type="primary" @click="submitForm(queryTableForm)">查询</el-button>
                <el-button @click="resetForm(queryTableForm)">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        :table-layout="tableLayout"
        style="width: 100%;padding: 10px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="tableName" label="表名" />
        <el-table-column property="tableComment" label="表描述" />
        <el-table-column property="createTime" label="创建时间" />
        <el-table-column property="updateTime" label="更新时间" align="center"/>
      </el-table>
      <el-pagination
        style="float: right;"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-config-provider>
  </div>
</template>
<script lang="ts" setup name="">
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import {
  BasicFetchResultModel,
  tableItem,
  TablePageParams} from "/@/views/upms/pages/code-generation/model/genModel";
import {ref, defineEmits} from "vue";
import {FormInstance} from "element-plus";
import {getDaTableList} from "/@/api/sys/codegeneration";
const tableLayout:any = "fixed";
const currentPage = ref(1);
const pageSize = ref(10);
const  total = ref(0);
const tableData = ref<tableItem[]>([]);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const queryTableForm = ref<FormInstance>();
const queryForm =ref<TablePageParams>({tableName:'',tableComment:''});
const emits = defineEmits(['sendDataMethod'])
/**
 * 获取表格数据方法
 * @param params
 */
const getDataList = (params: TablePageParams) => {
  params.pageNum = currentPage.value
  params.pageSize = pageSize.value
  getDaTableList(params).then((res:BasicFetchResultModel)=>{
    tableData.value = res.list
    total.value = res.total;
  })
}
/**
 * 定义初始化方法进入页面默认查询
 */
const init = () => {
  getDataList({ pageNum: 1, pageSize: 10});
}
/**
 * 执行初始化方法
 */
init ();
/**
 * 根据参数查询列表数据方法
 * @param formEl
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      getDataList(queryForm.value);
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**
 * 查询重置方法
 * @param formEl
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
/**
 * 表选择方法
 * @param val
 */
const handleSelectionChange = (val: tableItem[]) => {
  const str = ref("")
  val.forEach((item) => {
    str.value = str.value + item.tableName +",";
  })
  emits('sendDataMethod',str.value)
}
/**
 * 分页条数变更方法
 * @param val
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getDataList(queryForm.value);
}
/**
 * 分页页码变更方法
 * @param val
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getDataList(queryForm.value);
}
</script>
<route lang="yaml">
meta:
auth: true
</route>
//
<style scoped>

</style>
