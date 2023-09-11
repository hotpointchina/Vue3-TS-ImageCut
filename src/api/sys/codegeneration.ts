import { defHttp } from '/@/utils/axios';
import {tableQueryParam} from "/@/api/model/codegenModel";


enum Api {
  QUERY_DB_TABLE = '/charity-tool/gen/db/list',
  IMPORT_DATA ='/charity-tool/gen/importTable',
  LIST_TABLE = '/charity-tool/gen/list',
  DELETE_TABLE = '/charity-tool/gen/',
  PREVIEW_TABLE = '/charity-tool/gen/preview/',
  SYNCH_DB ='/charity-tool/gen/synchDb/',
}

export const getDaTableList = (params: tableQueryParam) => {
  return defHttp.post({ url: Api.QUERY_DB_TABLE, params });
};
export  const importData = (params: {}) => {
  return defHttp.post({ url: Api.IMPORT_DATA, params });
};
export  const listTable = (params: {}) => {
  return defHttp.post({ url: Api.LIST_TABLE, params });
};
export  const delTable = (tableId: string) => {
  return defHttp.delete({ url: Api.DELETE_TABLE + tableId });
};
export  const previewTable = (tableId: string) => {
  return defHttp.get({ url: Api.PREVIEW_TABLE + tableId });
};
export  const synchDb = (tableName: string) => {
  return defHttp.get({ url: Api.SYNCH_DB + tableName });
};

