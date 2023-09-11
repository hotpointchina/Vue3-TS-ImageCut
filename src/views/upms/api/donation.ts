/*
 * @Author: zhangwanrong
 * @Date: 2022-12-15 14:06:30
 * @LastEditors: zhangwanrong
 * @LastEditTime: 2022-12-21 16:00:22
 * @Description: file content
 * @FilePath: \chinapost_charity_vue\src\views\upms\api\donation.ts
 */
import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
// export const sysPreFix = 'zmock';
export const sysHttp = createAxios({
  requestOptions: {
    // apiUrl: sysPreFix,
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true
  },
});
import { ItemSaveParams, productSaveParams } from '../model/donationModel';
enum Api {
  activitysList = '/charity-pbo/api/donateactivitys/pages',
  activitysOnlyList = '/charity-pbo/api/donateactivitys/query',
  addActivitys = '/charity-pbo/api/donateactivitys/add',
  // 提交
  submitActivitys = '/charity-pbo/api/donateactivitys/submit',
  // 待办中提交
  waitSubmit = '/charity-pbo/api/donateactivitys/wait/submit',
  editActivitys = '/charity-pbo/api/donateactivitys/edit/',
  deleteActivitys = '/charity-pbo/api/donateactivitys/remove',
  // 删除流程
  deleteFlow = '/charity-pbo/api/sys-businesss/remove/',
  statusEdit = '/charity-pbo/api/donateactivitys/status/',
  // 审批记录
  approval = '/charity-pbo/api/sys-approver-detaileds/approvaldetail/',
  // 修改审批状态
  flagstatusEdit = '/charity-pbo/api/donateactivitys/flagstatus/',
  // 查询所有项目编号项目名称
  productList = '/charity-pbo/api/donateactivitys/getproduct',
  // 新增产品
  addProducts = '/charity-pbo/api/pwoproducts/add',
  // 驳回时新增产品
  editProducts = '/charity-pbo/api/pwoproducts/add/product',
  // 通过id查询所有产品
  allproductList = '/charity-pbo/api/pwoproducts/query',
  // 申请页面查询发布后提交的产品
  productFlow = '/charity-pbo/api/pwoproducts/query-products/',
  // 删除产品
  deleteProduct = '/charity-pbo/api/pwoproducts/remove',
  // 查询所有项目编号项目名称
  getproduct = '/charity-pbo/api/donateactivitys/get-activities/pages',
  //搜索框状态
  queryList = '/charity-system/api/sys-dict-items/queryList/',
  // 富文本上传图片
  importImg = '/charity-system/api/files/uploadImage',
  // 详情查看 下载图片
  downloadImg = '/charity-system/api/files/download'
}

// 活动查询所有
export const queryActivitys = (params) => {
  return sysHttp.post({ url: Api.activitysList + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize, params });
};

// id查询
export const getOnlyActivitys = (id: string) => {
  return sysHttp.get({ url: Api.activitysOnlyList + '/' + id });
};

// 新增
export const saveActivitys = (params: ItemSaveParams) => {
  return sysHttp.post({ url: Api.addActivitys, params });
};


// 提交
export const submitActivitys = (params: ItemSaveParams) => {
  return sysHttp.post({ url: Api.submitActivitys, params });
};


// 待办页面提交
export const waitSubmitActivitys = (params: ItemSaveParams) => {
  return sysHttp.post({ url: Api.waitSubmit, params });
};



// 修改
export const editActivitys = (params) => {
  return sysHttp.post({ url: Api.editActivitys + params.id, params });
};

// 删除


export const delActivitys = (params) => {
  return sysHttp.post({ url: Api.deleteActivitys, params });
};

// 删除流程
export const delFlow = (id) => {
  return sysHttp.get({ url: Api.deleteFlow + id });
}

// 状态修改

export const editStatus = (id: string, params) => {
  return defHttp.post({ url: Api.statusEdit + id, params });
}

// 审批记录

export const getApprovaList = (id) => {
  return defHttp.get({ url: Api.approval + id });
}

// 修改审批状态
export const editFlagstatus = (id: string, params) => {
  return defHttp.post({ url: Api.flagstatusEdit + id, params });
}

// 查询所有项目编号项目名称
export const queryProduct = () => {
  return defHttp.post({ url: Api.productList });
};


// 通过id查询所有产品 ==== 编辑时使用
export const getOnlyProducts = (id: string) => {
  return defHttp.get({ url: Api.allproductList + '/' + id });
};

// 申请页面查询发布后提交的产品
export const flowProduct = (id: string) => {
  return defHttp.get({ url: Api.productFlow + id });
};


// 远程新增产品
export const saveProducts = (params: productSaveParams[]) => {
  return sysHttp.post({ url: Api.addProducts, params });
};

// 待办驳回 修改产品
export const editProducts = (params: productSaveParams[]) => {
  return sysHttp.post({ url: Api.editProducts, params });
}

// 删除产品
export const deleteProduct = (params) => {
  return sysHttp.post({ url: Api.deleteProduct, params });
};

// 查询所有项目编号项目名称
export const getproductList = (params) => {
  return defHttp.post({ url: Api.getproduct + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize, params });
};

/**
 * * 搜索框状态
 */
export const queryList = (typeCode: string) => {
  return sysHttp.get({ url: Api.queryList + typeCode });
};

// 富文本上传图片
export const uploadFile = (params) => {
  return sysHttp.post({ url: Api.importImg, params });
}
// 下载图片的地址
export const downloadFile = (params) => {
  return sysHttp.get({ url: Api.downloadImg + '?filePath=' +params, responseType: "blob" });
}
// type getAPIList = (url: string, method: string, body?: any) => object;
// const API: getAPIList = (url, method, body) => {
//   return new Promise(resolve => {
//     fetch(url, { method, body }).then(res => {
//       resolve(res.text())
//     })
//   });
// };
// export async function uploadFile(data: any) {
//   let res: any = await API('/charity-system/minio/upload', 'post', data);
//   return res
// }

export const getBase64 = (data, type) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([data], { type: type }); // 必须指定type类型
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}


