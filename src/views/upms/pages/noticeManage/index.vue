<route lang="yaml">
name: notice
</route>


<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">通知管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable"  @isFolder="isFolder"/>
    <div class="home_content_wrap">
      <div class="table_controll">
        <span>已选择 {{multipleSelectionNumber}} 项</span>
        <div class="button_grounp">
          <el-button link type="danger" size="small" @click="deleteChoose" style="font-size:14px;">删除</el-button>
        </div>
      </div>
      <!-- table -->
      <div class="base_table">
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          :maxHeight="tableHeightInfo.tableHeight"
          :style="{width: '100%'}"
          stripe
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed width="55" />
          <el-table-column property="noticeTitle" :show-overflow-tooltip="true" label="通知标题" width="240" />
          <el-table-column property="noticeContent" :show-overflow-tooltip="true" label="通知内容"  />
          <el-table-column property="receiveSystem" :show-overflow-tooltip="true" label="接收系统" width="120" />
          
          <el-table-column property="startTime" :show-overflow-tooltip="true" label="开始时间" width="180" >
            <template #default="scope">{{ scope.row.startTime }}</template>
          </el-table-column>
          <el-table-column property="validityTime" :show-overflow-tooltip="true" label="过期时间" width="180" >
            <template #default="scope">{{ scope.row.validityTime }}</template>
          </el-table-column>
          <el-table-column property="createTime" :show-overflow-tooltip="true" label="创建时间" width="180" >
            <template #default="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column property="status" :show-overflow-tooltip="true" label="发布状态" width="120" />
          <el-table-column fixed="right" label="操作" width="160" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="detailClick(scope.row)">详情</el-button >
              <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === '未发布'" link type="primary" size="small" @click="noticeFabuMethod(scope.row)">发布</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination
              v-model:currentPage="queryData.pageNum"
              v-model:page-size="queryData.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :small="true"
              :disabled="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </el-config-provider>
        </div>
        <!-- table 查看详情 -->
        <div v-if="detailShow">
          <el-dialog
            v-model="detailShow" title="详情" width="60%" top="15vh" :draggable="true">
            <el-descriptions class="margin-top" :column="2" :size="'default'" :border="true">
              <el-descriptions-item label="通知标题" label-align="left" align="center" :span="24">
                {{detailInfo.noticeTitle}}
              </el-descriptions-item>
              <el-descriptions-item v-if="detailInfo.textType==='1'" label="通知内容" label-align="left" align="center" :span="24">
                {{detailInfo.noticeContent}}
              </el-descriptions-item>
              <el-descriptions-item v-if="detailInfo.textType==='2'" label="通知内容" label-align="left" align="center" :span="24">
                <div v-html="detailInfo.noticeContent" class="ql-editor"></div>
              </el-descriptions-item>
              <el-descriptions-item label="开始时间" label-align="left" align="center">
                {{detailInfo.startTime}}
              </el-descriptions-item>
              <el-descriptions-item label="过期时间" label-align="left" align="center">
                {{detailInfo.validityTime}}
              </el-descriptions-item>
              <el-descriptions-item label="接收系统" label-align="left" align="center">
                {{dictChange(detailInfo.receiveSystem,noticeTzxtDic)}}
              </el-descriptions-item>
              <el-descriptions-item label="优先级" label-align="left" align="center">
                {{detailInfo.level}}
              </el-descriptions-item>
              <el-descriptions-item label="备注" label-align="left" align="center">
                {{detailInfo.remark}}
              </el-descriptions-item>
            </el-descriptions>
          </el-dialog>
        </div>
      </div>
      <!-- 新增/编辑 -->
      <div class="edit_page" v-if="isShowEditPageData">
        <addPage @closeRefresh="closeRefresh"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="notice">
import { reactive, ref } from 'vue';
import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { Plus,Close } from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import baseSearch from './search/index.vue';
import addPage from './add/index.vue';
import dayjs from "dayjs"
import {
  NoticeListParams,
  NoticeQueryParams,
} from '/@/views/upms/model/noticeModel';
import {
  queryNotice,
  delNotice,
  detailNotice,
  noticeFabu,
} from '/@/views/upms/api/notice';
import { useUpmsNotice } from '/@/stores/modules/notice';
import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
import { seachGroupInfoModel, autoTableHeightInfoModel } from '/@/api/model/commonModel';
import { queryDicList } from '/@/views/upms/api/dictItem'
export default {
  name: 'NoticeTable',
  components: {baseSearch, addPage},
  setup() {
    const useUpmsNoticeStore = useUpmsNotice();
    const detailInfo =  ref<NoticeListParams>({});
    const total = ref(0);
    const detailShow = ref(false);
    const tableData = ref<NoticeListParams[]>([]);
    const noticeTzxtDic = ref<any>();
    // table 的 REF
    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    // table 复选框已选择的行
    const multipleSelection = ref<NoticeListParams[]>([]);
    // table 复选框已选择的个数
    const multipleSelectionNumber = ref<number>(0);
    const isShowEditPageData = ref<boolean>(false);
    const tableHeightInfo =  reactive<autoTableHeightInfoModel>({
      tableHeight:'50vh',
      seachGroupInfo:{status:false,height:'70'},
    });
    const date = new Date()
    date.setDate(date.getDate() - 7)
    // 定义查询参数
    const queryData = ref<NoticeQueryParams>({
      pageNum: 1,
      pageSize: 10,
      createTime: [dayjs(date).format('YYYY-MM-DD')+ ' 00:00:00',dayjs(new Date()).format('YYYY-MM-DD')+ ' 23:59:59'],
      noticeType: "",
      noticeTitle: "",
      startTime: "",
      endTime: "",
    });
    /**
     * 定义初始化方法进入页面默认查询
     */
    const init = () => {
      getTableList(queryData.value);
      getDictData();
    }
    init();
    /**
     *分页页数
     * @param val
     */
    const handleSizeChange = (val: number) => {
      queryData.value.pageSize = val;
      getTableList(queryData.value);
    }
    /**
     *分页页码
     * @param val
     */
    const handleCurrentChange = (val: number) => {
      queryData.value.pageNum = val;
      getTableList(queryData.value);
    }
    // table 复选框 被选取
    const handleSelectionChange = (val: NoticeListParams[]) => {
      multipleSelection.value = val
      multipleSelectionNumber.value = val.length
    };
    // 批量删除
    const deleteChoose = ()=>{
      if(multipleSelection.value.length==0){
        ElMessage({
          message: '请选择要删除的数据！',
          type: 'error',
        })
        return;
      }
      ElMessageBox.confirm(
        '是否删除已选中的数据?',
        '警告',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          let ids:string[] = [];
          multipleSelection.value.forEach(item => {
            ids.push(''+item.id)
          });
          const loading = ElLoading.service({
            lock: true,
            text: '数据删除中...',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          delNotice(ids).then(() =>{
            // res 里如果有参数判断删除成功，请取值判断处理
            ElMessage({
              message: '删除成功！',
              type: 'success',
            })
            getTableList(queryData.value);
          }).finally(()=>{loading.close()})
        })
    };
    // 查看详情
    const detailClick = (row:NoticeListParams)=>{
      detailNotice(''+row.id).then (res => {
        // 直接获取表格中的数据，或者访问后台代码
        detailInfo.value = res;
        detailShow.value = true;
      })
    };
    // 新增、添加
    const tableAdd = ()=>{
      useUpmsNoticeStore.isEditing = false;
      useUpmsNoticeStore.modal = 'add';
      useUpmsNoticeStore.noticeTzxtDic = noticeTzxtDic.value;
      isShowEditPageData.value = true;
    };

    // 关闭 新增/编辑 before
    const closeRefresh = (type)=>{
      isShowEditPageData.value = false;
      if(type =='submit') {
        getTableList(queryData.value);
      }
    }

    /**
     * 字典翻译
     * @param value
     * @param dictArr
     */
    const dictChange = function (value,dictArr) {
      for (let item of dictArr) {
        if (item.value === value) {
          return item.name
        }
      }
    }
    // 编辑 按钮
    const modifyHandler = (row:NoticeListParams) =>{
      detailNotice(''+row.id).then (res => {
        useUpmsNoticeStore.isEditing = true
        useUpmsNoticeStore.modal = 'modify'
        useUpmsNoticeStore.setEditDataInfo( res );
        useUpmsNoticeStore.noticeTzxtDic = noticeTzxtDic.value;
        isShowEditPageData.value = true;
      })

    }
    /**
     *
     * @param row
     */
    const noticeFabuMethod = (row:NoticeListParams) => {
      ElMessageBox.confirm(
        '是否发布通知?',
        '警告',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
          const fdata = {id:row.id,status: '1'}
          const loading = ElLoading.service({
            lock: true,
            text: '通知发布中...',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          noticeFabu(fdata).then( () =>{
            ElMessage({
              message: '发布成功！',
              type: 'success',
            })
            getTableList(queryData.value);
          }).finally(() =>{
            loading.close();
          })
      })
    }
    /**
     * 批量操作，有进行方法修改，没有就删除
     */
    const functionHandler = ()=>{
      console.log('批量操作');
    };
    /**
     * 查询方法
     * @param Data
     */
    function queryTable (Data:NoticeQueryParams){
      getTableList(Data);
    }
    /**
     * 列表请求
     * @param params
     */
    function getTableList(params: NoticeQueryParams) {
      const loading = ElLoading.service({
        lock: true,
        text: '数据加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      queryNotice(params).then(res =>{
        tableData.value = res.records
        total.value = res.total;
        queryData.value.pageSize = res.size
        queryData.value.pageNum = res.current
      }).finally(() =>{loading.close()})
    }
    /**
     * 获取字典
     */
    function getDictData  () {
      queryDicList('JSXT').then(res =>{
        noticeTzxtDic.value = res.data
        useUpmsNoticeStore.noticeTzxtDic = noticeTzxtDic.value;
      })
    }
    // ==== 添加 table 的高度自适应 begin
    const isFolder = ( obj:seachGroupInfoModel = tableHeightInfo.seachGroupInfo)=>{
      isFolderHelper( obj, tableHeightInfo );
    };
    isFolderHelper( tableHeightInfo.seachGroupInfo, tableHeightInfo );
    window.onresize = ()=>{
      isFolderHelper( tableHeightInfo.seachGroupInfo, tableHeightInfo );
    };
    return {
      zhCn,
      Plus,Close,
      detailInfo,
      total,
      detailShow,tableData,
      tableHeightInfo,
      multipleSelectionNumber,
      multipleTableRef,
      isShowEditPageData,
      queryTable,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      deleteChoose,
      detailClick,
      tableAdd,
      closeRefresh,
      modifyHandler,
      isFolder,
      functionHandler,
      queryData,
      noticeTzxtDic,
      dictChange,
      noticeFabuMethod,
    }
  }
}

</script>
<style scoped>
@import url('/@/styles/common/admcDefaultStyle.css');
</style>
