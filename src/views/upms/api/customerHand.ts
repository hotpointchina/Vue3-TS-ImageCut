import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
export const sysHttp = createAxios({
  requestOptions: {
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true,
  },
});
enum Api {
  customerList = '/charity-system/api/pwo-user-retails/pages', //分页查询
  customerOnlyList = '/charity-system/api/pwo-user-retails/query', //查询详情
  statusEdit = '/charity-system/api/pwo-user-retails/enable', //禁/启用
}

// 活动查询所有
export const queryCustomer = (params) => {
  return defHttp.post({
    url: Api.customerList,
    params,
  });
};

// id查询详情
export const getOnlyCustomer = (id: string) => {
  return defHttp.get({ url: Api.customerOnlyList + '/' + id });
};

// 停用启用
export const saveCustomer = (params) => {
  return defHttp.post({ url: Api.statusEdit, params });
};
