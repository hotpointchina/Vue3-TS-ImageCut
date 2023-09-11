import { defHttp } from '/@/utils/axios';


enum Api {
  proList = '/charity-system/api/amc-districts/queryPro',

  cityList = '/charity-system/api/amc-districts/queryCity/',

  countyList = '/charity-system/api/amc-districts/queryCounty/'
}

export const queryPro = () => {
  return defHttp.get({url: Api.proList})
}

export const queryCity = (code) => {
  return defHttp.get({url: Api.cityList+code})
}

export const queryCounty = (code) => {
  return defHttp.get({url: Api.countyList+code})
}
