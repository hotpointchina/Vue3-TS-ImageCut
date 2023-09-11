import {
  PROJECT_SETTINGS,
  TOKEN_KEY,
  USER_INFO_KEY,
  MENU_KEY,
  HEADER_TENANT_PROJECT_KEY,
  DICT_KEY,
  CUR_MENU_KEY,
} from '/@/enums/cacheEnum';
import { ResDict, UserInfo } from '/#/store';
import { Menu } from '/@/stores/types';

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined;
  [MENU_KEY]: Menu[];
  [USER_INFO_KEY]: UserInfo;
  [PROJECT_SETTINGS]: ProjectConfigs;
  [HEADER_TENANT_PROJECT_KEY]: string;
  [DICT_KEY]: ResDict;
  [CUR_MENU_KEY]: Menu;
}

// 限定BasicKeys的类型为BasicStore的key TOKEN_KEY | USER_INFO_KEY
export type BasicKeys = keyof BasicStore;
