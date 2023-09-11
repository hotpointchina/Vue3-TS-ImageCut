/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 10:19:05
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-07 14:47:30
 * @FilePath: \gongyi_vue_demo\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable no-param-reassign */
import { createRouter, createWebHistory, RouterOptions } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import { PageEnum, codeGenerationPages } from '/@/enums/pageEnum';
// import './menus';
export const allRoutes = setupLayouts(generatedRoutes);
// allRoutes.forEach((element) => {
//   if (element.path == '/micro/app') {
//     element.children?.push({
//       component: () => import('/src/views/micro/pages/app.vue'),
//       path: ':name',
//       redirect: '',
//     });
//   }
//   if (element.path == '/micro/vite') {
//     element.children?.push({
//       component: () => import('/src/views/micro/pages/vite.vue'),
//       path: ':name',
//       redirect: '',
//     });
//     // element.path = '/micro/vite/:name';
//     // element.children && (element.children[0].path = '*');
//   }
// });

// 菜单白名单，以下菜单不在权限范围内，并且不在最终Menu中显示
const LOGIN_PATH = PageEnum.BASE_LOGIN;
const ERROR_PAGE = PageEnum.ERROR_PAGE;
const BASE_HOME = PageEnum.BASE_HOME;
const BASE_INDEX = PageEnum.BASE_INDEX;
const BASE_MESSAGE = PageEnum.BASE_MESSAGE;
const CUT_IMAGE = PageEnum.CUT_IMAGE;

// 系统白名单
const SYS_WHITE_LIST: string[] = [
  ERROR_PAGE,
  LOGIN_PATH,
  BASE_INDEX,
  BASE_MESSAGE,
  CUT_IMAGE,
  BASE_HOME,
];
// 业务白名单
export const BUS_WHITE_LIST: string[] = [];
export const WHITE_MENU_PATH_LIST = [
  ...SYS_WHITE_LIST,
  ...BUS_WHITE_LIST,
  ...codeGenerationPages,
];

const notFound = () => {
  let notFoundRoute;
  notFoundRoute = allRoutes.find((route) => route.children?.[0].name === 'NOT_FOUND');
  notFoundRoute = notFoundRoute.children?.[0];
  return notFoundRoute;
};
export const PAGE_NOT_FOUND = notFound();

// 筛选白名单的路由
const routes = allRoutes.filter((item) =>
  WHITE_MENU_PATH_LIST.includes(item.path as string),
);
const router = createRouter(<RouterOptions>{
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
  strict: true,
});

// 保存 addRoute的回调函数，用来清空路由
export const addedRoute: (() => void)[] = [];

export function removeUserRouter() {
  // 清空路由
  addedRoute.forEach((f) => f());
}

export default router;

export function installRouter(app: any) {
  app.use(router);
}
