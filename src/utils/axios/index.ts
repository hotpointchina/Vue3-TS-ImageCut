/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
// import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMesage';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString } from '../is';
// 暂时隐藏，等登录页面完善后，需要添加
// import { getAuthToken } from '/@/utils/storage/auth';
import { TOKEN_KEY } from '/@/enums/cacheEnum';
import { setObjToUrlParams, deepMerge } from '../index';
import { transformI18n } from '/@/utils/i18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { loadEnv, warpperEnv } from '@build/index';
import * as cryptoJs from '/@/utils/cryptoJs';



// const globSetting = useGlobSetting();
const { VITE_APP_BASE_URL, VITE_APP_BASE_URL_PREFIX } = warpperEnv(loadEnv());

const { createMessage } = useMessage();
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    if (res.data.type == 'application/vnd.ms-excel') {
      return res;
    }

    const { data } = res;
    if (!data) {
      throw new Error(transformI18n('api.apiRequestFailed', true));
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, msg } = data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      options.isAutoResponseTip;
      return result;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = transformI18n('访问超时', true);
        break;
      default:
        if (msg) {
          timeoutMsg = msg;
        }
    }
    createMessage.error(timeoutMsg);
    throw new Error(timeoutMsg || transformI18n('api.apiRequestFailed', true));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;


    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else if (!isString(params)) {
      formatDate && formatRequestDate(params);
      if (
        Reflect.has(config, 'data') &&
        config.data &&
        Object.keys(config.data).length > 0
      ) {
        config.data = data;
        config.params = params;
      } else {
        // 非GET请求如果没有提供data，则将params视为data
        config.data = params;
        config.params = undefined;
      }
      if (joinParamsToUrl) {
        config.url = setObjToUrlParams(config.url as string, {
          ...config.params,
          ...config.data,
        });
      }
    } else {
      // 兼容restful风格
      config.url += params;
      config.params = undefined;
    }
    // POST 请求 body体，加密
    if (
      config.method?.toLocaleLowerCase() == 'post'
      && options.isEncryptionPostBody
    ) {
      if (config.data && Object.keys(config.data).length > 0) {
        config.data = cryptoJs.encryptionHandler(JSON.stringify(config.data));
      }
      if (typeof (config.params) == 'object' && Object.keys(config.params).length > 0) {
        config.params = cryptoJs.encryptionHandler(JSON.stringify(config.params));
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config: AxiosRequestConfig, options: CreateAxiosOptions) => {
    // 请求之前处理config
    // const token = getAuthToken();
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    if (res.headers && res.headers['refresh-token']) {
      sessionStorage.setItem(TOKEN_KEY, res.headers['refresh-token']);
    }
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string =
      response?.data?.error?.message ||
      response?.data?.msg ||
      response?.data?.message ||
      '未知错误';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = transformI18n('api.apiTimeoutMessage', true);
      }
      if (err?.includes('Network Error')) {
        errMessage = transformI18n('api.networkExceptionMsg', true);
      }
      switch (response.status) {
        case 500:
          errMessage = '系统异常';
          break;
        // case 503:
        //   errMessage = '服务网络不佳';
        //   break;
      }
      if (errMessage) {
        createMessage.error(errMessage);
        return Promise.resolve(errMessage);
      }
    } catch (error) {

      return Promise.resolve(error);
    }

    checkStatus(error?.response?.status, msg || err, errorMessageMode);

    return Promise.resolve(error.response);
    // return Promise.reject(`${error}`);
  },
};

export function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口baseUrl
          apiUrl: VITE_APP_BASE_URL,
          // 接口前缀
          urlPrefix: VITE_APP_BASE_URL_PREFIX,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // POST 请求 body体是否加密
          isEncryptionPostBody: false,
          // 是否自动进行响应提示
          isAutoResponseTip: true,
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();
