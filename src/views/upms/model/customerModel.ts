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
export interface CustomerQueryParams {
  pageNum: number;
  pageSize: number;
  username?: string;
  nickname?: string;
}
/**
 * 列表实体
 */
export interface CustomerListParams {
  id: string;
  username?: string;
  nickname?: string;
  mobile?: string;
  provinceName?: string;
  cityName?: string;
  countyName?: string;
  addr?: string;
  email?: string;
  status?: string;
}
/**
 * 列表分页查询实体
 */
export type CustomerPageParams = BasicPageParams & {};
/**
 * 列表详情实体
 */
export interface CustomerDetailParams {
  id?: string;
  username?: string;
  password?: string;
  nickname?: string;
  avatarUrl?: string;
  mobile?: string;
  email?: string;
  provinceName?: string;
  cityName?: string;
  countyName?: string;
  addr?: string;
}
/**
 *列表返回实体
 */
export type CustomerResult = BasicFetchResult<CustomerListParams>;
