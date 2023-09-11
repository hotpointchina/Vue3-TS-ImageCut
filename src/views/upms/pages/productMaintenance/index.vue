<template>
    <div class="dept_all">
        <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
            <h1 class="page_title">商品维护</h1>
            <div class="button-group px-20px">
                <el-button type="primary" :icon="Plus" @click="add"> 新增 </el-button>
            </div>
        </div>
        <!-- 搜索组 -->
        <productSearch :queryData="queryData" @searchValue="searchTable" />

        <div class="flex flex-col w-full px-20px">
            <div class="table_controll">
                <span>已选择 {{ multipleSelectionNumber }} 项</span>
                <el-button link type="danger" size="small" style="font-size: 14px; color: red; margin-left: 20px"
                    @click="DeleteList">批量删除</el-button>
            </div>
            <div class="base-table">
                <el-table ref="multipleTableRef" :data="tableDate" :style="{ width: '100%' }" stripe height="430px"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column property="wareCode" :show-overflow-tooltip="true" label="商品编号" />
                    <el-table-column property="wareName" :show-overflow-tooltip="true" label="商品名称" />
                    <el-table-column property="wareBrand" :show-overflow-tooltip="true" label="品牌" />
                    <el-table-column property="wareTypes" :show-overflow-tooltip="true" label="商品类型" />
                    <el-table-column property="stackTime" :show-overflow-tooltip="true" label="上架时间" />
                    <el-table-column property="state" :show-overflow-tooltip="true" label="状态" />
                    <el-table-column fixed="right" label="操作" width="240">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="Look(scope.row)">查看</el-button>
                            <el-button link type="primary" size="small" @click="Edit(scope.row)">编辑</el-button>
                            <el-button link type="primary" size="small" @click="Start(scope.row)"
                                v-show="!(scope.row.state == '启用')">启用</el-button>
                            <el-button link type="primary" size="small" @click="Stop(scope.row)"
                                v-show="!(scope.row.state == '停用')">停用</el-button>
                            <el-button link type="danger" size="small" @click="Delete(scope.row)">删除</el-button>
                            <el-button link type="primary" size="small" @click="Specs(scope.row)">规格</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="py-5 flex justify-end">
                    <el-config-provider :locale="zhCn">
                        <el-pagination v-model:currentPage="queryData.pageNum" v-model:page-size="queryData.pageSize"
                            :page-sizes="[10, 15, 20, 50]" :small="true" :disabled="false"
                            layout="total,sizes,prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" />
                    </el-config-provider>
                </div>
                <!-- 详情 -->
                <el-dialog v-model="detailShow" title="记录" width="60%" top="15vh" :draggable="true">
                    <el-descriptions :column="2" :size="'default'" :border="true">
                        <el-descriptions-item label="商品编号" width="150px" label-align="left" align="center">
                            {{ detailInfo.wareCode }}
                        </el-descriptions-item>
                        <el-descriptions-item label="商品名称" width="150px" label-align="left" align="center">
                            {{ detailInfo.wareName }}
                        </el-descriptions-item>
                        <el-descriptions-item label="商品介绍" :span="4" label-align="left" align="center">
                            {{ detailInfo.wareIntroduce }}
                        </el-descriptions-item>
                        <el-descriptions-item label="品牌" label-align="left" align="center">
                            {{ detailInfo.wareBrand }}
                        </el-descriptions-item>
                        <el-descriptions-item label="适用年龄" label-align="left" align="center">
                            {{ detailInfo.suitAge }}
                        </el-descriptions-item>
                        <el-descriptions-item label="创建时间" label-align="left" align="center">
                            {{ detailInfo.createTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="变更时间" label-align="left" align="center">
                            {{ detailInfo.updateTime }}
                        </el-descriptions-item>
                        <el-descriptions-item label="宣传图" label-align="left" align="center">
                            <el-image style="width: 100px; height: 100px" :src="detailInfo.wareMsg" :zoom-rate="1.2"
                                :preview-src-list="detailInfo.wareMsg" :initial-index="4" fit="cover" />
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions>
                        <el-descriptions-item>
                            <el-table ref="multipleTableRef" :data="detailInfoWares" border :style="{ width: '100%' }"
                                :header-cell-style="{ background: '#f5f7fa', color: '#606266', textAlign: 'center' }"
                                :cell-style="{ textAlign: 'center' }">
                                <el-table-column property="wareSpecs" :show-overflow-tooltip="true" label="商品规格" />
                                <el-table-column property="wareSku" :show-overflow-tooltip="true" label="SKU" />
                                <el-table-column property="state" :show-overflow-tooltip="true" label="状态" />
                                <el-table-column property="warePrice" :show-overflow-tooltip="true" label="价格" />
                                <el-table-column property="wareUnit" :show-overflow-tooltip="true" label="单位" />
                            </el-table>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-dialog>
                <!-- 规格 -->
                <el-dialog v-model="detailSpecs" title="规格维护" width="60%" top="15vh" :draggable="true">
                    <div>
                        <div style="padding-bottom: 20px;">
                            <el-table ref="multipleTableRef" :data="specsDate" :style="{ width: '100%' }" stripe>
                                <el-table-column property="wareSpecs" :show-overflow-tooltip="true" label="商品规格" />
                                <el-table-column property="wareSku" :show-overflow-tooltip="true" label="SKU" />
                                <el-table-column property="state" :show-overflow-tooltip="true" label="状态" />
                                <el-table-column property="warePrice" :show-overflow-tooltip="true" label="价格" />
                                <el-table-column property="wareUnit" :show-overflow-tooltip="true" label="单位" />
                                <el-table-column fixed="right" label="操作">
                                    <template #default="scope">
                                        <el-button link type="primary" size="small"
                                            @click="StopSpecsDate(scope.row)">停用</el-button>
                                        <el-button link type="danger" size="small"
                                            @click="DeleteSpecsDate(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div style="padding-bottom: 10px;">
                            <el-button type="primary" :icon="Plus" @click="addSpecsDate"> 添加 </el-button>
                        </div>
                        <div style="overflow:auto;">
                            <div style="padding-bottom: 10px;" v-show="specsDateIF">
                                <el-table ref="multipleTableRef" :data="specsDateAdd" :style="{ width: '100%' }"
                                    height="200" stripe>
                                    <el-table-column property="wareSpecs" label="商品规格">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.wareSpecs" placeholder="请输入商品规格" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column property="wareSku" label="SKU">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.wareSku" placeholder="请输入商品SKU" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column property="warePrice" label="价格">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.warePrice" placeholder="请输入商品价格" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column property="wareUnit" label="单位">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.wareUnit" placeholder="请输入商品单位" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed="right" label="操作">
                                        <template #default="scope">
                                            <el-button link type="danger" size="small"
                                                @click="specsDateDelete(scope.$index)">删除行</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div style="float: right;">
                                <el-button @click="specsDateCancel">取消</el-button>
                                <el-button type="primary" @click="specsDateAddSumit(specsDateAdd)">确认</el-button>
                            </div>
                        </div>
                    </div>

                </el-dialog>
                <!-- 停用 -->
                <el-dialog v-model="detailStop" title="停用" width="40%" top="15vh" :draggable="true">
                    <div style="overflow: auto;">
                        <p>
                            <el-input v-model="textarea" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                                placeholder="请输入停用原因" />
                        </p>
                        <br>
                        <div style="float: right">
                            <el-button @click="cancelStop">取消</el-button>
                            <el-button type="primary" @click="SubmitStop" v-show="(stopTitle == '商品')">确认</el-button>
                            <el-button type="primary" @click="SubmitStop2" v-show="!(stopTitle == '商品')">确认</el-button>
                        </div>
                    </div>

                </el-dialog>
            </div>
            <!-- 新增/编辑页面加载 -->
            <div class="edit_page" v-if="detailAdd">
                <productAdd @cancel="cancel" />
            </div>
            <div class="edit_page" v-if="detailEdit">
                <productEdit :MSG="MSGID" @cancel="cancel" />
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup name="user">
import { ref, onMounted } from 'vue';
import { ElTable, ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import productSearch from './productSearch.vue';
import { Plus } from '@element-plus/icons-vue';
import { tableDataI, searchI, specsDataI, detailI } from './product';
import { getData, getById, deleteData, deleteListData, startOrEndData, specsAddData, specsDeleteData, specsStartOrEndData } from '/@/views/upms/api/productMaintenance';
import productAdd from './add/add.vue'
import productEdit from './edit/index.vue'



/** interface*/
interface itemI {
    id?: string;
    status?: string;
    reason?: string;
}
/** 实体*/
const queryData = ref<searchI>({
    pageNum: 1,
    pageSize: 10,
    wareName: '',
    wareType: '',
    status: '',
    startTime: '',
    endTime: ''
});
const tableDate = ref<tableDataI[]>([])
const detailInfo = ref<detailI>({})
const detailInfoWares = ref<specsDataI[]>([])
const specsDate = ref<specsDataI[]>([])
const specsDateAdd = ref<specsDataI[]>([])
const specsID = ref('');
const MSGID = ref('');
const total = ref(0);
const multipleSelection = ref<tableDataI[]>([])
const multipleSelectionNumber = ref<number>(0)
const detailShow = ref(false);
const detailStop = ref(false);
const detailSpecs = ref(false);
const detailAdd = ref(false);
const detailEdit = ref(false);
const textarea = ref('');
const stopItem = ref<itemI>({});
const stopTitle = ref('');
const specsDateIF = ref(false);

/** 函数区*/

const handleSizeChange = (val: number) => {
    queryData.value.pageSize = val;
    getTableList(queryData.value);
};
const handleCurrentChange = (val: number) => {
    queryData.value.pageNum = val;
    getTableList(queryData.value);
};
const handleSelectionChange = (val: tableDataI[]) => {
    multipleSelection.value = val
    multipleSelectionNumber.value = val.length;
}
onMounted(() => {
    getTableList(queryData.value);
})

function getTableList(val) {
    const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        background: 'rgba(255, 255, 255, 0.7)',
    });
    getData(val).then(
        (res) => {
            console.log(res)
            tableDate.value = res.records
            total.value = res.records.length
            var str = ''
            var type = ''
            for (var i = 0; i < tableDate.value.length; i++) {
                str = tableDate.value[i].status as string;
                type = tableDate.value[i].wareType as string;
                if (str == '0' && str != null) {
                    tableDate.value[i].state = '启用'
                } else {
                    tableDate.value[i].state = '停用'
                };
                switch (type) {
                    case '1':
                        tableDate.value[i].wareTypes = '日用品'
                        break;
                    case '2':
                        tableDate.value[i].wareTypes = '学具'
                        break;
                    case '3':
                        tableDate.value[i].wareTypes = '食品'
                        break;
                    case '4':
                        tableDate.value[i].wareTypes = '衣物'
                        break;
                    case '5':
                        tableDate.value[i].wareTypes = '其他'
                        break;
                };

            }
        }
    ).finally(() => { loading.close(); })

}
function searchTable(Data: searchI) {
    getTableList(Data);
}

function add() {
    detailAdd.value = true
}
function cancel(val) {
    detailAdd.value = val
    detailEdit.value = val
    getTableList(queryData.value);
}
function Look(val) {
    detailShow.value = true
    getById(val.id).then((res) => {
        detailInfo.value = res;
        var type = detailInfo.value.suitAge;
        switch (type) {
            case '1':
                detailInfo.value.suitAge = '0~12岁'
                break;
            case '2':
                detailInfo.value.suitAge = '12~20岁'
                break;
            case '3':
                detailInfo.value.suitAge = '20~30岁'
                break;
            case '4':
                detailInfo.value.suitAge = '30岁以上'
                break;
        };
        detailInfoWares.value = res.waresInfo;
        var str = ''
        for (var i = 0; i < detailInfoWares.value.length; i++) {
            str = detailInfoWares.value[i].status as string;
            if (str == '0' && str != null) {
                detailInfoWares.value[i].state = '启用'
            } else {
                detailInfoWares.value[i].state = '停用'
            };


        }

    })
}
function Edit(val) {
    detailEdit.value = true
    MSGID.value = val.id
    console.log(val)
}
function Delete(val) {
    let id = val.id
    ElMessageBox.confirm(
        '确认删除该商品吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            deleteData(id).then(() => {
                ElMessage({
                    type: 'success',
                    message: '已删除',
                })
            }).finally(() => { getTableList(queryData.value) })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function DeleteList() {
    ElMessageBox.confirm(
        '确认删除该商品吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            let ids = [1]
            for (var i = 0; i < multipleSelection.value.length; i++) {
                ids[i] = multipleSelection.value[i].id as number
            }
            var obj = { 'ids': ids }
            deleteListData(obj).then(() => {
                ElMessage({
                    type: 'success',
                    message: '已删除',
                })
            }).finally(() => { getTableList(queryData.value) })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function Specs(val) {
    detailSpecs.value = true
    specsDate.value = []
    specsDateAdd.value = []
    specsID.value = val.id
    getById(val.id).then((res) => {
        specsDate.value = res.waresInfo
        var str1 = ''
        for (var i = 0; i < specsDate.value.length; i++) {
            str1 = specsDate.value[i].status as string;
            if (str1 == "0" && str1 != null) {
                specsDate.value[i].state = '启用'
            } else {
                specsDate.value[i].state = '停用'
            }
        }
    })
}
function StopSpecsDate(val) {
    stopItem.value.id = val.id
    ElMessageBox.confirm(
        '确认停用该商品规格吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            detailStop.value = true
            stopTitle.value = '规格'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}

function DeleteSpecsDate(val) {
    specsDeleteData(val.id)
}
function addSpecsDate() {
    specsDateAdd.value.push({ index: '1' })
    specsDateIF.value = true
}
function specsDateDelete(val) {
    specsDateAdd.value.splice(val, 1)
}
function specsDateAddSumit(val) {
    for (var i = 0; i < val.length; i++) {
        val[i].wareId = specsID.value
    }
    var obj = { 'infoList': val }
    specsAddData(obj).then(() => {
        getTableList(queryData.value);
    }).finally(() => {
        detailSpecs.value = false

    })
}
function specsDateCancel() {
    detailSpecs.value = false
}
function Start(val) {
    ElMessageBox.confirm(
        '确认启用该商品吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            stopItem.value.id = val.id
            stopItem.value.reason = textarea.value
            stopItem.value.status = '0'
            startOrEndData(stopItem.value).then(() => {
                stopItem.value = {}
                ElMessage({
                    type: 'success',
                    message: '已启用',
                })
            }).finally(() => { getTableList(queryData.value) })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function Stop(val) {
    stopItem.value.id = val.id
    ElMessageBox.confirm(
        '确认停用该商品吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            detailStop.value = true
            textarea.value = ''
            stopTitle.value = '商品'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function cancelStop() {
    detailStop.value = false
    stopItem.value = {}
}
function SubmitStop() {
    stopItem.value.reason = textarea.value
    stopItem.value.status = '1'
    startOrEndData(stopItem.value).then(() => {
        stopItem.value = {}
        detailStop.value = false
    }).finally(() => { getTableList(queryData.value) })
}
function SubmitStop2() {
    stopItem.value.reason = textarea.value
    stopItem.value.status = '1'
    specsStartOrEndData(stopItem.value).then(() => {
        stopItem.value = {}
        detailStop.value = false
    }).catch(() => { }).finally(() => { getTableList(queryData.value) })
}
</script>
<style scoped>
.dept_all {
    width: 100%;
    height: calc(100vh - 60px);
    padding: 29px 24px;
}

.page_title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    color: #33344a;
    font-weight: bold;
}

.page_title::before {
    content: ' ';
    display: block;
    width: 4px;
    height: 18px;
    margin: 0 9px 0 0;
    padding: 0;
    background: #18ae66;
}

/* table */
.gy-form :deep(.el-select),
.gy-form :deep(.el-input-number) {
    width: 100%;
}

.gy-form :deep(.el-textarea__inner) {
    max-height: 300px;
}

.table_controll {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 36px;
    margin: 0 0 4px 0;
    padding: 11px 17px;
    background: #f1f7f7 none;
    box-sizing: border-box;
}

.table_list_status {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
}

.table_list_status::before {
    content: ' ';
    display: block;
    width: 6px;
    height: 6px;
    margin: 0 6px 0 0;
    padding: 0;
    border: 0;
    border-radius: 6px;
}

.table_list_status.success::before {
    background-color: #67c23a;
}

.table_list_status.danger::before {
    background-color: #e14040;
}

.drawer_title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* margin-bottom:29px; */
    padding: 23px 36px 24px 36px;
    background-color: #fff;
    border-bottom: 1px solid #e8e8e8;
    color: #33344a;
    font-size: 18px;
    line-height: 28px;
    font-weight: normal;
    font-style: normal;
    box-sizing: border-box;
}

.drawer_title svg {
    color: #cdcdcd;
}

.edit_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
    overflow-y: auto;
}
</style>
  