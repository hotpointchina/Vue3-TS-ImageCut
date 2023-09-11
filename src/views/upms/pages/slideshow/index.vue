<route lang="yaml">
name: slideshow
</route>

<template>
  <div class="dept_all">
    <div class="home_search_top">
      <h1 class="page_title">轮播图管理</h1>
      <div class="button-group px-20px">
        <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
      </div>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @isFolder="isFolder" />
    <div class="home_content_wrap">
      <!--      <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp">
          <el-button
            link
            type="primary"
            size="small"
            @click="functionHandler"
            style="font-size: 14px"
            >批量操作</el-button
          >
          <el-divider direction="vertical" />
        </div>
      </div>-->
      <!-- table -->
      <div class="base_table">
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          :maxHeight="tableHeightInfo.tableHeight"
          :style="{ width: '100%' }"
          stripe
        >
          <el-table-column fixed width="55" />
          <el-table-column
            property="picTitle"
            :show-overflow-tooltip="true"
            label="图片标题"
          />
          <!--          <el-table-column
            property="picUrl"
            :show-overflow-tooltip="true"
            label="图片路径"
            width="120"
          />-->
          <el-table-column
            property="picRemark"
            :show-overflow-tooltip="true"
            label="图片备注"
          />
          <el-table-column
            property="jumpLink"
            :show-overflow-tooltip="true"
            label="跳转链接"
          />
          <el-table-column property="sort" :show-overflow-tooltip="true" label="排序" />
          <el-table-column label="图片" width="180">
            <template #default="scope">
              <el-image
                style="height: 80px; width: 80px"
                :src="scope.row.picUrl"
                :zoom-rate="1.2"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column
            property="createTime"
            :show-overflow-tooltip="true"
            label="创建时间"
          />
          <el-table-column property="status" :show-overflow-tooltip="true" label="状态">
            <template #default="scope">
              <span v-if="scope.row.status === '1'">已发布</span>
              <span v-if="scope.row.status === '2'">未发布</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="detailClick(scope.row)"
                >详情</el-button
              >
              <el-button
                v-if="scope.row.status == '2'"
                link
                type="primary"
                size="small"
                @click="modifyHandler(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="scope.row.status == '2'"
                link
                type="primary"
                size="small"
                @click="isRelease(scope.row, '1')"
                >发布</el-button
              >
              <el-button
                v-if="scope.row.status == '1'"
                link
                type="primary"
                size="small"
                @click="isRelease(scope.row, '2')"
                >撤回</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="deleteChoose(scope.row)"
                v-if="scope.row.status == '2'"
                >删除</el-button
              >
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
              @current-change="handleCurrentChange"
            />
          </el-config-provider>
        </div>
        <!-- table 查看详情 -->
        <el-dialog
          v-model="detailShow"
          title="详情"
          width="60%"
          top="15vh"
          :draggable="true"
        >
          <el-descriptions
            class="margin-top"
            :column="2"
            :size="'default'"
            :style="''"
            :border="true"
          >
            <el-descriptions-item label="图片标题" label-align="left" align="center">
              {{ detailInfo.picTitle }}
            </el-descriptions-item>
            <!--            <el-descriptions-item label="图片路径" label-align="left" align="center">
              {{ detailInfo.picUrl }}
            </el-descriptions-item>-->
            <el-descriptions-item label="跳转链接" label-align="left" align="center">
              {{ detailInfo.jumpLink }}
            </el-descriptions-item>
            <el-descriptions-item label="图片备注" label-align="left" align="center">
              {{ detailInfo.picRemark }}
            </el-descriptions-item>
            <el-descriptions-item label="排序" label-align="left" align="center">
              {{ detailInfo.sort }}
            </el-descriptions-item>
            <el-descriptions-item label="状态" label-align="left" align="center">
              {{ detailInfo.status === '1' ? '已发布' : '未发布' }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间" label-align="left" align="center">
              {{ detailInfo.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="图片" label-align="left" align="center">
              <template #default="">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="detailInfo.picUrl"
                    :zoom-rate="1.2"
                    :preview-src-list="srcList"
                    fit="cover"
                  />
                </div>
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
      </div>
      <!-- 新增/编辑 -->
      <div class="edit_page" v-if="isShowEditPageData">
        <addPage @closeRefresh="closeRefresh" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="slideshow">
  import { reactive, ref } from 'vue';
  import { ElTable, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
  import { Plus, Close } from '@element-plus/icons-vue';
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import baseSearch from './search/index.vue';
  import addPage from './add/tableAdd.vue';
  import {
    SlideshowListParams,
    SlideshowQueryParams,
  } from '/@/views/upms/model/slideshowModel';
  import {
    querySlideshow,
    delSlideshow,
    editSlideshow,
    doneeDownload,
  } from '/@/views/upms/api/slideshow';
  import { useUpmsSlideshow } from '/@/stores/modules/slideshow';
  import { isFolder as isFolderHelper } from '/@/utils/helper/elementUIHelper';
  import {
    seachGroupInfoModel,
    autoTableHeightInfoModel,
  } from '/@/api/model/commonModel';
  export default {
    name: 'SlideshowTable',
    components: { baseSearch, addPage },
    setup() {
      const useUpmsSlideshowStore = useUpmsSlideshow();
      const detailInfo = ref<SlideshowListParams>({});
      const total = ref(0);
      const detailShow = ref(false);
      const tableData = ref<SlideshowListParams[]>([]);
      // table 的 REF
      const multipleTableRef = ref<InstanceType<typeof ElTable>>();
      // table 复选框已选择的行
      const multipleSelection = ref<SlideshowListParams[]>([]);
      // table 复选框已选择的个数
      const multipleSelectionNumber = ref<number>(0);
      const isShowEditPageData = ref<boolean>(false);
      const tableHeightInfo = reactive<autoTableHeightInfoModel>({
        tableHeight: '50vh',
        seachGroupInfo: { status: false, height: '70' },
      });
      // 定义查询参数
      const queryData = ref<SlideshowQueryParams>({
        pageNum: 1,
        pageSize: 10,
        isDeleted: '',
        version: '',
        picTitle: '',
        picUrl: '',
        picRemark: '',
        jumpLink: '',
        linkType: '',
        sort: '',
        status: '',
      });
      /**
       * 定义初始化方法进入页面默认查询
       */
      const init = () => {
        getTableList(queryData.value);
      };
      init();
      /**
       *分页页数
       * @param val
       */
      const handleSizeChange = (val: number) => {
        queryData.value.pageSize = val;
        getTableList(queryData.value);
      };
      /**
       *分页页码
       * @param val
       */
      const handleCurrentChange = (val: number) => {
        queryData.value.pageNum = val;
        getTableList(queryData.value);
      };
      // table 复选框 被选取
      const handleSelectionChange = (val: SlideshowListParams[]) => {
        multipleSelection.value = val;
        multipleSelectionNumber.value = val.length;
      };
      const url = ref<string>('');
      const srcList = ref<string[]>([]);
      // 批量删除
      const deleteChoose = (row: SlideshowListParams) => {
        /* const ids: string[] = [];
        multipleSelection.value.forEach((item) => {
          ids.push(item.id as any);
        });
        if (multipleSelection.value.length == 0) {
          ElMessage({
            message: '请选择要删除的数据！',
            type: 'error',
          });
          return;
        }*/
        ElMessageBox.confirm('是否删除已选中的数据?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const loading = ElLoading.service({
            lock: true,
            text: '数据删除中...',
            background: 'rgba(0, 0, 0, 0.7)',
          });
          const idparam = { ids: [row.id] };
          delSlideshow(idparam)
            .then((res) => {
              // res 里如果有参数判断删除成功，请取值判断处理
              ElMessage({
                message: '删除成功！',
                type: 'success',
              });
              getTableList(queryData.value);
            })
            .finally(() => {
              loading.close();
            });
        });
      };
      // 发布
      const isRelease = (row: SlideshowListParams, state: string) => {
        ElMessageBox.confirm('是否确认操作?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let rows = {
            id: row.id,
            status: state,
          };
          editSlideshow(rows).then(() => {
            ElMessage({
              message: '成功！',
              type: 'success',
            });
            getTableList(queryData.value);
          });
        });
      };
      // 查看详情
      const detailClick = (row: SlideshowListParams) => {
        // 直接获取表格中的数据，或者访问后台代码
        detailInfo.value = row;
        // 下载
        // handleDownload();
        srcList.value.push(detailInfo.value.picUrl as any);
        detailShow.value = true;
      };
      const handleDownload = () => {
        doneeDownload(detailInfo.value.picUrl).then((res) => {
          let blob = new Blob([res.data]); // 返回的文件流数据
          url.value = window.URL.createObjectURL(blob); // 将他转化为路径
          srcList.value.push(url.value); // 将他转化为路径
        });
      };
      // 新增、添加
      const tableAdd = () => {
        useUpmsSlideshowStore.isEditing = false;
        useUpmsSlideshowStore.modal = 'add';
        isShowEditPageData.value = true;
      };

      // 关闭 新增/编辑 before
      const closeRefresh = (type) => {
        isShowEditPageData.value = false;
        if (type == 'submit') {
          getTableList(queryData.value);
        }
      };

      // 编辑 按钮
      const modifyHandler = (row: SlideshowListParams) => {
        useUpmsSlideshowStore.isEditing = true;
        useUpmsSlideshowStore.modal = 'modify';
        useUpmsSlideshowStore.setEditDataInfo(row);
        isShowEditPageData.value = true;
      };
      /**
       * 批量操作，有进行方法修改，没有就删除
       */
      const functionHandler = () => {
        console.log('批量操作');
      };
      /**
       * 查询方法
       * @param Data
       */
      function queryTable(Data: SlideshowQueryParams) {
        getTableList(Data);
      }
      /**
       * 列表请求
       * @param params
       */
      function getTableList(params: SlideshowQueryParams) {
        const loading = ElLoading.service({
          lock: true,
          text: '数据加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        querySlideshow(params)
          .then((res) => {
            tableData.value = res.records;
            total.value = res.total;
            queryData.value.pageSize = res.size;
            queryData.value.pageNum = res.current;
          })
          .finally(() => {
            loading.close();
          });
      }

      // ==== 添加 table 的高度自适应 begin
      const isFolder = (obj: seachGroupInfoModel = tableHeightInfo.seachGroupInfo) => {
        isFolderHelper(obj, tableHeightInfo);
      };
      isFolderHelper(tableHeightInfo.seachGroupInfo, tableHeightInfo);
      window.onresize = () => {
        isFolderHelper(tableHeightInfo.seachGroupInfo, tableHeightInfo);
      };
      return {
        ElMessageBox,
        url,
        srcList,
        isRelease,
        zhCn,
        Plus,
        Close,
        detailInfo,
        total,
        detailShow,
        tableData,
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
      };
    },
  };
</script>
<style scoped>
  @import url('/@/styles/common/admcDefaultStyle.css');
  .demo-image__error .image-slot {
    font-size: 30px;
  }
  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }
  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }
</style>
