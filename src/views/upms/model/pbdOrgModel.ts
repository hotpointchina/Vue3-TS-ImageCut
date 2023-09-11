import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * 查询实体
 */
export interface OrgQueryParams {
  id?: string;
  pageNum: number;
  pageSize: number;
  provinceName?: string;
  provinceCode?: string;
  cityName?: string;
  cityCode?: string;
  countyName?: string;
  countyCode?: string;
  orgCode?: string;
  orgName?: string;
  parentOrgCode?: string;
  parentOrgName?: string;
  status?: string;
  orgLevel?: string;
}

/**
 * 列表实体
 */
export interface OrgListParams {
  id: string;
  provinceName?: string;
  provinceCode?: string;
  cityName?: string;
  cityCode?: string;
  countyName?: string;
  countyCode?: string;
  addr?: string;
  orgCode?: string;
  orgName?: string;
  parentOrgCode?: string;
  parentOrgName?: string;
  head?: string;
  status?: string;
  orgLevel?: string;
  phoneNumber?: string;
}
/**
 * 列表分页查询实体
 */
export type OrgPageParams = BasicPageParams & {};

/**

 * 列表保存提交实体

 */

export interface OrgSaveParams {
  id?: string;
  provinceName?: string;
  provinceCode?: string;
  cityName?: string;
  cityCode?: string;
  countyName?: string;
  countyCode?: string;
  addr?: string;
  head?: string;
  phoneNumber?: string;
  orgName?: string;
  orgCode?: string;
  status?: string;
  orgLevel?: string;
  parentOrgCode?: string;
  parentOrgName?: string;
}

/**

 *列表返回实体

 */

export type OrgResult = BasicFetchResult<OrgListParams>;
