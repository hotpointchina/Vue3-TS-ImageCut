<template>
    <div ref="searchGroup" class="search_group">
        <el-form ref="ruleFormRef" :model="queryForm" label-width="6em"
            class="flash_form flex flex-col px-20px pt-20px overflow-hidden transition-all ease-linear duration-300"
            :style="{ height: searchStatus.rowHeight }" size="default" status-icon>
            <el-row class="items-start" :locale="zhCn">
                <el-col :span="5">
                    <el-form-item label="标签名称" prop="labelName" class="search-form-item">
                        <el-input v-model="queryForm.labelName" placeholder="请输入" />
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="标签级别" prop="labelLevel" class="search-form-item">
                        <el-select v-model="queryForm.labelLevel" placeholder="请选择">
                            <el-option v-for="dict in labelLevelList" :key="dict.value" :label="dict.name"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="上级标签名称" prop="parentLabelName" class="search-form-item">
                        <el-input v-model="queryForm.parentLabelName" placeholder="请输入" />
                    </el-form-item>
                </el-col>
                <el-col :span="7" class="flex flex-row justify-end items-center">
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
import { LabelQueryParams } from '/@/views/upms/model/label';
import { queryList } from '/@/views/upms/api/doneeDecla';
const emit = defineEmits(['isFolder', 'getForm', 'handleQuery']);
const props = defineProps(['queryData']);
const ruleFormRef = ref<FormInstance>()
const queryForm = ref<LabelQueryParams>({
    ...props.queryData
})
type flagPage = {
    name: string;
    value: string;
};
const labelLevelList = ref<flagPage[]>([]);
const changeGroup = () => {
    queryList('labelLevel').then((res) => {
        labelLevelList.value = res.data
    });

};
// 查询
const submitForm = () => {
    emit('getForm', queryForm.value)
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    submitForm()
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
    changeGroup()
    submitForm()
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
    width: 110px !important;
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
