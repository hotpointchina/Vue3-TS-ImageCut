<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">订单管理</h1>
    </div>
    <!-- 搜索组 -->
    <baseSearch :queryData="queryData" @queryTable="queryTable" @getTableList="getTableList" />

    <div class="flex flex-col w-full px-20px">
      <div class="table_controll">
        <span>已选择 {{ multipleSelectionNumber }} 项</span>
        <div class="button_grounp pl-30px">
          <el-button
            link
            type="primary"
            size="small"
            @click="tableExport"
            style="font-size: 14px"
          >批量导出</el-button>

          <el-divider direction="vertical" />

        </div>
      </div>
      <!-- table -->
      <div class="base-table">
        <el-table ref="multipleTableRef" :data="tableData" :maxHeight="tableHeight"  stripe
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" fixed  />
          <el-table-column property="orderCode" :show-overflow-tooltip="true" label="订单号" />
          <el-table-column property="activitiesName" :show-overflow-tooltip="true" width="80" label="活动名称" />
          <el-table-column property="receivedPeople" :show-overflow-tooltip="true" width="80" label="受捐人" />
          <el-table-column property="receivedPhone" :show-overflow-tooltip="true" label="手机号" />
<!--          <el-table-column property="receivedAddr" :show-overflow-tooltip="true" label="受捐人地址" />-->
          <el-table-column property="productName" :show-overflow-tooltip="true" label="商品名称" />
          <el-table-column property="orderType" :show-overflow-tooltip="true" label="类型" >
            <template #default="scope">
              <span v-if="scope.row.orderType === '1'">捐款</span>
              <span v-if="scope.row.orderType === '2'">捐物</span>
            </template>
          </el-table-column>
          <el-table-column property="productPrice" :show-overflow-tooltip="true" label="捐赠金额" />
          <el-table-column property="payType" :show-overflow-tooltip="true" label="付款方式" >
            <template #default="scope">
              <span v-if="scope.row.payType === '1'">微信</span>
              <span v-if="scope.row.payType === '2'">支付宝</span>
            </template>
          </el-table-column>
          <el-table-column property="orderTime" :show-overflow-tooltip="true" label="捐赠时间" />
<!--          <el-table-column property="receivedTime" :show-overflow-tooltip="true" label="签收时间" />-->
          <el-table-column property="orderStatus" :show-overflow-tooltip="true" label="订单状态" >

            <template #default="scope">
              <span v-if="scope.row.orderType === '2'">
                  <span v-if="scope.row.orderStatus === '1'">待发货</span>
                  <span v-if="scope.row.orderStatus === '2'">已发货</span>
                  <span v-if="scope.row.orderStatus === '3'">运输中</span>
                  <span v-if="scope.row.orderStatus === '4'">派送中</span>
                  <span v-if="scope.row.orderStatus === '5'">已签收</span>
              </span>
              <span v-if="scope.row.orderType === '1'">
                  <span v-if="scope.row.orderStatus === '0'"></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="detailClick(scope.row)">查看</el-button>
              <el-button link type="primary" size="small" v-if="scope.row.orderType == '2'" @click="checkMail(scope.row)"  >物流信息轨迹</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="py-5 flex justify-end">
          <el-config-provider :locale="zhCn">
            <el-pagination v-model:currentPage="queryData.pageNum" v-model:page-size="queryData.pageSize"
                           :page-sizes="[50, 100, 500, 1000]" :small="true" :disabled="false"
                           layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" />
          </el-config-provider>
        </div>

        <el-dialog
          v-model="mailShow"
          width="30%"
          top="15vh"
          title="物流轨迹"
          :draggable="true"
        >
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in logisticStatus"
              :key="index"
              :timestamp="item.opTime"
            >
              {{ item.opDesc }}
            </el-timeline-item>
          </el-timeline>
        </el-dialog>
        <!-- table 查看详情 -->
        <el-dialog v-model="detailShow" title="订单详情" width="60%" top="15vh" :draggable="true">
          <el-descriptions class="margin-top" :column="2" :size="'default'" :style="''" :border="true">
            <el-descriptions-item label="订单号" label-align="left" align="center">
              {{ detailInfo.orderCode }}
            </el-descriptions-item>
            <el-descriptions-item label="活动名称" label-align="left" align="center">
              {{ detailInfo.activitiesName }}
            </el-descriptions-item>
            <el-descriptions-item label="受捐人" label-align="left" align="center">
              {{ detailInfo.receivedPeople }}
            </el-descriptions-item>
            <el-descriptions-item label="捐赠人" label-align="left" align="center">
              {{ detailInfo.donationPeople }}
            </el-descriptions-item>
            <el-descriptions-item label="受捐人手机号" label-align="left" align="center">
              {{ detailInfo.receivedPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="捐赠人手机号" label-align="left" align="center">
              {{ detailInfo.donationPhone }}
            </el-descriptions-item>
<!--            <el-descriptions-item label="受捐人地址" label-align="left" align="center">-->
<!--              {{ detailInfo.receivedAddr }}-->
<!--            </el-descriptions-item>-->
            <el-descriptions-item label="商品名称" label-align="left" align="center">
              {{ detailInfo.productName }}
            </el-descriptions-item>
            <el-descriptions-item label="数量" label-align="left" align="center">
              {{ detailInfo.productNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="价格(元)" label-align="left" align="center">
              {{ detailInfo.productPrice }}
            </el-descriptions-item>
            <el-descriptions-item label="付款方式" label-align="left" align="center">
              {{ detailInfo.payType }}
            </el-descriptions-item>
            <el-descriptions-item label="捐赠时间" label-align="left" align="center">
              {{ detailInfo.orderTime }}
            </el-descriptions-item>
<!--            <el-descriptions-item label="签收时间" label-align="left" align="center">-->
<!--              {{ detailInfo.receivedTime }}-->
<!--            </el-descriptions-item>-->
            <el-descriptions-item label="订单状态" label-align="left" align="center">
              {{ detailInfo.orderStatus }}
            </el-descriptions-item>

          </el-descriptions>
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="user">
import { ref, onMounted } from 'vue';
import { ElTable } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
// 实体
import {
  OrderQuery,
  Order,
} from '/@/views/upms/model/orderModel';


import baseSearch from './orderSearch.vue';
const mailShow = ref(false);
// api
import { getList,detail,exportOrder,checkQuery} from '/@/views/upms/api/order';
import {queryList} from "/@/views/upms/api/dictItem";
/**table数据实体*/
const tableData = ref<OrderQuery[]>([]);
//详情实体
const detailInfo = ref<Order>({});
const total = ref(0);
// 详情dilog
const detailShow = ref(false);

const exportShow = ref(false);

const tableHeight = ref(String);
// table 的 REF
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
// table 复选框已选择的个数
const multipleSelectionNumber = ref<number>(0);
const multipleSelection = ref<TableListType[]>([]);
// 定义查询参数
const queryData = ref<OrderQuery>({
  pageNum: 1,
  pageSize: 10,
  orderCode: '',   //订单号
  productName:'',   //商品名称
  activitiesName: '',     //活动名称
  receivedPeople:'',    // 受捐人
  payType:'',   //付款方式
  orderTime:'',   //下单时间
  receivedTime:'',   //签收时间
  orderStatus:'',
  orderType:'',
})

type logistic = {
  opDesc: string;
  opTime: string;
};
//物流
const logisticStatus = ref<logistic[]>([]);

/**
 * 定义初始化方法进入页面默认查询
 */
onMounted(() => {
  getTableList(queryData.value);
  checkMail;
  tableExport;

})

const checkMail = (row) => {
  checkQuery(row.id).then((res) => {
    logisticStatus.value = res.data.result;
  });
  mailShow.value = true;
};

/**
 *控制页面显示条数
 *
 */
const handleSizeChange = (val: number) => {
  queryData.value.pageSize = val;
  getTableList(queryData.value);
}
/**
 *
 * 控制页面页数
 */
const handleCurrentChange = (val: number) => {
  queryData.value.pageNum = val;
  getTableList(queryData.value);
}
/**
 *
 * 复选框选取数据id数组
 */
var list = ref([
  { orderId: '' }
])
const handleSelectionChange = (val) => {
  multipleSelectionNumber.value = val.length
  multipleSelection.value = val
  list.value = []
  for (let i = 0; i < val.length; i++) {
    list.value.push(val[i].orderId)
  }
};
/**
 *查看详情
 *
 */
const detailClick = (row: Order) => {
  // 直接获取表格中的数据，或者访问后台代码
  detailInfo.value = row;
  detailShow.value = true;
};

// 导出
const tableExport = () => {
  let template: string[] = []
  multipleSelection.value.forEach(obj => {
    template.push(''+obj.id)
  });
  console.log('template: ',template)
  const idArray = { ids: template }
  if (template.length !== 0) {
    ElMessageBox.confirm('确认导出吗?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        console.log('template: ',template)
        exportOrder(template).then(res => {
          if (res.status === 200) {
            console.log('res: ',res)
            resolveBlob(res)
          }
          ElMessage({
            message: '导出成功',
            type: 'success',
          })
        })
      })
      .catch(() => ElMessage.info('已取消导出'))
  } else {
    ElMessage({
      message: '请选择要导出的数据',
      type: 'warning',
    })
  }

}
// 创建a标签
function resolveBlob(response) {
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  });
  const a = document.createElement('a');
  const href = window.URL.createObjectURL(blob); // 下载的链接
  a.href = href;
  a.download = decodeURI(
    response.headers['content-disposition'].split(';')[1].split('=')[1]
  ); // 获取后台设置的文件名称
  document.body.appendChild(a);
  a.click(); // 点击导出
  document.body.removeChild(a); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}

/**
 * 查询方法
 * @param Data
 */
function queryTable(Data: OrderQuery) {
  queryData.value = Data;
  getTableList(queryData.value);
}
/**
 * 列表请求
 * @param params
 */
function getTableList(params: OrderQuery) {
  console.log('已查询' + params)
  getList(queryData.value).then(res => {
    console.log(res)
    tableData.value = res.records
    total.value = res.total
  })
}

/**
 * 创建打印数据源
 *
 */
const printData = ref('');
/**
 * 打印环节
 */
//获取本机打印机信息和模板信息
var options = ref([{
  label: '',
  value: ''
}
])

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
  background: #18AE66;
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
  background: #F1F7F7 none;
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
</style>
