/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { defHttp } from '/@/utils/axios';
enum Api {
  // 查询表详细信息 & 修改代码生成信息
  GenTable = '/charity-tool/gen/',
}
/*interface Request {
  url:string,
  method:string,
  body?:any,
  cache?:string,
  credentials?:string,
  destination?:string,
  headers?:object,
  integrity?:string,
  keepalive?:string,
  mode?:string,
  redirect?:string,
  referrer?:string,
  referrerPolicy?:string,
  signal?:string,
  clone?:string,
  bodyUsed?:any,
  arrayBuffer?:any,
  blob?:any,
  formData?:any,
  json?:any,
  text?:any,
}
*/

// 查询表详细信息
export const getGenTable = ( tableId:string )=>{
  return defHttp.get({ url: Api.GenTable + tableId });
}
// 修改代码生成信息
export const updateGenTable = async ( data:any )=>{
  const res = await defHttp.put({ url: Api.GenTable, data },{isReturnNativeResponse:true});
  return res
}

