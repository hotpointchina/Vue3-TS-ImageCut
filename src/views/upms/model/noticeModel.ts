/*
 * @Author: 作者
 * @Date: 创建日期
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
 */
import { BasicPageParams } from '/@/api/model/baseModel';
/**
 * 查询实体
 */
export interface NoticeQueryParams {
  pageNum: number;
  pageSize: number;
  createTime?: any;
  noticeType?: string;
  noticeTitle?: string;
  startTime?: string;
  endTime?: string;
  receiveSystem?: number;
  validityTime?: string;
}
/**
 * 列表实体
 */
export interface NoticeListParams {
  id?: string;
  noticeType?: number;
  textType?: string;
  noticeTitle?: string;
  noticeContent?: string;
  startTime?: string;
  validityTime?: string;
  level?: number;
  receiveSystem?: number;
  remark?: string;
  status?: string;
}
/**
 * 列表分页查询实体
 */
export type NoticePageParams = BasicPageParams & {
}
/**
 * 列表保存提交实体
 */
export interface NoticeSaveParams {
  remark?: string;
  textType?: string;
  noticeTitle?: string;
  noticeContent?: string;
  startTime?: string;
  validityTime?: string;
  level?: number;
  receiveSystem?: number;
}
/**
 *列表返回实体
 */
export interface NoticeFabuParams {
  id?: string;
  status?: string;
};
