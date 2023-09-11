// import { sysHttp } from '../common/http';
import { createAxios } from '/@/utils/axios';
export const sysHttp = createAxios({
  requestOptions: {
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true,
  },
});
import { ProjectListGetResultModel, getProjectPramas } from './model/projectModel';
enum Api {
  qryProject = '/project/', //项目列表
  announcementList = '/charity-system/api/sys-notices/notice_popover',
  announcementCheck = '/charity-system/api/sys-notices/notice_prompt/',
}

// 项目列表
export const GetProjectGroup = (params: getProjectPramas) =>
  sysHttp.get<ProjectListGetResultModel>({ url: Api.qryProject, params });

/**
 * * 公告列表
 */
export const announcementList = () => {
  return sysHttp.get({ url: Api.announcementList });
};
/**
 * * 公告勾选
 */
export const announcementCheck = (id: string) => {
  return sysHttp.get({ url: Api.announcementCheck + id });
};
