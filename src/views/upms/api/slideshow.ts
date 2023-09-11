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
import { SlideshowQueryParams, SlideshowSaveParams } from '../model/slideshowModel';
import { sysHttp } from '/@/views/upms/api/doneeDecla';

/**
 * 枚举，访问路径
 */
enum Api {
  slideshowList = '/charity-system/api/sys-slideshows/pages',
  slideshowDel = '/charity-system/api/sys-slideshows/remove/ids=',
  slideshowDetail = '/charity-system/api/sys-slideshows/query',
  slideshowEdit = '/charity-system/api/sys-slideshows/edit/id=',
  slideshowAdd = '/charity-system/api/sys-slideshows/add',
  doneeDownload = '/charity-system/api/files/download', //图片下载
}

/**
 * * 新增轮播图管理
 */
export const saveSlideshow = (params: SlideshowSaveParams) => {
  return defHttp.post({ url: Api.slideshowAdd, params });
};
/**
 * * 查询轮播图管理
 */
export const querySlideshow = (params: SlideshowQueryParams) => {
  return defHttp.post({ url: Api.slideshowList, params });
};

/**
 * * 查询轮播图管理详情
 */
export const detailSlideshow = (id: string) => {
  return defHttp.get({ url: Api.slideshowDel + id });
};

/**
 * * 删除轮播图管理
 */
export const delSlideshow = (params) => {
  return defHttp.post({ url: Api.slideshowDel, params });
};

/**
 * * 修改轮播图管理
 */
export const editSlideshow = (params: SlideshowSaveParams) => {
  return defHttp.post({ url: Api.slideshowEdit + params.id, params });
};
/*
 * 下载图片
 * */
export const doneeDownload = (params) => {
  return sysHttp.get({
    url: Api.doneeDownload + '?filePath=' + params,
    responseType: 'blob',
  });
};
