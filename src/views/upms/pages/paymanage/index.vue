<template>
    <div class="dept_all">
        <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
            <h1 class="page_title">支付绑定管理</h1>
            <div class="button-group px-20px">
                <el-button type="primary" :icon="Plus" @click="Add"> 新增 </el-button>
            </div>
        </div>
        <div class="flex flex-col w-full px-20px">
            <!-- table -->
            <div class="base-table">
                <el-table ref="multipleTableRef" :data="table" :style="{ width: '100%' }" stripe height="400">
                    <el-table-column property="mchId" :show-overflow-tooltip="true" label="商户" />
                    <el-table-column property="privateKey" :show-overflow-tooltip="true" label="商户秘钥" />
                    <el-table-column property="paymentMode" :show-overflow-tooltip="true" label="授权模式" />
                    <el-table-column property="apiv3Key" :show-overflow-tooltip="true" label="状态" />
                    <el-table-column fixed="right" label="操作" width="220">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="look(scope.row)">授权</el-button>
                            <!-- <el-button link type="primary" size="small" @click="stoPay(scope.row)">停用</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div>
            <el-dialog v-model="PayImage" title="授权链接" width="40%" top="15vh" :draggable="true">
                <p>
                    <span>授权链接</span> <span>{{ url }}</span>
                </p>
            </el-dialog>
        </div>

        <!-- 新增 -->
        <div>
            <el-dialog v-model="add" title="授权模式" width="30%" top="15vh" :draggable="true">
                <p>
                    <el-radio-group v-model="radio" class="ml-4">
                        <el-radio label="0" size="large">微信</el-radio>
                        <el-radio label="1" size="large">支付宝</el-radio>
                    </el-radio-group>
                </p>
                <el-row class="flex justify-center w-full ml-140px">
                    <el-button @click="addClose">取消</el-button>
                    <el-button type="primary" @click="addSubmit">确定</el-button>
                </el-row>
            </el-dialog>
            <!-- 微信授权 -->
            <el-dialog v-model="WXPower" title="微信授权" width="35%" top="15vh" :draggable="true">
                <el-form label-width="100px" :model="formLabelAlign" :rules="rules" style="max-width: 460px">
                    <el-form-item label="APPID"  prop="appid">
                        <el-input v-model="formLabelAlign.appid" />
                    </el-form-item>
                    <el-form-item label="商户号"  prop="mchId">
                        <el-input v-model="formLabelAlign.mchId" />
                    </el-form-item>
                    <el-form-item label="商户秘钥"  prop="privateKey">
                        <el-input v-model="formLabelAlign.privateKey" />
                    </el-form-item>
                </el-form>
                <el-row class="flex justify-center w-full ml-140px">
                    <el-button @click="WXClose">取消</el-button>
                    <el-button type="primary" @click="WXSubmit">确定</el-button>
                </el-row>
            </el-dialog>
            <!-- 支付宝授权 -->
            <el-dialog v-model="ZFBPower" title="支付宝授权" width="35%" top="15vh" :draggable="true">
                <el-form label-width="100px" :model="formLabelAlign" :rules="rules" style="max-width: 460px">
                    <el-form-item label="APPID"  prop="appid">
                        <el-input v-model="formLabelAlign.appid" />
                    </el-form-item>
                    <el-form-item label="商户号"  prop="mchId">
                        <el-input v-model="formLabelAlign.mchId" />
                    </el-form-item>
                    <el-form-item label="商户秘钥"  prop="privateKey">
                        <el-input v-model="formLabelAlign.privateKey" />
                    </el-form-item>
                </el-form>
                <el-row class="flex justify-center w-full ml-140px">
                    <el-button @click="ZFBClose">取消</el-button>
                    <el-button type="primary" @click="ZFBSubmit">授权</el-button>
                </el-row>
            </el-dialog>
        </div>

    </div>
</template>

<script lang="ts" setup name="user">
import { ref, reactive, onMounted } from 'vue';
import { ElTable,FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue';
import { Table, addData } from '/@/views/upms/api/payManage';


/**interface */
interface payData {
    id?: string;
    user?: string;
    paymentMode?: string;
    apiv3Key?: string;
    url?: string;
    status?: string;
    privateKey?: string;
    mchId?: string;
    appid?: string;
    domain?: string;
    index?: number;
}
interface params {
    pageNum?: string;
    pageSize?: string;
}
interface addPay {
    paymentMode?: string;
    privateKey?: string;
    mchId?: string;
    appid?: string;
    domain?: string;
}
/* 实体**/
const url =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
const formLabelAlign = reactive<addPay>({
    paymentMode: '',
    privateKey: '',
    mchId: '',
    appid: '',
    domain: '',
})
// /**table数据实体*/
const table = ref<payData[]>([{ id: '1' }]);
const param = ref<params>({
    "pageNum": "1",
    "pageSize": "10"
});
const add = ref(false)
const WXPower = ref(false)
const ZFBPower = ref(false)
const PayImage = ref(false)
const radio = ref('0')
const rules = reactive<FormRules>({
    appid: [
        { required: true, message: '请输入appid', trigger: 'blur' },
    ],
    mchId: [
        { required: true, message: '请输入商户号', trigger: 'blur' },
    ],
    privateKey: [
        { required: true, message: '请输入商户密钥', trigger: 'blur' },
    ]
})
onMounted(() => {
    searchTable();
})
/**查询 */
function searchTable() {
    Table(param.value).then((res) => {
        table.value = res.records
        console.log(table.value)
        for (let i = 0; i < table.value.length; i++) {
            if (table.value[i].paymentMode == '0') {
                table.value[i].paymentMode = '微信'
            } else {
                table.value[i].paymentMode = '支付宝'
            }
        }
    })
}
/**新增 */
function Add() {
    add.value = true;
}
/**查看 */
function look(row) {
    PayImage.value = true;
    console.log(row)
}
/**启用 */
function addSubmit() {
    if (radio.value == '0') {
        WXPower.value = true
        formLabelAlign.paymentMode = '微信'
    } else {
        ZFBPower.value = true
        formLabelAlign.paymentMode = '支付宝'
    }
}
function addClose() {
    add.value = false;
}
function WXSubmit() {
    WXPower.value = false
    add.value = false;
    addData(formLabelAlign).then(() => {
        ElMessageBox.confirm(
            '是否进行信息授权?',
            '提示',
            {
                cancelButtonText: '取消',
                confirmButtonText: '确认',
                type: 'warning',
            }).then(() => {
                WXPower.value = false
                PayImage.value = true;
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消',
                })
            })
    }).finally(() => {
        searchTable();
    });

}
function WXClose() {
    WXPower.value = false;
}
function ZFBSubmit() {
    ZFBPower.value = false;
    add.value = false;
    addData(formLabelAlign);
}
function ZFBClose() {
    ZFBPower.value = false;
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
