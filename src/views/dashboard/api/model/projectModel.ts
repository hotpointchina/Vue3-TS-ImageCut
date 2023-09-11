import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface ProjectListItem {
  id: string;
  projectAlias: string;
  projectName: string;
  createdDate: string;
  lastModifiedDate: string;
  description?: string;
}

export type getProjectPramas = BasicPageParams & {
  tenantId?: string;
};
export interface addupdateProject {
  id?: string | number;
  projectName: string;
  projectAlias: number | string;
  description?: string;
  tenantId?: string;
  adminId: string;
  version?: string;
}
/**
 * @description: Request list return value
 */
export type ProjectListGetResultModel = BasicFetchResult<ProjectListItem> & {
  list: [];
  pageNum: number;
  pageSize: number;
  total: number;
};
export interface TenantUserItem {
  id: string;
  userName: string;
}
export type TenantUserGetResultModel = Array<TenantUserItem>;

export interface formSearchType {
  tenantId?: string;
}
export interface deleteProjectType {
  tenantId?: string;
  projectId?: string;
}
export interface tableItem {
  id?: string | number;
  projectName: string;
  projectAlias: number | string;
  description?: string;
  adminId: string[];
  version?: string;
}
export interface ItemType {
  userName: string;
  id: string;
}
