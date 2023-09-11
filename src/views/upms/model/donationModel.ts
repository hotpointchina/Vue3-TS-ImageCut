/*
 * @Author: zhangwanrong
 * @Date: 2022-12-13 15:34:25
 * @LastEditors: zhangwanrong
 * @LastEditTime: 2022-12-22 12:07:31
 * @Description: file content
 * @FilePath: \chinapost_charity_vue\src\views\upms\model\donationModel.ts
 */

export type editPageSubmitModal = 'add' | 'modify' | 'cancel';

/**
 * 查询实体
 */
export interface TypeQueryParams {
  pageNum?: number;
  pageSize?: number;
  activitiesCode?: string;
  id?: string;
  activitiesName?: string;
  flagStatus?: string;
  startTime: string;
  endTime: string;
  progress?: number;
}
// 列表实体
export interface ItemListParams {
  id: string;
  activitiesCode?: string;
  activitiesName?: string;
  pwoName?: string;
  activitiesStartTime?: string;
  activitiesEndTime?: string;
  activitiesRecordCode?: string;
  activitiesRecordTime?: string;
  status?: string;
  head?: string;
  phoneNumber?: string;
  headAddr?: string;
  flagStatus?: string;
  enterEndTime?: string;
  activitiesHeadAddr?: string;
  server?: string;
  createTime?: string;
  applicant?: string;
  explainn?: string;
  introduce?: string;
}
// 产品内容
export interface productSaveParams {
  projectId?: string;
  activitiesName?: string;
  // id?: string;
  productId?: number;
  productBriefCode?: string;
  productName?: string;
  productSpecs?: string;
  productPrice?: string;
  productType?: string;
  productWeight?: string;
  remark?: string;
  status?: string;
}
// 列表提交实体
export interface ItemSaveParams {
  id: string;
  activitiesCode?: string;
  activitiesName?: string;
  activitiesRecordCode?: string;
  activitiesRecordTime: string;
  activitiesStartTime: string;
  activitiesEndTime: string;
  // 启用停用
  status?: string;
  head?: string;
  phoneNumber?: string;
  headAddr?: string;
  explainn?: string;
  introduce?: string;
  activitiesMrg?: string;
  createTime?: string;
  pwoProduct: productSaveParams[];
}

// 时间轴
export interface recordType {
  id: number;
  time: string;
  // 组织
  organization: string;
  // 意见
  opinion: string;
  // 动作
  action: string;
  // 详细时间
  detailed: string;
}

