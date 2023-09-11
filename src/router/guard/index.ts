import { Router } from 'vue-router';
import { createPermissionGuard } from '/@/router/guard/permissionGuard';

export function installRouterGuard(router: Router) {
  // 路由权限拦截
  createPermissionGuard(router);
}
