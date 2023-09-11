import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
// export const sysPreFix = 'zmock';
export const sysHttp = createAxios({
    requestOptions: {
        // apiUrl: sysPreFix,
        isTransformResponse: false,
        joinParamsToUrl: false,
        joinTime: false,
        isReturnNativeResponse: true,
    },
});
import {
    ActivitiesQueryParams,
} from '../model/crowdFundingApproveModel';
enum Api {
    activitiesList = '/charity-system/api/pwo-activitiess/person/pages',
    activitiesDel = '/charity-system/api/pwo-activitiess/query/', doneeDownload = '/charity-system/api/files/download', //图片下载
    approveAgree = '/charity-system/api/pwo-activitiess/agree',
    approvereject = '/charity-system/api/pwo-activitiess/reject',
    approvalList = '/charity-system/api/pwo-activitiess/approval/',
    editStatus = '/charity-system/api/pwo-activitiess/status/'
}
export const queryActivities = (params: ActivitiesQueryParams) => {
    return defHttp.post({ url: Api.activitiesList, params });
};
export const detailActivities = (id: number) => {
    return defHttp.get({ url: Api.activitiesDel + id });
};
export const doneeDownload = (params) => {
    return sysHttp.get({
        url: Api.doneeDownload + '?filePath=' + params,
        responseType: 'blob',
    });
};
export const approveAgree = (params: any) => {
    return defHttp.post({ url: Api.approveAgree, params });
};
export const approvereject = (params: any) => {
    return defHttp.post({ url: Api.approvereject, params });
};
// 审批记录
export const getApprovalList = (id) => {
    return defHttp.get({ url: Api.approvalList + id });
};
// 停用启用
export const editStatus = (id, params) => {
    return defHttp.post({ url: Api.editStatus + id, params });
};

export const getBase64 = (data, type) => {
    return new Promise((resolve, reject) => {
        const blob = new Blob([data], { type: type }); // 必须指定type类型
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};