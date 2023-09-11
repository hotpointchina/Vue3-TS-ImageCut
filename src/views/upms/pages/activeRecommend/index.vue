<template>
    <div class="dept_all">
        <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
            <h1 class="page_title">推荐管理</h1>
            <div class="button-group px-20px flex">
                <el-button type="primary" :icon="Plus" @click="Add"> 新增 </el-button>
            </div>
        </div>

        <div class="flex flex-col w-full px-20px">
            <!-- table -->
            <div class="base-table">
                <el-table ref="multipleTableRef" :data="tableData" :maxHeight="400" :style="{ width: '100%' }" stripe >
                    <el-table-column property="businessTitle" label="活动名称" />
                    <el-table-column property="businessType" label="活动类型" />
                    <el-table-column property="isEnable" label="活动启用状态" />
                    <el-table-column property="flagStatus" label="活动当前状态" />
                    <el-table-column property="status" label="推荐状态" />
                    <!-- <el-table-column property="businessUrl" label="活动链接" width="200px" /> -->
                    <el-table-column fixed="right" label="操作" width="240">
                        <template #default="scope">
                                <el-button link type="primary" size="small" @click="Look(scope.row)"
                                    v-show="!(scope.row.sort == '0')">置顶</el-button>
                                <el-button link type="primary" size="small" @click="upSend(scope.row)"
                                    v-show="!(scope.row.status == '启用')">启用</el-button>
                                <el-button link type="primary" size="small" @click="upStop(scope.row)"
                                    v-show="!(scope.row.status == '停用')">停用</el-button>
                                <el-button link type="danger" size="small" @click="Delete(scope.row)"
                                    v-show="(scope.row.status == '停用')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 新增/编辑 -->
        <div>
            <el-dialog v-model="detailAdd" title="新增" width="50%" top="15vh" :draggable="true">
                <el-form ref="ruleFormRef" :model="ruleForm" label-width="84px" :rules="rules"
                    class="gy-form flex flex-row flex-wrap justify-start item-start w-full pb-50px ml-70px mt-20px"
                    size="default" status-icon>
                    <el-form-item label="活动类型" prop="businessType" class="w-600px mr-40px">
                        <el-select v-model="ruleForm.businessType" placeholder="请选择排序" @change="Change">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推广活动" prop="businessTitle" class="w-600px mr-40px">
                        <el-select v-model="ruleForm.businessTitle" filterable clearable placeholder="请输入推荐活动名称"
                            @change="Change1">
                            <el-option v-for="item in Business" :key="item.value" :label="item.label" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="助困人标识" class="w-600px mr-40px" v-show="ifPerson">
                        <el-input v-model="ruleForm.idCard" disabled />
                    </el-form-item>
                    <el-row class="flex justify-center w-full mr-200px">
                        <el-form-item>
                            <el-button @click="cancelAdd">取消</el-button>
                            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                            <el-button type="primary" @click="submitAdd(ruleFormRef)">确认</el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
    
<script lang="ts" name="personnel" setup>
import { ref, reactive, onMounted } from 'vue';
import {
    ElTable, ElMessage, ElMessageBox, FormInstance, FormRules
} from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getData, getActive, deleteData, pushData, addData, setTop, getActiveName } from '/@/views/upms/api/activeRecommend'

/**table接口 */
interface tableDataI {
    index?: string;
    id?: string;
    businessId?: string;
    businessType?: string;
    businessTitle?: string;
    businessContent?: string;
    businessUrl?: string;
    spreadImage?: string;
    sort?: string;
    status?: string;
    idCard?: string;
    flagStatus?: string;
    isEnable?: string;

}
interface selectOptions {
    value: string;
    label: string;
    activitiesType: string;
}
/**实体 */
const tableData = ref<tableDataI[]>([{}])
const detailAdd = ref(false)
const ifPerson = ref(false)
const ruleForm = ref<tableDataI>({});
const ruleFormRef = ref<FormInstance>();
const Business = ref<selectOptions[]>([])
const options = reactive<selectOptions[]>([
    {
        value: '1',
        label: '众筹',
        activitiesType: ''
    },
    {
        value: '2',
        label: '助困',
        activitiesType: ''
    },

])
const rules = reactive<FormRules>({
    businessType: [
        { required: true, message: '请选择活动类型', trigger: 'change', },
    ],
    businessTitle: [
        { required: true, message: '请选择活动名称', trigger: 'change', },
    ],
    businessUrl: [
        { required: true, message: '请填写活动路径', trigger: 'blur' },
    ],
})

/**初始化 */
onMounted(() => {
    get();

})
/**函数区域 */
function get() {
    getData().then((res) => {
        console.log(res)
        tableData.value = res
        for (var i = 0; i < tableData.value.length; i++) {
            if (tableData.value[i].status == "0") {
                tableData.value[i].status = '停用'
            } else {
                tableData.value[i].status = '启用'
            };
            if (tableData.value[i].isEnable == "0") {
                tableData.value[i].isEnable = '启用'
            } else {
                tableData.value[i].isEnable = '停用'
            };
            if (tableData.value[i].businessType == "1") {
                tableData.value[i].businessType = '众筹'
            } else {
                tableData.value[i].businessType = '助困'
            };
            switch(tableData.value[i].flagStatus){
                case"0" :
                tableData.value[i].flagStatus = '待提交'
                break
                case"1" :
                tableData.value[i].flagStatus = '审核中'
                break
                case"2" :
                tableData.value[i].flagStatus = '已驳回'
                break
                case"3" :
                tableData.value[i].flagStatus = '已通过'
                break
                case"4" :
                tableData.value[i].flagStatus = '已撤回'
                break
                case"5" :
                tableData.value[i].flagStatus = '待发布'
                break
                case"6" :
                tableData.value[i].flagStatus = '已发布'
                break
                case"7" :
                tableData.value[i].flagStatus = '已结束'
                break
            }
        }
    })
}
function getbusiness() {
   var val = {
        flagStatus:'6'
    }
    getActive(val).then((res) => {
        console.log(res)
        Business.value = res
        for (var i = 0; i < res.length; i++) {
            Business.value[i].value = res[i].id
            Business.value[i].label = res[i].activitiesName
            Business.value[i].activitiesType = '1'
        }
    })
}
function getbusinessName() {
    getActiveName().then((res) => {
        console.log(res)
        Business.value = res
        for (var i = 0; i < res.length; i++) {
            Business.value[i].value = res[i].id
            Business.value[i].label = res[i].doneeName
            Business.value[i].activitiesType = '2'
        }
    })
}
function Add() {
    detailAdd.value = true
    ruleForm.value = {}
}
function Change(item) {
    if (item == '1') {
        getbusiness()
        ifPerson.value = false
    } else {
        getbusinessName()
        ifPerson.value = true
    }
}
function Change1(item) {
    ruleForm.value.businessId = item.value
    ruleForm.value.businessTitle = item.label
    if (item.activitiesType == '1') {
        ruleForm.value.businessContent = item.explainn
        ruleForm.value.spreadImage = item.spreadImage[0]
    } else {
        ruleForm.value.spreadImage = item.suggestMsg[0]
        ruleForm.value.businessContent = item.doneeexplainn
        ruleForm.value.idCard = item.idCard
    }


}
const submitAdd = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            addData(ruleForm.value).finally(() => {
                detailAdd.value = false
                ruleForm.value = {}
                get();
            });
        } else {
            console.log('提交失败', fields)
        }
    })
}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

function Look(val) {
    ElMessageBox.confirm(
        '确认置顶推荐该活动吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            setTop(val.id).then(() => {
                ElMessage({
                    type: 'success',
                    message: '已置顶',
                })
            }).finally(() => { get(); })
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function Delete(val: tableDataI) {
    var id = val.id
    ElMessageBox.confirm(
        '确认删除该推荐活动吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deleteData(id).then(() => {
                ElMessage({
                    type: 'success',
                    message: '已删除',
                })
            }).catch(
                (err) => {
                    console.log(err)
                }
            ).finally(
                () => {
                    get();
                }
            )

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function upSend(val: tableDataI) {
    var par = {
        id: val.id as string,
        status: '1'
    };
    ElMessageBox.confirm(
        '确认发布该推荐活动吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            pushData(par).then(() => {
                ElMessage({
                    type: 'success',
                    message: '已发布',
                })
            }).finally(() => {
                get();
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function upStop(val: tableDataI) {
    var par = {
        id: val.id as string,
        status: '0'
    };
    ElMessageBox.confirm(
        '确认停用该推荐活动吗?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            pushData(par).then(() => {
                ElMessage({
                    type: 'success',
                    message: '已停用',
                })
            }).finally(() => {
                get();
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}
function cancelAdd() {
    detailAdd.value = false
    ruleForm.value = {}
}
</script>
    
<style scoped>
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

.left {
    float: left;
}
</style>
    