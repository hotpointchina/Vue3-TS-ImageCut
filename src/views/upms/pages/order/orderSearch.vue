<template>
  <div ref="searchGroup" class="search_group">
    <el-form
      ref="queryFormRef"
      :model="queryForm"
      :rules="rules"
      label-width="6em"
      class="
       flash_form
       flex flex-col
       px-20px
       pt-20px
       overflow-hidden
       transition-all
       ease-linear
       duration-300"
      :style="{ height: searchStatus.rowHeight }"
      size="default" status-icon>
      <el-row class="justify-between items-start">
        <el-col :span="5">
          <el-form-item label="订单号" prop="orderCode" class="search-form-item">
            <el-input v-model="queryForm.orderCode" placeholder="请输入订单号" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="活动名称" prop="activitiesName" class="search-form-item">
            <el-input v-model="queryForm.activitiesName" placeholder="请输入活动名称">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="商品名称" prop="productName" class="search-form-item">
            <el-select v-model="queryForm.productName" placeholder="请输入商品名称">
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="受捐人" prop="receivedPeople" class="search-form-item">
            <el-select v-model="queryForm.receivedPeople" placeholder="请输入受捐人">
            </el-select>
          </el-form-item>
        </el-col>
<!--        <el-col :span="5">-->
<!--          <el-form-item label="付款方式" prop="payType" class="search-form-item">-->
<!--            <el-select v-model="queryForm.payType" placeholder="请选择付款方式" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          <el-form-item label="下单时间" prop="orderTime" class="search-form-item">-->
<!--            <el-date-picker v-model="queryForm.orderTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"-->
<!--                            placeholder="请选下单时间" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          <el-form-item label="签收时间" prop="receivedTime" class="search-form-item">-->
<!--            <el-date-picker v-model="queryForm.receivedTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"-->
<!--                            placeholder="请选择签收时间" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          <el-form-item label="订单状态" prop="orderStatus" class="search-form-item">-->
<!--            <el-input v-model="queryForm.orderStatus" placeholder="请选择订单状态" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="4" class="flex flex-row justify-end items-start">

          <el-button type="primary" @click="submitForm(queryFormRef)">查询</el-button>
          <el-button @click="resetForm(queryFormRef)">重置</el-button>
          <span v-show="searchStatus.show" class="flex flex-row justify-start items-center ml-8px">
            <el-button type="default" link @click="folder">
              {{searchStatus.title}}
              <DArrowRight ref="DArrowRightEL" :style="{
                  width: '1em',
                  height: '1em',
                  marginLeft:'7px',
                  color: '#18AE66',
                  transition:'all 0.3s ease',
                  transform: searchStatus.iconRotate,
              }" />
            </el-button>
          </span>
        </el-col>
      </el-row>
      <el-row class="justify-start items-start">
                <el-col :span="5">
                  <el-form-item label="付款方式" prop="payType" class="search-form-item">
                    <el-select v-model="queryForm.payType" placeholder="请选择付款方式" >
                      <el-option
                        v-for="item in payOptions"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
        <el-col :span="10">
          <el-form-item label="捐赠时间" prop="orderTime" class="search-form-item">
            <el-date-picker
              v-model="queryForm.orderTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              format="YYYY-MM-DD  HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="defaultcreateTime"
              placeholder="请选择创建时间"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="5">-->
<!--          <el-form-item label="捐赠开始时间" prop="orderStartTime" class="search-form-item">-->
<!--            <el-date-picker-->
<!--              v-model="queryForm.orderStartTime"-->
<!--              type="datetime"-->
<!--              format="YYYY-MM-DD HH:mm:ss"-->
<!--              value-format="YYYY-MM-DD HH:mm:ss"-->
<!--              :disabled-date="disabledChoose"-->

<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          <el-form-item label="捐赠结束时间" prop="orderEndTime" class="search-form-item">-->
<!--            <el-date-picker-->
<!--              v-model="queryForm.orderEndTime"-->
<!--              type="datetime"-->
<!--              format="YYYY-MM-DD HH:mm:ss"-->
<!--              value-format="YYYY-MM-DD HH:mm:ss"-->

<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
                <el-col :span="5">
                  <el-form-item label="订单状态" prop="orderStatus" class="search-form-item">
                    <el-select v-model="queryForm.orderStatus" placeholder="请选择订单状态" >
                    <el-option
                      v-for="item in flagStatusOptions"
                      :label="item.name"
                      :value="item.value"
                    />
                    </el-select>
                  </el-form-item>
                </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script lang="ts" setup name="baseSearch">
import { onMounted, reactive, ref, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { DArrowRight } from '@element-plus/icons-vue'
import {Order, OrderQuery} from "/@/views/upms/model/orderModel";
import {queryList} from "/@/views/upms/api/dictItem";
import dayjs from "dayjs";

const emit = defineEmits(['isFolder', 'queryTable']);
//接受数据
const props = defineProps(['queryData']);

const queryFormRef = ref<FormInstance>()
//赋值
const queryForm = ref<OrderQuery>({
  ...props.queryData
})
const defaultcreateTime = ref([
  new Date(2000,1,1,0,0,0),
  new Date(2000,2,1,23,59,59)
])

/**
 * 有必输校验就加，没有就删除
 */
const rules = reactive<FormRules>({
  gmtCreated: [
    { required: true, message: '请选择创建日期', trigger: 'change' },
  ],
  gmtModified: [
    { required: true, message: '请选择修改日期', trigger: 'change' },
  ],
})

const  parseDate = (date, format = 'YYYY-MM-DD HH:mm:ss')=> {
  return dayjs(date).format(format)
}
/**
 * 查询方法
 * @param formEl
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {

      queryForm.value.orderStartTime = parseDate(queryForm.value.orderTime[0] );
      queryForm.value.orderEndTime = parseDate(queryForm.value.orderTime[1]);
      // 返回查询实体
      emit('queryTable', queryForm.value);
    } else {
      //校验不通过处理，根据需求补充
      console.log('error submit!', fields)
    }
  })
}

type flagPage = {
  name: string;
  value: string;
};
const flagStatusOptions = ref<flagPage[]>([]);
//查询状态字典
const queryStatus = () => {
  queryList('orderStatus').then((res) => {
    flagStatusOptions.value = res.data;
  });
};

const payOptions = ref<flagPage[]>([]);
//查询状态字典
const payType = () => {
  queryList('payType').then((res) => {
    payOptions.value = res.data;
  });
};

/**
 * 重置清空方法
 * @param formEl
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  emit('queryTable', queryForm.value);
}
/**
 * 不需要改动
 */
const searchGroup = ref();
/**
 * 不需要改动
 */
const searchStatus = reactive({
  fold: true,
  show: false,
  title: '展开',
  rowHeight: '70px',
  iconRotate: 'rotate(90deg)'
});
/**
 * dome元素，不需要改动
 */
interface formEl {
  wrap: HTMLElement | null,
  row: HTMLElement[] | null,
  rowNumber: number,
  firstRow: number,
  standerHeight: number,
  fullHeight: string,
}
/**
 * 不需要改动
 */
const formEl: formEl = {
  wrap: null,
  row: null,
  rowNumber: 1,
  firstRow: 70,
  standerHeight: 50,
  fullHeight: ''
};
/**
 * 不需要改动
 */
onMounted(() => {
  formEl.wrap = searchGroup.value.querySelector('.el-form') as HTMLElement;
  formEl.row = Array.from(searchGroup.value.querySelectorAll('.el-form .el-row'));
  formEl.rowNumber = formEl.row.length;
  formEl.fullHeight = ((formEl.rowNumber - 1) * formEl.standerHeight + formEl.firstRow) + 'px';

  if (formEl.rowNumber > 1) {
    searchStatus.title = '展开';
    searchStatus.fold = true;
    searchStatus.show = true;
  }
  queryStatus();
  payType();
});
/**
 * 展开 or 收起，不需要改动
 */
// 展开 or 收起
const folder = () => {
  if (searchStatus.fold) {
    searchStatus.fold = false;
    searchStatus.rowHeight = formEl.fullHeight;
    searchStatus.iconRotate = 'rotate(-90deg)';
    searchStatus.title = '折叠';
  } else {
    searchStatus.fold = true;
    searchStatus.rowHeight = '70px';
    searchStatus.iconRotate = 'rotate(90deg)';
    searchStatus.title = '展开';
  }
  emit(
    'isFolder',
    {
      status: searchStatus.fold,
      height: searchStatus.rowHeight
    }
  );
};
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
  width: 106px !important;
  padding: 0 16px 0 6px;
  line-height: 15px;
  justify-content: flex-end;
}
</style>
