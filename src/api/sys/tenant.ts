import { defHttp } from '/@/utils/axios';
import {
  ProjectInfo,
  // TenantInfo
} from '/@/api/model/Tenant';

enum Api {
  QUERY_TENANT = '/charity-systemtenant/qryTenant',
  QUERY_PROJECT = '/charity-systemproject/qryProject',
  // PROJECT =
}

/**
 * 获取租户列表
 */
export const getTenantList = () => {
  // return defHttp.get<TenantInfo[]>({ url: Api.QUERY_TENANT });
};

/**
 * 获取项目列表
 */
export const getProjectList = (tenantId: string) => {
  return defHttp.get<ProjectInfo[]>(
    {
      url: Api.QUERY_PROJECT,
      params: {
        tenantId: tenantId,
      },
    },
    { joinParamsToUrl: true },
  );
};
