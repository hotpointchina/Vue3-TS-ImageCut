import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * 查询实体
 */
export interface announcementQueryParams {
  id?: string;
  noticeTitle?: string;
  noticeContent?: string;
  publishTime?: string;
  textType?: string;
}
/**
 * 列表实体
 */
export interface announcementListParams {
  id: number;
  activitiesName?: string;
  activitiesCode?: string;
  status?: string;
  flagStatus?: string;
  activitiesRecordCode?: string;
}

/**
 *列表返回实体
 */
export type ActivitiesResult = BasicFetchResult<announcementQueryParams>;
