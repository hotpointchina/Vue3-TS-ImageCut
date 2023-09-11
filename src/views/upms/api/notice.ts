/*
 * @Author: 作者
 * @Date: 创建日期
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
 */
import { defHttp } from '/@/utils/axios';
/**
 * 引入model
 */
import {
  NoticeFabuParams,
  NoticeQueryParams,
  NoticeSaveParams,
} from '../model/noticeModel';

/**
 * 枚举，访问路径
 */
enum Api {
  noticeList = '/charity-system/api/sys-notices/notice_admin',
  noticeDel = '/charity-system/api/sys-notices/notice_remove/',
  noticeDetail = '/charity-system/api/sys-notices/notice_query/',
  noticeEdit = '/charity-system/api/sys-notices/notice_edit/',
  noticeAdd = '/charity-system/api/sys-notices/notice_add',
  noticeFabu = '/charity-system/api/sys-notices/notice_status',
}

/**
 * * 新增通知公告
 */
export const saveNotice = (params: NoticeSaveParams) =>{
  return defHttp.post({ url: Api.noticeAdd, params });
};
/**
 * * 查询通知公告
 */
export const queryNotice = (params: NoticeQueryParams) =>{
  return defHttp.post({ url: Api.noticeList, params });
};

/**
 * * 查询通知公告详情
 */
export const detailNotice = (id: string) => {
  return defHttp.get({ url: Api.noticeDetail + id });
};

/**
 * * 删除通知公告
 */
export  const delNotice = (data: any) => {
  return defHttp.post({ url: Api.noticeDel, data });
};

/**
 * * 修改通知公告
 */
export const editNotice = (id: string,params: NoticeSaveParams) =>{
  return defHttp.post({ url: Api.noticeEdit+'/'+id, params });
};
/**
 * * 发布通知公告
 */
export const noticeFabu= (params: NoticeFabuParams) =>{
  return defHttp.post({ url: Api.noticeFabu, params });
};


