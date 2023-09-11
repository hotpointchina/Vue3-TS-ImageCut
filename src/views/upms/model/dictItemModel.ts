import { BasicPageParams } from '/@/api/model/baseModel';

/**
 * 查询实体
 */
export interface ItemQueryParams {
  pageNum: number;
  pageSize: number;
  typeCode?: string;
  name?: string;
  value?: string;
  sort?: string;
  status?: string;
}

/**
 * 列表实体
 */
export interface ItemListParams {
  id?: string;
  typeCode?: string;
  name?: string;
  value?: string;
  sort?: string;
  status?: string;
  remark?: string;
}

/**
 * 列表分页查询实体
 */
export type ItemPageParams = BasicPageParams & {};

/**
 * 列表保存提交实体
 */
export interface ItemSaveParams {
  id?: string;
  typeCode?: string;
  name?: string;
  value?: string;
  sort?: string;
  status?: string;
  remark?: string;
}
