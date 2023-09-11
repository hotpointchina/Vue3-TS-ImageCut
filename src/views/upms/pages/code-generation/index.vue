<route lang="yaml">
name: code-generation
</route>
<template>
  <div class="relative">
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
        <el-col :span="1"></el-col>
        <el-col :span="8">
          <el-form-item label="表描述" prop="tableComment">
            <el-input v-model="queryForm.tableComment" placeholder="表描述"  clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
        <el-form-item style="float:right;">
          <div>
            <el-button type="primary" @click="submitForm(queryTableForm)">查询</el-button>
            <el-button @click="resetForm(queryTableForm)">重置</el-button>
          </div>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
   <div style="margin: 10px;">
     <el-button type="primary" :icon="Plus" @click="dialogTableVisible=true">导入</el-button>
   </div>
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
      <el-table-column property="createTime" label="创建时间" align="center"/>
      <el-table-column property="updateTime" label="更新时间" align="center"/>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="danger" :icon="Delete" size="small" @click.prevent="deleteRow(scope.row)">删除</el-button>
          <el-button link type="primary" :icon="Refresh" size="small" @click.prevent="handleSynchDb(scope.row)">同步</el-button>
          <el-button link type="primary" :icon="View" size="small" @click.prevent="openShowView(scope.row)">预览</el-button>
          <el-button link type="primary" :icon="Edit" size="small" @click.prevent="editOpenEdittable(scope.row)">修改规则</el-button>
          <el-button link type="primary" :icon="Promotion" size="small" @click.prevent="handleGenTable(scope.row)">生成代码</el-button>
        </template>
      </el-table-column>
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
      <el-dialog
        v-model="dialogTableVisible"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        title="表引入"
        width="65%">
        <table-import @sendDataMethod="getSelectList" style="margin-bottom: 15px;"></table-import>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogTableVisible = false">关闭</el-button>
            <el-button type="primary" @click="getTableDataList">确认</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog   v-model="isopenpreview"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   title="代码预览"
                   width="65%">
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(value, key) in viewdata"
            :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
            :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
            :key="key">
            <pre>{{ value }}</pre>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </el-config-provider>
    <div class="edit_page" v-if="userStore.closeState">
      <editcode></editcode>
    </div>
  </div>
</template>
<script lang="ts" setup name="">
import {ref} from "vue";
import type { FormInstance} from 'element-plus'
import { ElMessage, ElMessageBox,ElLoading } from 'element-plus';
import { Plus, Delete, Refresh, View, Edit, Promotion } from '@element-plus/icons-vue'
import {
  importTableItem,
  TablePageParams,
  tableQueryForm, viewTableParam
} from "/@/views/upms/pages/code-generation/model/genModel";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import TableImport from "/@/views/upms/pages/code-generation/tableImport.vue";
import {delTable, importData, listTable, previewTable, synchDb} from "/@/api/sys/codegeneration";
import { useCodeGeneration } from '/@/stores/modules/codeGeneration';
// import { useRouter } from 'vue-router';
import editcode from './edit-table/index.vue';
const userStore = useCodeGeneration();
// const router = useRouter();

// const tableLayout: string = "fixed";
const tableLayout:any =ref("fixed");
const currentPage = ref(1);
const pageSize = ref(10);
const  total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const queryForm =ref<tableQueryForm>({tableName:'',tableComment:''});
const queryTableForm = ref<FormInstance>();
const tableData = ref<importTableItem[]>([]);
const multipleSelection = ref<[]>([])
const dialogTableVisible = ref(false)
const tableNames = ref("");
const isopenpreview = ref(false);
const viewdata = ref<viewTableParam>();
const activeName = ref('domain.java');

/**
 * table列表查询方法
 * @param params
 */
const getTableList = (params: TablePageParams) => {
  params.pageNum = currentPage.value
  params.pageSize = pageSize.value
  listTable(params).then(res =>{
    tableData.value = res.list
    total.value = res.total;
  })
}
/**
 * 定义初始化方法进入页面默认查询
 */
const init = () => {
  getTableList({ pageNum: 1, pageSize: 10});
}
/**
 * 执行初始化方法
 */
init ();
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      getTableList(queryForm.value);
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
/**
 * 删除导入的表结构
 * @param index
 */
const deleteRow = (row: importTableItem) => {
  ElMessageBox.confirm('是否删除该数据?','警告',
    {confirmButtonText: '确认',cancelButtonText: '取消',type: 'warning',}
  ).then(() => {
      delTable(row.tableId).then(() =>{
          getTableList(queryForm.value);

      })
    })
}
/**
 * 同步库表
 * @param row
 */
const handleSynchDb = (row: importTableItem) => {
  ElMessageBox.confirm('确认要强制同步"' + row.tableName + '"表结构吗？','警告',
    {confirmButtonText: '确认',cancelButtonText: '取消',type: 'warning',}
  ).then(() => {
    synchDb(row.tableName).then(() => {
      getTableList(queryForm.value);
    })
  })
}
/**
 * 代码预览查看
 * @param row
 */
const openShowView = (row: importTableItem) =>{
  // 添加加载动作
  const loading = ElLoading.service({
    lock: true,
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  // 请求获取代码
  previewTable( row.tableId ).then(res =>{
      isopenpreview.value = true;
      viewdata.value = res;
  }).finally(()=>{loading.close()});
}


// 修改规则
const editOpenEdittable = async (row: importTableItem) =>{
  // 添加加载动作
  const loading = ElLoading.service({
    lock: true,
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await userStore.setEditTableId(row.tableId);
  loading.close();
  userStore.setCloseState(true)
}
/**
 * 代码生成
 * @param row
 */
const handleGenTable = (row: importTableItem) =>{
  if (!row.tableName) {
    ElMessage.error("请选择要生成的表");
    return
  }
  ElMessage.error("功能暂不开发");
}
const getTableDataList = () => {
  importData({ tables: tableNames.value }).then (() => {
      dialogTableVisible.value = false
      getTableList(queryForm.value)

  })

}
/**
 * 接收导入表中选中的tableName
 * @param str
 */
const getSelectList = (str: string) => {
  tableNames.value = str
}
</script>
<route lang="yaml">
meta:
auth: false
</route>
//
<style scoped>
.edit_page{
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  width: 100%;
  height: calc(100vh - 60px);
  background: white none;
}
</style>
