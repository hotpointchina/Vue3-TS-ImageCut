/*
 * @Author: wangneng wangneng@chinapost.com.cn
 * @Date: 2022-08-01 14:30:52
 * @LastEditors: wangneng wangneng@chinapost.com.cn
 * @LastEditTime: 2022-08-02 09:27:17
 * @FilePath: \cpvf-pools\src\stores\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { RouteMeta } from 'vue-router';
import { defineComponent } from 'vue';

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface PagesRoutes {
  path: string;
  children: PagesRouteRecordRaw[];
  // layout
  component: Component;
}

export interface PagesRouteRecordRaw {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  path: string;
}

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
  sort?: number;
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Meta {
  icon?: string;
  title?: string;
  hideMenu?: boolean; // 是否隐藏  0 否 不隐藏 1 是 隐藏
  microName?: string; // 微应用 name
  microType?: string; // 微应用类型  vite app
  microPath?: string; // 微应用路由
  url?: string; // 微应用地址
  permStr?: string[]
}

export interface Menu {
  // 标题
  name: string;

  icon?: string;

  path: string;

  // 分类名称
  label?: string;
  // 分类图标
  categoryIcon?: string;
  component?: string;

  // path contains param, auto assignment.
  paramPath?: string;

  disabled?: boolean;

  children?: Menu[];
  parent?: Menu;

  orderNo?: number;

  meta?: Partial<Meta>;

  tag?: MenuTag;

  // 是否显示菜单
  hideMenu?: boolean;
  // 菜单类型
  type?: string;
}

export type AppRouteModule = AppRouteRecordRaw;
