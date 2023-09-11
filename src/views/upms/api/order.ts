import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
import {OrderQuery } from "/@/views/upms/model/orderModel";
export const sysHttp = createAxios({
  requestOptions: {
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true,
  },
});
enum Api{
  orderList = '/charity-system/api/pwo-charity-orders/pages',
  orderDetail ='/charity-system/api/pwo-charity-orders/query/',
  orderExport = '/charity-system/api/pwo-charity-orders/export',
  checkQuery ='/charity-system/app-api/pwo-order-locuss/list/'
}

export const getList = (params: OrderQuery) => {
  return defHttp.post({ url: Api.orderList, params });
};

export const detail = (id) => {
  return defHttp.get({ url: Api.orderDetail + id });
};

export const exportOrder = (params) => {
  return sysHttp.post({ url: Api.orderExport, params, responseType: 'blob'  });
};

export const checkQuery = (id) => {
  return sysHttp.get({ url: Api.checkQuery+id });
};
