import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
import {AddressDetailParams, AddressQueryParams, AddressSaveParams} from "/@/views/upms/model/doneeModel";
export const sysHttp = createAxios({
  requestOptions: {
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true,
  },
});

enum Api{
  addressLists = '/charity-system/api/pwo-name-addresss/pages',
  addressAdd = '/charity-system/api/pwo-name-addresss/add',
  addressDetail = '/charity-system/api/pwo-name-addresss/query/',
  addressEdit = '/charity-system/api/pwo-name-addresss/edit/',
  addressSubmit = '/charity-system/api/pwo-name-addresss/submit/',
  addressDel = '/charity-system/api/pwo-name-addresss/remove/',
  batchSubmit = '/charity-system/api/pwo-name-addresss/submit',
  batchRemove = '/charity-system/api/pwo-name-addresss/batchRemove',
  fileUpload = '/charity-system/api/files/upload',
  approvalRecord = '/charity-system/api/pwo-activitiess/approval/',
  recall = '/charity-system/api/pwo-name-addresss/recall/',
  approve = '/charity-system/api/pwo-name-addresss/approve/',
  change = '/charity-system/api/pwo-name-addresss/change',
  issue = '/charity-system/api/pwo-name-addresss/issue/',

}

export const list = (params: AddressQueryParams) => {
  return defHttp.post({ url: Api.addressLists, params });
};

export const addressAdd = (params: AddressSaveParams) => {
  return defHttp.post({ url: Api.addressAdd, params });
};

export const detail = (id) => {
  return defHttp.get({ url: Api.addressDetail+id });
};

export const edit = (params: AddressDetailParams, id) => {
  return defHttp.post({ url: Api.addressEdit + id, params });
};

export const activitySubmit = (id) => {
  return defHttp.get({ url: Api.addressSubmit + id });
}

export const addressDel = (id) => {
  return defHttp.get({ url: Api.addressDel + id });
}

export const batchSubmit = (params) => {
  return defHttp.get({ url: Api.batchSubmit , params });
}

export const batchRemove = (params) => {
  return defHttp.post({ url: Api.batchRemove , params });
}

export const uploadFile = (params) => {
  return sysHttp.post({ url: Api.fileUpload, params });
};

export const getApprovaList = (id: string) => {
  return defHttp.get({ url: Api.approvalRecord + id });
};
export const recall = (id) => {
  return defHttp.post({ url: Api.recall + id});
}

export const approve = (params,id) => {
  return defHttp.get({ url: Api.approve + id , params });
}
export const change = (params) => {
  return defHttp.post({ url: Api.change , params });
}

export const issue = (id) => {
  return defHttp.get({ url: Api.issue + id });
}
