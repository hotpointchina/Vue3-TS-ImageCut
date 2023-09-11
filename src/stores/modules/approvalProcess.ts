import { defineStore } from 'pinia';
import { store } from '/@/stores';
import {
  // 查询字典类型
  queryType,
} from '/@/views/upms/api/dictType';
import dayjs from 'dayjs';

interface formDisableListModel {
  processName?: boolean;
  businessName?: boolean;
  businessCode?: boolean;
  startPeople?: boolean;
  startOrg: boolean;
  startTime?: boolean;
  approverTime?: boolean;
  approverStatus?: boolean;
}
interface approvalProcess {
  pageTitle: string;
  // 待办、已办、我的申请，更新 table
  isFreshArray: boolean[];
  queryFormData: any;
  dictTypeList: any;
  formDisableList: formDisableListModel;
  hiddenLinesKeyArray: string[];
  taskDShowQuery: string[];
  taskYShowQuery: string[];
  taskMeShowQuery: string[];
}
export const useApprovalProcessStore = defineStore({
  id: 'approverProcess',
  state: (): approvalProcess => ({
    pageTitle: '名址流程申请',
    // 待办、已办、我的申请，更新 table
    isFreshArray: [false, false, false],
    // 查询条件
    queryFormData: {},
    // 字典列表
    dictTypeList: [],
    // 需要设置为 disable 的项目
    formDisableList: {
      processName: false,
      businessName: false,
      businessCode: false,
      startPeople: false,
      startOrg: false,
      startTime: false,
      approverTime: false,
      approverStatus: false,
    },
    hiddenLinesKeyArray: [
      // 发起人
      'startPeople',
      // 发起单位
      'startOrg',
      // 发起时间
      'startTime',
      // 审核时间
      'approverTime',
    ],
    // 待办显示的查询条件
    taskDShowQuery: [
      // 任务名称
      'businessName',
      // 任务编号
      'businessCode',
      // 任务类型
      'processName',
      // 发起单位
      'startOrg',
    ],
    // 已办显示的查询条件
    taskYShowQuery: [
      // 任务名称
      'businessName',
      // 任务编号
      'businessCode',
      // 任务类型
      'processName',
      // 状态
      'approverStatus',
      // 发起单位
      'startOrg',
      // 审核时间
      'approverTime',
    ],
    // 申请
    taskMeShowQuery: [
      // 任务名称
      'businessName',
      // 任务编号
      'businessCode',
      // 任务类型
      'processName',
      // 状态
      'approverStatus',
      // 发起时间
      'startTime',
    ],
  }),
  getters: {
    getOtherApproval() {
      return {
        type: '',
        label: '',
        prop: '',
        valueType: 'string',
        valueDefaultVal: '',
        placeholder: '',
        options: [],
      };
    },
  },
  actions: {
    // 整理时间信息
    formatTime(date: Date) {
      return dayjs(date).format('YYYY-MM-DD') + ' 23:59:59';
    },
    // 获取字典列表
    async getDictTypeList() {
      let res: any = null;
      try {
        res = await queryType({
          pageNum: 1,
          pageSize: 100,
          name: '',
          code: '',
          status: '',
        });
        if (Array.isArray(res.records) && res.records.length > 0) {
          const arr = res.records.map((it) => {
            return {
              label: it.name,
              value: it.id,
            };
          });
          this.dictTypeList = JSON.parse(JSON.stringify(arr));
        }
      } catch (error) {
        !error && console.log(error);
      }
    },
    // 设置 是否进行请求
    setIsFreshArrayTrue() {
      this.isFreshArray = [true, true, true];
    },
    // 审批记录的状态
    getRecordStatus(str: string) {
      switch (str) {
        case '0':
          return '驳回';
        case '1':
          return '通过';
        case '2':
          return '提交';
      }
    },
    // table列表的状态
    getApprovalOpintion(str: string) {
      switch (str) {
        case '0':
          return '未提交';
        case '1':
          return '审核中';
        case '2':
          return '已驳回';
        case '3':
          return '已审核';
      }
    },
    // 审批、驳回、审批记录 - 顶部按钮控制
    getShowButtonHandler(status: string, boolean: string, from = '') {
      if (from == 'd' && boolean == 'false') {
        return ['approval', 'reject'];
      }
      if (from == 'y' && boolean == 'false') {
        return [];
      }
      if (from == 'me' && boolean == 'false') {
        return [];
      }
      if (status == '2' && boolean == 'true') {
        return ['abolish'];
      }
      return boolean == 'true' ? [] : ['approval', 'reject'];
    },
  },
});

// use outside the setup
export function useApproverProcessStoreWithOut() {
  return useApprovalProcessStore(store);
}
