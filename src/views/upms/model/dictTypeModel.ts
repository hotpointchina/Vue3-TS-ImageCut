import { BasicPageParams } from '/@/api/model/baseModel';

/**
 * 查询实体
 */
export interface TypeQueryParams {
  pageNum: number;
  pageSize: number;
  id?: string;
  name?: string;
  code?: string;
  status?: string;
}

/**
 * 列表实体
 */
export interface TypeListParams {
  id?: string;
  name?: string;
  code?: string;
  status?: string;
  remark?: string;
}

/**
 * 列表分页查询实体
 */
export type TypePageParams = BasicPageParams & {};

/**
 * 列表保存提交实体
 */
export interface TypeSaveParams {
  id?: string;
  name?: string;
  code?: string;
  status?: string;
  remark?: string;
}
