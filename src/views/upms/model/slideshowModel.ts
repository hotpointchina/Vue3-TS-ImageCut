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
export interface SlideshowQueryParams {
  pageNum: any;
  pageSize: any;
  isDeleted?: string;
  version?: string;
  picTitle?: string;
  picUrl?: string;
  picRemark?: string;
  jumpLink?: string;
  linkType?: string;
  sort?: string;
  status?: string;
}
/**
 * 列表实体
 */
export interface SlideshowListParams {
  id?: number;
  isDeleted?: number;
  version?: number;
  picTitle?: string;
  picUrl?: string;
  picRemark?: string;
  jumpLink?: string;
  linkType?: string;
  sort?: number;
  status?: string;
}
/**
 * 列表分页查询实体
 */
export type SlideshowPageParams = BasicPageParams & {
}
/**
 * 列表保存提交实体
 */
export interface SlideshowSaveParams {
  id?: number;
  createTime?: string;
  updateBy?: number;
  updateTime?: string;
  isDeleted?: number;
  version?: number;
  picTitle?: string;
  picUrl?: string;
  picRemark?: string;
  jumpLink?: string;
  linkType?: string;
  sort?: number;
  status?: string;
  createBy?: number;
}
/**
 *列表返回实体
 */
export type SlideshowResult = BasicFetchResult<SlideshowListParams>;
