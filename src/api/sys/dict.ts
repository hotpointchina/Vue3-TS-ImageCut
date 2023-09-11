import { defHttp } from '/@/utils/axios';
import { ResDict } from '/#/store';

enum Api {
  QUERY_CODES = '/charity-systemdict/codes',
}

/**
 * 获取 租户 的字典
 */
export const reqDict = (tenantId?: string, projectId?: string) => {
  const params: { tenantId?: string; projectId?: string } = {};
  if (tenantId && tenantId !== '') params.tenantId = tenantId;
  if (projectId && projectId !== '') params.projectId = projectId;
  return defHttp.get<ResDict>(
    {
      url: Api.QUERY_CODES,
      params: params,
    },
    { joinParamsToUrl: true },
  );
};
