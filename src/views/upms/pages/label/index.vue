<route lang="yaml">
    name: label
</route>

<template>
    <div class="dept_all">
        <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
            <h1 class="page_title">标签管理</h1>
            <div class="button-group px-20px flex">
                <el-button type="primary" :icon="Plus" @click="tableAdd"> 新增 </el-button>
            </div>
        </div>

        <!-- 搜索组 -->
        <baseSearch @isFolder="isFolder" @getForm="getForm" :queryData="queryData" />

        <div class="flex flex-col w-full px-20px">
            <!-- <div class="table_controll">
                <span>已选择 {{ multipleSelectionNumber }} 项</span>
                <div class="button_grounp pl-30px">
                    <el-button link type="danger" size="small" @click="deleteChoose"
                        style="font-size: 14px">批量删除</el-button>
                </div>
            </div> -->

            <!-- table -->
            <div class="base-table">
                <el-table ref="multipleTableRef" :data="tableData.tableList" :maxHeight="tableData.tableHeight"
                    :style="{ width: '100%' }" stripe>
                    <!-- <el-table ref="multipleTableRef" :data="personnelStore.list" :maxHeight="tableHeightInfo.tableHeight"
                          :style="{ width: '100%' }" stripe @selection-change="handleSelectionChange"> -->
                    <el-table-column type="index" fixed width="55" label="序号" />
                    <el-table-column property="labelName" label="标签名称" width="200" />
                    <el-table-column property="labelLevel" label="标签级别" width="150" />
                    <el-table-column property="parentLabelName" label="上级标签名称" width="200" />
                    <el-table-column property="status" label="状态" />
                    <!-- <el-table-column property="remark" label="备注" /> -->
                    <el-table-column fixed="right" label="操作" width="300">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="modifyHandler(scope.row)">编辑</el-button>
                            <el-button link type="danger" size="small" @click="deleteHandler(scope.row)">删除</el-button>
                            <el-button link type="danger" size="small" @click="statusHandler(scope.row)">{{ scope.row.status
                                == '启用' ? '停用' : '启用' }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="py-5 flex justify-end">
                    <el-config-provider :locale="zhCn">
                        <el-pagination v-model:currentPage="queryData.pageNum" v-model:page-size="queryData.pageSize"
                            :page-sizes="tableData.pageSizeList" :small="true" :disabled="false"
                            layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"
                            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-config-provider>
                </div>
            </div>
        </div>



        <!-- 新增对话框 -->
        <div v-if="tableData.addShow">
            <el-dialog v-model="tableData.addShow" :title="tableData.title" width="40%" top="15vh" :draggable="true"
                @close="closeAddShow(ruleFormRef)">
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="84px"
                    class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-50px" size="default"
                    status-icon>
                    <el-row class="gy-form-item-row">
                        <el-form-item label="标签级别" prop="labelLevel" class="gy-form-item-col">
                            <el-radio-group v-model="ruleForm.labelLevel" @change="changeLevel"
                                :disabled="tableData.title == '编辑'">
                                <el-radio label="1">一类标签</el-radio>
                                <el-radio label="2">二类标签</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row class="gy-form-item-row" v-if="tableData.showparentLabelName">
                        <el-form-item label="上级标签名称" prop="parentLabelName" class="gy-form-item-col">
                            <el-select v-model="ruleForm.parentLabelName" placeholder="请选择上级标签">
                                <el-option v-for="item in tableData.parentLabel" :key="item.labelCode"
                                    :label="item.labelName" :value="item.labelCode" @click="changeLabel(item)" />
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row class="gy-form-item-row">
                        <el-form-item label="标签名称" prop="labelName" class="gy-form-item-col">
                            <el-input v-model="ruleForm.labelName" placeholder="请输入标签名称" />
                        </el-form-item>
                    </el-row>
                </el-form>
                <el-row class="flex justify-center w-full">
                    <el-button @click="closeDialog(ruleFormRef)">取消</el-button>
                    <el-button type="primary" @click="submitFrom(ruleFormRef)">确定</el-button>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" name="label" setup>
import { reactive, ref } from 'vue';
import { ElTable, ElMessage, ElMessageBox, ElLoading, FormRules, FormInstance } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import baseSearch from './search/index.vue';
import {
    LabelQueryParams,
    LabelListParams,
    LabelSaveParams
} from '/@/views/upms/model/label';
import { queryLabel, LabelAdd, LabelEdit, labelRemove, LabelDetail, LabelAll, editStatus } from '/@/views/upms/api/label'
type flagPage = {
    labelCode: string;
    labelName: string;
};
interface seachGroupInfoModel {
    status: boolean;
    height: string;
}
interface TableDataType {
    // table 的高度
    tableHeight: string;
    // 搜索组的状态
    seachGroupInfo: seachGroupInfoModel;
    // 数据
    tableList: LabelListParams[],
    pageNum: number;
    pageSize: number;
    total: number;
    pageSizeList: number[];
    addShow: boolean;
    title: string;
    showparentLabelName: boolean;
    parentLabel: flagPage[]
}
// table 数据
const tableData: TableDataType = reactive({
    tableHeight: '50vh',
    seachGroupInfo: { status: false, height: '70' },
    tableList: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pageSizeList: [10, 20, 30, 40, 50, 100],
    addShow: false,
    title: '新增',
    showparentLabelName: false,
    parentLabel: []
});
// 定义查询参数
const queryData = ref<LabelQueryParams>({
    pageNum: 1,
    pageSize: 10,
    labelName: '',
    parentLabelName: '',
    labelLevel: '',
})
const ruleFormRef = ref<FormInstance>();
// 新增或编辑数据
const ruleForm = ref<LabelSaveParams>({
    id: '',
    labelName: '',
    labelLevel: '',
    parentLabelName: '',
    parentLabelCode: '',
});
// 新增、添加名址表单的校验规则
const rules = reactive<FormRules>({
    labelLevel: [{ required: true, message: '请选择标签类型', trigger: 'change' }],
    labelName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
    parentLabelName: [{ required: true, message: '请选择一级标签', trigger: 'change' }]
});
const changeLevel = (value) => {

    // var parentLabelName = [{ required: true, message: '请选择一级标签', trigger: 'change' }]
    // 如果是二类标签时，显示选择一类标签
    if (value == '2') {
        tableData.showparentLabelName = true
        // rules['parentLabelName'] = parentLabelName

    } else {
        tableData.showparentLabelName = false
        // delete rules.parentLabelName
    }
}
const changeLabel = (item) => {
    ruleForm.value.parentLabelCode = item.labelCode
    ruleForm.value.parentLabelName = item.labelName
}

// ==== 添加 table 的高度自适应 begin
const isFolder = (obj: seachGroupInfoModel = tableData.seachGroupInfo) => {
    let height = {
        // body: document.body.offsetHeight,
        body: '100vh',
        subtract: 64 + 24 + 41 + 36 + 63 + 40 + parseInt(obj.height),
        str: '',
    };
    // height.str = height.body - height.subtract + '';
    height.str = `calc(${height.body} - ${height.subtract}px)`;
    tableData.tableHeight = height.str;
    tableData.seachGroupInfo = { ...obj };
};
isFolder();
window.onresize = () => {
    isFolder();
};
// ==== 添加 table 的高度自适应 begin

// table 的 REF
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
type handlerFunction<T> = (T) => void;





// 每页显示量列表点击
const handleSizeChange: handlerFunction<number> = (val: number) => {
    queryData.value.pageSize = val
    getForm(queryData.value)
};
// 点击页码
const handleCurrentChange: handlerFunction<number> = (val: number) => {
    queryData.value.pageNum = val
    getForm(queryData.value)
};

// 查询
function getForm(data: LabelQueryParams) {
    const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        background: 'rgba(255, 255, 255, 0.7)',
    });
    queryLabel(data).then(res => {
        tableData.tableList = res.records
        tableData.tableList.forEach(item => {
            if (item.status == '0') {
                item.status = '启用'
            } else {
                item.status = '停用'
            }
        })
        tableData.total = res.total
    })
    loading.close();

}


// 新增、添加
// 新增
const tableAdd = () => {
    Object.keys(ruleForm.value).forEach((key) => {
        ruleForm.value[key] = '';
    });
    tableData.title = '新增'
    tableData.addShow = true
    LabelAll().then(res => {
        tableData.parentLabel = res
    })
};

// 编辑
const modifyHandler: handlerFunction<LabelListParams> = (row: LabelListParams) => {
    LabelAll().then(res => {
        tableData.parentLabel = res
    })
    LabelDetail(row.id).then((res) => {

        Object.keys(res).forEach((key) => {
            ruleForm.value[key] = res[key];
        });
        if (ruleForm.value.labelLevel == '2') {
            tableData.showparentLabelName = true

        }
        tableData.title = '编辑'
        tableData.addShow = true;
    });
};
// 取消添加
const closeDialog = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    tableData.addShow = false
    tableData.showparentLabelName = false
}
// 关闭对话框
const closeAddShow = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    tableData.addShow = false
    tableData.showparentLabelName = false
}

// 提交 新增/编辑 表单
const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 表单校验
    await formEl.validate((valid) => {
        if (valid) {
            const loading = ElLoading.service({
                lock: true,
                text: '正在保存数据...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            if (tableData.title == '新增') {
                LabelAdd(ruleForm.value)
                    .then(() => {

                        ElMessage({
                            message: '保存成功！',
                            type: 'success',
                        });

                    })
                    .finally(() => {
                        tableData.addShow = false

                        loading.close();
                        getForm(queryData.value)
                    });
            } else {
                LabelEdit(ruleForm.value)
                    .then(() => {
                        ElMessage({
                            message: '修改成功！',
                            type: 'success',
                        });
                    })
                    .finally(() => {
                        tableData.addShow = false

                        loading.close();
                        getForm(queryData.value)
                    });
            }
        } else {
            ElMessage.error('提交校验未通过，请核对表单数据！');
        }
    });
};
// 删除
const deleteHandler: handlerFunction<LabelListParams> = (row: LabelListParams) => {
    ElMessageBox.confirm('确认删除这条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            labelRemove([row.id])
                .then(() => {
                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    });
                })
                .finally(() => {
                    getForm(queryData.value)
                });
        })
        .catch(() => ElMessage.info('已取消删除'));
};
// 修改状态
const statusHandler = (row: LabelListParams) => {
    const flagStatus = ref('')
    if (row.status == '停用') {
        flagStatus.value = '0'
    } else if (row.status == '启用') {
        flagStatus.value = '1'
    }
    const params = {
        status: flagStatus.value
    }
    ElMessageBox.confirm(`是否执行该操作？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            editStatus(row.id, params).then(() => {
                getForm(queryData.value)
            });
        })
        .catch(() => ElMessage.info(`已取消`));
}

</script>

<style scoped>
@import url('/@/styles/chinapost/admcDefaultStyle.css');

.dept_all {
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

:deep(.el-dialog__body) {
    padding-top: 0px;
}

.info-title {
    border: 1px solid #ebeef5;
    padding: 8px 11px;
    font-weight: 700;
    color: var(--el-text-color-regular);
    background: #f5f7fa;
}

.edit_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
    overflow: auto;
}

:deep(.el-checkbox-group) {
    margin-top: 20px;
    margin-left: 20px;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
    width: 16px;
    height: 16px;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
    font-size: 16px;
}

:deep(.el-checkbox__inner::after) {
    width: 6px;
    top: 1px;
    left: 4px;
}
</style>
