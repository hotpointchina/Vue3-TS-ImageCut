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
export interface NoticeQueryParams {
  pageNum: number;
  pageSize: number;
  startTime?: string;
  noticeTitle?: string;
  endTime?: string;
}
/**
 * 列表实体
 */
export interface NoticeListParams {
  id?: string;
  //   noticeType?: number;
  noticeTitle?: string;
  noticeContent?: string;
  publishTime?: string;
  isRead?: string;
  //   validityTime?: string;
  //   level?: number;
  //   receiveSystem?: number;
}
/**
 * 列表分页查询实体
 */
export type NoticePageParams = BasicPageParams & {};

/**
 *列表返回实体
 */
export type NoticeResult = BasicFetchResult<NoticeListParams>;
