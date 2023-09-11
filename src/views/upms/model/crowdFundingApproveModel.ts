/*
 * @Author: 作者
 * @Date: 创建日期
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
 */
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * 查询实体
 */
export interface ActivitiesQueryParams {
  pageNum: number;
  pageSize: number;
  activitiesStartTime?: string;
  activitiesEndTime?: string;
  activitiesName?: string;
  activitiesCode?: string;
  status?: string;
  flagStatus?: string;
  activitiesRecordCode?: string;
}
/**
 * 列表实体
 */
export interface ActivitiesListParams {
  id: number;
  activitiesName?: string;
  activitiesCode?: string;
  status?: string;
  flagStatus?: string;
  activitiesRecordCode?: string;
  activitiesType?: string;
  activitiesTerm?: string;
  createTime?: string;
}
/**
 * 列表分页查询实体
 */
export type ActivitiesPageParams = BasicPageParams & {
}
/**
 * 列表保存提交实体
 */
export interface ActivitiesDetailParams {
  activitiesStartTime?: string;
  activitiesEndTime?: string;
  head?: string;
  headAddr?: string;
  phoneNumber?: string;
  activitiesHeadAddr?: string;
  introduce?: string;
  explainn?: string;
  activitiesName?: string;
  applicant?: string;
  headIntroduction?: string;
  donationNumber?: number;
  isSetTarget?: string;
  donationTarget?: string;
  activitiesMrg?: string;
  activitiesTerm?: string;
  executionPlan?: string;
  budgetPlanning?: string;
  pwoId?: number;
  noteEnplain?: string;
  organIntroduction?: string;
  surplusPropertyDispose?: string;
  pwoName?: string;
  activitiesCode?: string;
  status?: string;
  flagStatus?: string;
  activitiesRecordCode?: string;
  activitiesRecordTime?: string;
  spreadImage?: string[];
  activitiesMrgList?: string[];
  idCard?: string;
  idCardMsg?: string[]
}
/**
 *列表返回实体
 */
export type ActivitiesResult = BasicFetchResult<ActivitiesListParams>;
