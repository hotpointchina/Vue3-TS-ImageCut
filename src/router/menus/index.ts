// 纯前路由
// import {PermissionModeEnum} from "/@/enums/appEnum";
import { PermissionModeEnum } from '/@/enums/appEnum';
import { usePermissionStoreWithOut } from '/@/stores/modules/permission';
import { useAppStoreWithOut } from '/@/stores/modules/app';
import { WHITE_MENU_PATH_LIST } from '/@/router';

// const backMenus
const permissionStore = usePermissionStoreWithOut();
const appStore = useAppStoreWithOut();

export async function buildMenus() {
  // 纯前端路由，需要从routes中解析menus
  isFrontEndMenus() && (await permissionStore.genFrontMenuList(WHITE_MENU_PATH_LIST));
  // 前后结合路由，需要判断前端路由是否在后端路由中，不在的需要去掉
  isRouteMappingMenus() && (await permissionStore.genBackMenuList());
}

function isFrontEndMenus() {
  return appStore.projectConfig?.permissionMode === PermissionModeEnum.FRONT_END;
}

function isRouteMappingMenus() {
  return appStore.projectConfig?.permissionMode === PermissionModeEnum.ROUTE_MAPPING;
}
