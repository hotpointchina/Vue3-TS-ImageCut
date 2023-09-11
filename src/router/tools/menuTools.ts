import {
  AppRouteRecordRaw,
  Menu,
  PagesRouteRecordRaw,
  PagesRoutes,
} from '/@/stores/types';
import { cloneDeep } from 'lodash-es';
import { treeMap } from '/@/utils/tools/treeTools';
import { isNumber } from '/@/utils/is';
import { RouteRecordRaw } from 'vue-router';
import { projectSettings } from '/@/settings/config/projectConfig';
import { I18nTypeEnum, PermissionModeEnum } from '/@/enums/appEnum';
import { transformI18n } from '/@/utils/i18n';

/**
 * 给所有节点添加parent
 * @param menu
 * @param path
 */
function addParentLevelMenu(menu: Menu, path: string) {
  if (menu.path === path) {
    return true;
  }
  if (menu.children && menu.children.length > 0) {
    for (const level of menu.children) {
      level.parent = menu;
      if (addParentLevelMenu(level, path)) {
        return true;
      }
    }
  }
}

/**
 * 获取 包含 path的menu
 * @param menu
 * @param path
 */
function getTargetMenu(menu: Menu, path: string): Menu | undefined {
  if (menu.path === path) {
    return menu;
  }
  if (menu.children && menu.children.length > 0) {
    for (const level of menu.children) {
      if (level.path === path) {
        return level;
      }
      if (getTargetMenu(level, path)) {
        return getTargetMenu(level, path);
      }
    }
  }
}

/**
 * 从菜单中获取 菜单列表
 * @param menu
 * @param breads
 */
function getBreadsMenu(menu: Menu, breads: Menu[] = []): Menu[] {
  breads.unshift(menu);
  if (menu.parent) {
    getBreadsMenu(menu.parent, breads);
  }
  return breads;
}

/**
 * 根据path从menus中获取所有的父Menus
 * @param menus
 * @param path
 */
export function getAllParentMenus(menus: Menu[], path: string): Menu[] {
  let breads: Menu[] = [];
  for (const menu of menus) {
    // 获取包含 path的菜单
    const data = cloneDeep(menu);
    const returnData: boolean | undefined = addParentLevelMenu(data, path);
    if (returnData) {
      // 将菜单的按照层级提取出来

      const targetMenu: Menu = getTargetMenu(data, path) as Menu;
      breads = getBreadsMenu(targetMenu);
      break;
    }
  }

  return breads as Menu[];
}

/**
 * 将平铺的路由信息转换成层级菜单 category
 * @param list
 */
function flatToLevelMenu(list: Menu[]) {
  const finnalMenuList: Menu[] = [];
  const pathList: string[] = [];
  const sortedList = list.sort((x, y) => {
    return x.path.split('/').length - y.path.split('/').length;
  });
  sortedList.forEach((item) => {
    // pathList.push(item.path);
    if (pathList.indexOf(item.path) === -1) {
      const menuPathSplit = item.path.split('/').filter((item) => item !== '');
      if (menuPathSplit.length === 1) {
        // 只有一层 path
        pathList.push(item.path);
        finnalMenuList.push(item);
      } else {
        // 两层以上 path
        let parentMenu: Nullable<Menu> = null;
        let curIndex = -1;
        for (let index = 0; index < menuPathSplit.length; index++) {
          const levelPath = '/' + menuPathSplit.slice(0, index + 1).join('/');
          if (index === 0) {
            curIndex = pathList.indexOf(levelPath);
            if (curIndex > -1) {
              // 找到了 第一层 的path
              parentMenu = finnalMenuList[curIndex];
            } else {
              // 未找到了 第一层 的path，把当前的 path放进去
              pathList.push(item.path);
              finnalMenuList.push(item);
            }
          } else {
            if (!parentMenu) {
              // index 为 0 时已经赋值了，parentMenu一定存在
              break;
            }
            if (index + 1 === menuPathSplit.length) {
              const selfMenu = cloneDeep(parentMenu);
              selfMenu.children = [];
              parentMenu.children = [...(parentMenu.children || []), selfMenu, item];
            } else {
              // 中间过程
              const parentIndex = parentMenu.children?.findIndex(
                (item) => item.path === levelPath,
              );
              if (isNumber(parentIndex) && parentIndex >= 0) {
                // 找到了中间层菜单
                parentMenu = parentMenu.children![parentIndex];
              } else {
                const selfMenu = cloneDeep(parentMenu);
                selfMenu.children = [];
                parentMenu.children = [...(parentMenu.children || []), selfMenu, item];
                break;
              }
            }
          }
        }
      }
    }
  });
  return finnalMenuList;
}

/**
 * 根据前端路由生成菜单 routes的第一层是layout，要根据children提取menus
 * @param routePagesList routes
 */
export async function frontRouteToMenu(routePagesList: PagesRoutes[]): Promise<Menu[]> {
  const routeList: PagesRouteRecordRaw[] = [];

  routePagesList.forEach((item) => {
    const realPagesRoute: PagesRouteRecordRaw = item.children[0];
    realPagesRoute.path = item.path;
    routeList.push(realPagesRoute);
  });

  let list: Menu[] = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, icon } = {}, name, label } = node;
      return {
        // ...(node.meta || {}),
        meta: node.meta,
        name: name,
        // title: title || name,
        label: label || title || name,
        categoryIcon: icon || 'Menu',
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  // joinParentPath(list);
  list = flatToLevelMenu(list);

  return cloneDeep(list);
}

/**
 * 获取menus中所有的 path
 * @param menus
 */
export function backMenuPath(menus: Menu[], allFullPath: string[]) {
  menus.forEach((menu) => {
    if (menu.children && menu.children?.length > 0) {
      backMenuPath(menu.children, allFullPath);
    }
    allFullPath.push(menu.path);
  });
}

/**
 * 从后端的menu path中删除 不在权限中的路由
 * @param routes
 * @param menuPath
 */
export function fiterRoutesWithMenuPath(
  routes: RouteRecordRaw[],
  menuPath: string[],
): RouteRecordRaw[] {
  // console.log(menuPath, menuPath)
  return routes.filter((route) => menuPath.indexOf(route.path) > -1);
}

/**
 * 将前端路由的属性添加到后端菜单上
 * @param menus
 */
export function backMenuAddProp(menus: Menu[], routes: RouteRecordRaw[]) {
  menus.forEach((menu) => {
    if (menu.children && menu.children?.length > 0) {
      backMenuAddProp(menu.children, routes);
    }
    routes.forEach((route) => {
      // 给所有的 菜单添加默认的 分类图标
      menu.categoryIcon = menu.meta?.icon
        ? menu.meta?.icon == ''
          ? 'menu'
          : menu.meta?.icon
        : 'menu';
      if (menu.path === route.path) {
        // 设置 menu的属性
        menu.name = route.children?.[0].name as string;
        // 将menu的meta添加到 路由上
        route.meta = { ...menu.meta, ...route.meta } as any;
        if (projectSettings.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
          // 如果是后端菜单，那就以后端数据为准，不进行数据处理
          if (projectSettings.locale !== I18nTypeEnum.none) {
            // 如果projectLocale不为none的话，则使用多语言，否则使用原本的titile
            const showTitle = transformI18n(`menus.${menu.name}`, true);
            // 如果多语言转换得到的结果跟 传递的名称相同，则不进行替换
            if (showTitle !== `menus.${menu.name}`) {
              menu.name = showTitle;
              menu.label = showTitle;
              menu.meta!.title = showTitle;
            }
          }
        } else {
          // 将路由中的meta数据添加到菜单中，menu.meta为准
          menu.meta = { ...route.children?.[0].meta, ...menu.meta };
        }
      }
    });
  });
}
/**
 * 隐藏hidden的菜单，将菜单的meta配置到routes中
 * @param menus 菜单数据
 */
export function getShowMenu(menus: Menu[]) {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    // 由于route的meta的hideMenu是boolean类型，所以需要设置Menu的meta的hideMenu为boolean，但是实际存储的是 0 1
    if ((menu.meta?.hideMenu as any) === '1') {
      menus.splice(i, 1);
      i--;
    } else {
      if (menu.children && menu.children?.length > 0) {
        getShowMenu(menu.children);
      }
    }
  }
}

/**
 * 为微应用添加一个唯一数字
 * @param menus
 */
let microCount = 0;
export function uniqeMicroMenu(menus: Menu[]) {
  menus.forEach((menu: Menu) => {
    // debugger
    if (menu.type === '2') {
      microCount += 1;
      menu.path = `${menu.path}/${microCount}`;
    }
    if (menu.children && menu.children.length > 0) {
      uniqeMicroMenu(menu.children);
    }
  });
}
