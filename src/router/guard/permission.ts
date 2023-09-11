/*
 * @Author: wangneng wangneng@chinapost.com.cn
 * @Date: 2022-08-01 14:30:52
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-11 17:46:18
 * @FilePath: \cpvf-pools\src\stores\modules\permission.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { Menu, PagesRoutes } from '/@/stores/types';
import router, { addedRoute, allRoutes, BUS_WHITE_LIST } from '/@/router';
import {
  backMenuAddProp,
  backMenuPath,
  fiterRoutesWithMenuPath,
  frontRouteToMenu,
  getShowMenu,
  uniqeMicroMenu,
} from '/@/router/tools/menuTools';
import { cloneDeep } from 'lodash-es';
import { getMenus } from '/@/api/sys';
import {
  getCurrentMenuStorage,
  setCurrentMenuStorage,
  setMenuStorage,
  getMenuStorage,
} from '/@/router/tools/menuStorage';
import { useUserStore } from '/@/stores/modules/user';
import { useMenuInfoStore } from '/@/stores/modules/menuInfo';
import { menuParams } from '/@/api/model/User';
interface PermissionState {
  // 权限列表
  permCodeList: string[] | number[];
  // 后端菜单
  menuList: Menu[];
  // 业务白名单
  busMenuList: Menu[];
  // 当前菜单
  currentMenu: Menu;
  // 是否已经加载路由
  dynamicAddedRoute: boolean;
  // 是否已经加载白名单路由
  dynamicAddedBusMenu: boolean;
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    menuList:[],
    busMenuList: [],
    dynamicAddedRoute: false,
    dynamicAddedBusMenu: false,
    currentMenu: { name: '', path: '' },
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      const userStore = useUserStore();
      const permissionList = userStore.getUserInfo.permissionList;
      return this.permCodeList && this.permCodeList.length > 0
        ? this.permCodeList
        : permissionList
        ? permissionList
        : [];
    },
    getMenuList(): Menu[] {
      return this.menuList && this.menuList.length > 0
        ? this.menuList
        : getMenuStorage();
      return this.menuList
    },
    getBusMenuList(): Menu[] {
      return this.busMenuList;
    },
    getDynamicAddedRoute(): boolean {
      return this.dynamicAddedRoute;
    },
    getDynamicAddedBusMenu(): boolean {
      return this.dynamicAddedBusMenu;
    },
    getCurrentMenu(): Menu {
      return this.currentMenu.path ? this.currentMenu : getCurrentMenuStorage();
    },
  },
  actions: {
    setCurrentMenu(menu: Menu) {
      this.currentMenu = menu;
      if (menu) {
        setCurrentMenuStorage(menu);
      }
    },
    setPermCodeList(codeList: string[] | number[]) {
      this.permCodeList = codeList;
    },
    setFlatList() {
      // 将菜单摊平后，方便获取路由信息
    },
    setMenuList(list: Menu[]) {
      this.menuList = list;
      setMenuStorage(list);
    },
    setDynamicAddedRoute(added: boolean) {
      this.dynamicAddedRoute = added;
    },
    setDynamicAddedBusMenu(added: boolean) {
      this.dynamicAddedBusMenu = added;
    },
    setBusWhiteMenus(list: Menu[]) {
      this.busMenuList = list;
    },
    async genFrontWhiteMenuList() {
      // 获取纯白名单的菜单
      // 根据前端路由生成菜单 routes的第一层是layout，要根据children提取menus
      const cloneRoutePagesList = cloneDeep(allRoutes);
      const menuRouteList = cloneRoutePagesList.filter(
        (item) => BUS_WHITE_LIST.indexOf('/' + item.path.split('/')[1]) !== -1,
      );
      // const menu = await frontRouteToMenu(menuRouteList as PagesRoutes[]);
      const menu = await frontRouteToMenu(menuRouteList as PagesRoutes[]);
      this.setBusWhiteMenus(menu);
      // return menu;
      this.setDynamicAddedBusMenu(true);
    },
    async genFrontMenuList(whiteMenuList: string[]) {
      // 纯前端路由 将所有生成的routes添加到 菜单中
      allRoutes.forEach((route) => {
        if (!whiteMenuList.includes(route.path)) {
          const removeRoute = router.addRoute(route);
          addedRoute.push(removeRoute);
        }
      });
      // 根据前端路由生成菜单 routes的第一层是layout，要根据children提取menus
      const cloneRoutePagesList = cloneDeep(allRoutes);
      const menuRouteList = cloneRoutePagesList.filter(
        (item) => whiteMenuList.indexOf(item.path) === -1,
      );
      // const menu = await frontRouteToMenu(menuRouteList as PagesRoutes[]);
      const menu = await frontRouteToMenu(menuRouteList as PagesRoutes[]);
      this.setMenuList(menu);
      // return menu;
      this.setDynamicAddedRoute(true);
    },
    async genBackMenuList() {
      // 后端路由，保留route中在后端路由中的菜单
      const userStore = useUserStore();
      const { tenantId, projectId, isSystemAdmin } = userStore.getUserInfo;
      let params: menuParams = {
        isAll: false,
      };
      if (!isSystemAdmin) {
        params = {
          tenantId,
          projectId,
          isAll: false,
        };
      }
      !params && console.log(params);
      const backMenus = (await getMenus()) as any;
      console.log(backMenus)
      // console.log(JSON.stringify(backMenus))
      const menusData: Menu[] = backMenus;
      // 提取所有后端的menu path
      const menuPath: string[] = [];
      backMenuPath(menusData, menuPath);
      // 筛选出 被包含在菜单中的路由
      const realRoutes = fiterRoutesWithMenuPath(allRoutes, menuPath);
      // 将前端路由中的属性 添加到后端菜单上  realRoutes menusData
      backMenuAddProp(menusData, realRoutes);
      realRoutes.forEach((route) => {
        if (route.path == '/micro/vite') {
          route.meta = {
            ...route.meta,
            ...{
              title: '',
              keepAlive: true,
            },
          };
        }
        const removeRoute = router.addRoute(route);
        addedRoute.push(removeRoute);
      });
      // 将微应用的菜单添加上数字用以区分唯一菜单 /microapp/vite/1
      uniqeMicroMenu(menusData);
      // 将菜单中隐藏的菜单进行删除
      getShowMenu(menusData);
      this.setMenuList(menusData);
      this.setDynamicAddedRoute(true);
      const menuInfoStore = useMenuInfoStore();
      menuInfoStore.sourceMenu = menusData;
      return menusData;
    },
  },
});

export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
