/*
 * @Author: 作者
 * @Date: 创建日期
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
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
    isReturnNativeResponse: true,
  },
});
/**
 * 引入model
 */
// import { NoticeQueryParams, NoticeSaveParams } from '../model/noticeModel';

/**
 * 枚举，访问路径
 */
enum Api {
  messageList = '/charity-system/api/sys-notices/info_pages',
  messageDetail = '/charity-system/api/sys-notices/info_query/',
  messageDel = '/charity-system/api/sys-notices/info_remove',
  messageReadID = '/charity-system/api/sys-notices/info_read', //传id
  messageRead = '/charity-system/api/sys-notices/all_read',
  messageSmall = '/charity-system/api/sys-notices/info_list',

  messageReadList = '/charity-system/api/sys-notice-reads/pages', //已读列表
  messageReadDel = '/charity-system/api/sys-notice-reads/remove',
  messageReadDetail = '/charity-system/api/sys-notices/read_query/',
}

/**
 * * 查询消息
 */
export const queryNotice = (params) => {
  return defHttp.post({ url: Api.messageList, params });
};

/**
 * * 未读查询情
 */
export const detailNotice = (id: string) => {
  return sysHttp.get({ url: Api.messageDetail + id });
};
/**
 * * 已读查询情
 */
export const messageReadDetail = (id: string) => {
  return sysHttp.get({ url: Api.messageReadDetail + id });
};

/**
 * * 删除通知公告
 */
export const delNotice = (params) => {
  return defHttp.post({ url: Api.messageDel, params });
};

/**
 * * 根据id已读
 */
export const messageReadID = (params) => {
  return defHttp.post({ url: Api.messageReadID, params });
};
/**
 * * 一键已读
 */
export const messageRead = () => {
  return defHttp.get({ url: Api.messageRead });
};
/**
 * * 查询未读消息
 */
export const messageSmall = () => {
  return defHttp.get({ url: Api.messageSmall });
};
/**
 * * 已读列表
 */
export const messageReadList = (params) => {
  return defHttp.post({ url: Api.messageReadList, params });
};
/**
 * * 已读删除
 */
export const messageReadDel = (params) => {
  return defHttp.delete({ url: Api.messageReadDel, params });
};
