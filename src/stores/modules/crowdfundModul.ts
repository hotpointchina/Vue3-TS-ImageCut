import { defineStore } from 'pinia';
import { store } from '/@/stores';
//import * as tsModel from '/@/views/upms/model/crowdactivitiesModel';
import { actLists } from '/@/views/upms/api/activities';
import { ElLoading } from 'element-plus';
// @ts-ignore
import * as tsModel from '/@/views/upms/model/crowdactivitiesModel';

export type CrowdListParams = {
  id: string;
  activitiesMrg: string; //活动图片
  activitiesName: string; //项目名称
  activitiesRecordCode: string; //活动备案编号
  head: string; //活动负责人
  phoneNumber: string; //联系方式
  headIntroduction: string; //负责人简介
  activitiesTerm: string; //活动期限
  startTime: string; //活动开始日期
  endTime: string; //活动结束日期
  isSetTarget: string; //是否设置筹款目标
  donationTarget: string; //筹款目标
  introduce: string; //活动介绍
  explainn: string; //活动简介
  executionPlan: string; //执行计划
  budgetPlanning: string; //预算规划
  noteEnplain: string; //捐赠票据说明
  organIntroduction: string; //执行机构介绍
  surplusPropertyDispose: string; //剩余财产处置说明
  status?: string;
};

export interface CrowdState {
  pageTitle: '众筹活动申报新增' | '众筹活动申报编辑' | '众筹活动流程申请';
  list: tsModel.CrowdListParams[];
  total: number;
  // 当前页码
  pageNum: number;
  // 每页显示量
  pageSize: number;
  // 每页显示量选取列表
  pageSizeList: number[];
  editData: tsModel.CrowdSaveParams;
  //   queryInfo: queryGetListData;
  detailData: tsModel.detailMany;
  query: tsModel.CrowdManyList;
  justView: boolean;
}

export const useCrowdStore = defineStore({
  id: 'Crowd',
  state: (): CrowdState => ({
    pageTitle: '众筹活动申报新增',
    list: [],
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizeList: [10, 20, 30, 40, 50, 100],
    editData: {
      id: '',
      activitiesMrg: '', //活动图片
      activitiesName: '', //项目名称
      activitiesRecordCode: '', //活动备案编号
      activitiesRecordTime: '', //
      head: '', //活动负责人
      phoneNumber: '', //联系方式
      headIntroduction: '', //负责人简介
      activitiesTerm: '', //活动期限
      activitiesStartTime: '', //活动开始日期
      activitiesEndTime: '', //活动结束日期
      donationTarget: '', //筹款目标
      introduce: '', //活动介绍
      explainn: '', //活动简介
      executionPlan: '', //执行计划
      budgetPlanning: '', //预算规划
      organIntroduction: '', //执行机构介绍
      surplusPropertyDispose: '', //剩余财产处置说明
      flagStatus: 0,
      progress: 0,
    },
    detailData: {
      id: '',
      activitiesName: '',
      activitiesCode: '',
      progress: 0,
    },
    // 查询组件里的查询条件
    query: {
      activitiesCode: '',
      activitiesName: '',
      pageNum: 1,
      pageSize: 10,
      activitiesStartTime: '', //活动开始日期
      activitiesEndTime: '',
      flagStatus: '',
    },
    //只是查看的权限
    justView: false,
  }),
  getters: {},
  actions: {
    // 设置页面信息
    setPageInfo(obj: { pageNum: number; pageSize?: number; pageSizeList?: number[] }) {
      this.pageNum = obj.pageNum ? obj.pageNum : this.pageNum;
      this.pageSize = obj.pageSize ? obj.pageSize : this.pageSize;
      this.pageSizeList = obj.pageSizeList ? obj.pageSizeList : this.pageSizeList;
    },

    // 获取列表数据
    async getList(data?: tsModel.CrowdManyList) {
      this.query.pageNum = this.pageNum;
      this.query.pageSize = this.pageSize;
      if (data) {
        this.query = { ...data };
        this.query.pageNum = this.pageNum;
        this.query.pageSize = this.pageSize;
      }
      const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const res = await actLists(this.query);
      loading.close();
      this.list = res.records as tsModel.CrowdListParams[];
      this.total = res.total;
    },

    // 新增
    addHandler(obj: tsModel.CrowdListParams) {
      this.list = [{ ...obj }, ...this.list];
      this.readyAdd();
    },

    // 编辑
    editHandler(obj: tsModel.CrowdSaveParams) {
      this.pageTitle = '众筹活动申报编辑';
      this.editData = { ...obj };
    },
    // 捐赠详情
    detailHandler(obj: tsModel.detailMany) {
      this.detailData = { ...obj };
    },
    // 保存编辑
    saveEdited(obj: tsModel.CrowdListParams) {
      this.pageTitle = '众筹活动申报新增';
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === obj.id) {
          this.list[i] = { ...this.list[i], ...obj };
          break;
        }
      }

      Object.keys(this.editData).forEach((key) => {
        switch (typeof this.editData[key]) {
          case 'string':
            this.editData[key] = '';
            break;
          case 'number':
            this.editData[key] = 0;
            break;
        }
      });
    },

    // 批量删除
    deleteChoose(arr: tsModel.CrowdListParams[]) {
      let template = JSON.parse(JSON.stringify(this.list));
      arr.forEach((obj) => {
        template = template.filter((rowItem) => rowItem.idNumber != obj.id);
      });
      this.list = template;
      template = null;
    },

    // 清空 store
    readyAdd() {
      this.pageTitle = '众筹活动申报新增';
      Object.keys(this.editData).forEach((key) => {
        this.editData[key] = key !== 'name' ? '' : 0;
      });
    },
    // 清空 store
    repealStore() {
      this.pageTitle = '众筹活动申报新增';
      Object.keys(this.editData).forEach((key) => {
        this.editData[key] = key !== 'name' ? '' : 0;
      });
      this.list = [];
    },
  },
});

// use outside the setup
export function useCrowdStoreWithOut() {
  return useCrowdStore(store);
}
