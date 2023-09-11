import NProgress from 'nprogress';
import { useUserStore } from '/@/stores/modules/user';
import { setTitle } from '/@/utils/settings';

// 进度条
import 'nprogress/nprogress.css';
import { Router } from 'vue-router';
import { PageEnum } from '/@/enums/pageEnum';
import { usePermissionStore } from '/@/stores/modules/permission';
import { buildMenus } from '/@/router/menus';
import { UrlToJson } from '/@/utils/operate/urlUtils';
import { PAGE_NOT_FOUND, WHITE_MENU_PATH_LIST } from '/@/router';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
// 路由白名单，这些路由不在权限拦截下，直接跳过

/**
 * 路由拦截
 * 权限验证
 */
export async function createPermissionGuard(router: Router) {
  
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  router.beforeEach(async (to, from, next) => {
    // 进度条
    NProgress.start();
    if (!permissionStore.getDynamicAddedBusMenu) {
      // 加载 白名单菜单，无需登录的业务菜单
      permissionStore.genFrontWhiteMenuList();
    }
    // if (from.path === '/' && to.path === '/') {
    //   next(PageEnum.BASE_HOME);
    //   return;
    // }
    // Whitelist can be directly entered
    if (WHITE_MENU_PATH_LIST.includes(to.path as PageEnum)) {
      next();
      NProgress.done();
      return;
    }

    // debugger;
    const token = userStore.getToken;
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        NProgress.done();
        return;
      }
      const redirectData: {
        path: string;
        replace: boolean;
        query?: Recordable<string>;
      } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path && to.path !== '/') {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.fullPath,
        };
      }
      next(redirectData);
      NProgress.done();
      return;
    }
    if (
      from.path === '/' &&
      to.path === PageEnum.BASE_HOME &&
      userStore.userInfo?.homePath
    ) {
      next(userStore.userInfo.homePath);
      return;
    }
    if (to.path === '/') {
      if (userStore.userInfo?.homePath) {
        next(userStore.userInfo.homePath);
      } else { next(PageEnum.BASE_HOME); }
      return;
    }
    if (permissionStore.getDynamicAddedRoute) {
      if (from.path === LOGIN_PATH) {
        // 登录流程，默认登录
        const redirectString = from.query.redirect as string;
        if (!redirectString || redirectString.split('?')[0] === to.path) {
          next();
        } else {
          const redirectPath = redirectString as string;
          let realQuery = {};
          if (redirectString) {
            const index = redirectString.indexOf('?');
            if (index > -1) {
              realQuery = UrlToJson(
                redirectString.slice(index + 1, redirectString.length),
              );
            }
          }
          const redirect = decodeURIComponent(redirectPath);
          next({ path: redirect, query: realQuery });
        }
      } else { next(); }
      return;
    }
    await buildMenus();
    if (to.name === PAGE_NOT_FOUND.name) {
      next({ path: to.fullPath, replace: true, query: to.query });
    } else { next(); }
  });

  router.afterEach((to) => {
    // 进度条
    NProgress.done();
    setTitle(to.meta.title as string);
  });
}
