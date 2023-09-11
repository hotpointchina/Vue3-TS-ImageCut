<template>
    <div ref="searchGroup" class="search_group">
        <el-form ref="ruleFormRef" :model="ruleForm" label-width="6em"
            class="flash_form flex flex-col px-20px pt-20px overflow-hidden transition-all ease-linear duration-300"
            :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
            <el-row class="items-start" :locale="zhCn">
                <el-col :span="5">
                    <el-form-item label="公益组织" prop="pwoName" class="search-form-item">
                        <el-select v-model="ruleForm.pwoName" placeholder="请选择" clearable @clear="clearPwo">
                            <el-option v-for="item in pwoList" :key="item.value" :label="item.label" :value="item.label"
                                @click="changePwo(item)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="角色" prop="role" class="search-form-item">
                        <el-select v-model="ruleForm.role" placeholder="请选择" clearable @clear="clearRole">
                            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.label"
                                @click="changeRole(item)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="人员名称" prop="nickname" class="search-form-item">
                        <el-input v-model="ruleForm.nickname" placeholder="请输入" v-on:keyup.enter.native="submit" clearable
                            @clear="clearNickname" />
                    </el-form-item>
                </el-col>
                <el-col :span="9" class="flex flex-row justify-end items-center">
                    <el-button type="primary" @click="submitForm">查询</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script lang="ts" setup name="baseSearch">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { onMounted, reactive, ref, defineEmits } from 'vue'
import type { FormInstance } from 'element-plus'
import { Userparams, pwoParams, roleParams } from '/@/views/upms/model/basePersonnal';
import { queryOrganize, getAllRole } from '/@/views/upms/api/personnal'
const emit = defineEmits(['isFolder', 'getForm', 'handleQuery']);
const ruleFormRef = ref<FormInstance>()
const ruleForm: Userparams = reactive({
    nickname: '',
    pwoName: '',
    pwoId: '',
    role: '',
    roleId: ''
})

// 查询
const submitForm = () => {
    const deleteData = { ...ruleForm }
    delete deleteData.role
    delete deleteData.pwoName
    emit('getForm', { ...deleteData })
}
// 清空公益组织
const clearPwo = () => {
    ruleForm.pwoId = ''
    ruleForm.pwoName = ''
    submitForm()
}
// 清空角色
const clearRole = () => {
    ruleForm.role = ''
    ruleForm.roleId = ''
    submitForm()
}
// 清空人员名称
const clearNickname = () => {
    ruleForm.nickname = ''
    submitForm()
}
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    ruleForm.pwoId = ''
    ruleForm.roleId = ''
    submitForm()
}
// 回车事件
const submit = () => {
    submitForm()
}

const pwoList = ref<pwoParams[]>([])
// 公益组织查询
const getPwo = () => {
    queryOrganize().then(res => {
        if (res.status === 200) {
            pwoList.value = res.data.result
        }
    })
}
const roleList = ref<roleParams[]>([])
// 角色查询
const getRole = () => {
    getAllRole().then(res => {
        if (res.status === 200) {
            roleList.value = res.data.result
        }
    })
}
const changePwo = (item) => {
    ruleForm.pwoId = item.value
}
const changeRole = (item) => {
    ruleForm.roleId = item.value
}
const searchGroup = ref();
const searchStatus = reactive({
    fold: true,
    show: false,
    title: '展开',
    rowHeight: '70px',
    iconRotate: 'rotate(90deg)'
});

interface formEl {
    wrap: HTMLElement | null,
    row: HTMLElement[] | null,
    rowNumber: number,
    firstRow: number,
    standerHeight: number,
    fullHeight: string,
}
const formEl: formEl = {
    wrap: null,
    row: null,
    rowNumber: 1,
    firstRow: 70,
    standerHeight: 50,
    fullHeight: ''
};

onMounted(() => {
    submitForm()
    getPwo()
    getRole()
    formEl.wrap = searchGroup.value.querySelector('.el-form') as HTMLElement;
    formEl.row = Array.from(searchGroup.value.querySelectorAll('.el-form .el-row'));
    formEl.rowNumber = formEl.row.length;
    formEl.fullHeight = ((formEl.rowNumber - 1) * formEl.standerHeight + formEl.firstRow) + 'px';

    if (formEl.rowNumber > 1) {
        searchStatus.title = '展开';
        searchStatus.fold = true;
        searchStatus.show = true;
    }
});


// 展开 or 收起
// const folder = () => {
//     if (searchStatus.fold) {
//         searchStatus.fold = false;
//         searchStatus.rowHeight = formEl.fullHeight;
//         searchStatus.iconRotate = 'rotate(-90deg)';
//         searchStatus.title = '折叠';
//     } else {
//         searchStatus.fold = true;
//         searchStatus.rowHeight = '70px';
//         searchStatus.iconRotate = 'rotate(90deg)';
//         searchStatus.title = '展开';
//     }
//     emit(
//         'isFolder',
//         {
//             status: searchStatus.fold,
//             height: searchStatus.rowHeight
//         }
//     );
// };
</script>

<style scoped>
.search-form-item:deep(.el-select.el-select--default),
.search-form-item:deep(.el-input-number.el-input-number--default) {
    width: 100%;
}

.search-form-item:deep(.el-form-item__label) {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 90px !important;
    padding: 0 16px 0 6px;
    line-height: 15px;
    justify-content: flex-end;
}

.search-form-item:deep(.el-input__prefix) {
    display: none;
}

/* .search-form-item:deep(.el-input__suffix){
    display: none;
  } */
/* .search-form-item:deep(.el-input__inner) {
    font-size: 14px;
} */

.search-form-item:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
    width: 100%;
}
</style>
