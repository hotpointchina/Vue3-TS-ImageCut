import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * 列表实体
 */
export interface CrowdListParams {
  id: string;
  // activitiesId: string;
  activitiesCode: string; //项目编号
  activitiesName: string; //项目名称
  pwoName: string; //公益组织名称
  explainn: string; //活动简介
  flagStatus: string; //审批状态
  status: string; //状态
  donationFunded: string; //已筹善款
  donationNumber: string; //捐款人数
  activitiesRecordCode?: string; //活动备案编号
  activitiesType?: string; //捐赠类型
  createTime?: any;
  isSetTarget?: string;
  progress: number;
}
/**
 * 列表分页查询实体
 */
export type ReceivePageParams = BasicPageParams & {};

/**
 * 列表保存提交实体
 */
export interface CrowdSaveParams {
  id: string;
  activitiesMrg: string; //活动图片
  activitiesName: string; //项目名称
  activitiesRecordCode: string; //活动备案编号
  activitiesRecordTime: string;
  head: string; //活动负责人
  phoneNumber: string; //联系方式
  headIntroduction: string; //负责人简介
  activitiesTerm: string; //活动期限
  activitiesEndTime: string; //活动结束日期
  activitiesStartTime: string; //活动开始日期
  endTime?: string;
  startTime?: string;
  donationTarget: string; //筹款目标
  introduce: string; //活动介绍
  explainn: string; //活动简介
  executionPlan: string; //执行计划
  budgetPlanning: string; //预算规划
  organIntroduction: string; //执行机构介绍
  surplusPropertyDispose: string; //剩余财产处置说明
  flagStatus?: number;
  createTime?: any;
  msgCode?: string;
  progress?: number;
  spreadImage?: string;
}
/**
 * 显示新增/修改页面
 */
export type editPageSubmitModal = 'add' | 'modify' | 'cancel';
/**
 *列表返回实体
 */
export type ReceiveResult = BasicFetchResult<CrowdListParams>;

// 查询组类型
export interface CrowdManyList {
  activitiesCode?: string;
  activitiesName?: string;
  pageNum: number;
  pageSize: number;
  activitiesStartTime: string;
  activitiesEndTime: string;
  createTime?: any;
  flagStatus?: string;
  status?: string;
}
//记录
export interface recordType {
  id: string;
  checkName?: string;
  checkOpinion?: string;
  checkStatus?: string;
  createTime?: string;
  approverOrg: string;
  approverOpinion: string;
  approverResult: string;
}
//捐赠详情
export interface detailMany {
  id: string;
  activitiesName: string;
  activitiesCode: string;
  progress: number;
}
