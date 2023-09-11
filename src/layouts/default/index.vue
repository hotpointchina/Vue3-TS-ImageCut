<template>
  <el-container class="layout-container" v-resize>
    <el-aside
      :style="{
        width: getMenuCollapsed ? '40px' : appStore.getProjectConfig.menuWidth + 'px',
      }"
    >
      <el-scrollbar>
        <default-side :menu-list="menus" />
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <default-header />
      </el-header>
      <el-main>
        <el-scrollbar>
          <div class="overflow-y-auto">
            <router-view v-slot="{ Component, route }">
              <keep-alive>
                <component :is="Component" v-if="route.meta.keepAlive"  :key="route.name"/>
              </keep-alive>
              <component :is="Component" v-if="!route.meta.keepAlive"  :key="route.name"/>
            </router-view>
          </div>
          <!--            <default-footer class="absolute inset-x-0 bottom-0 h-10" />-->
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup name="DefaultLayout">
  import DefaultHeader from './components/DefaultHeader.vue';
  // import DefaultFooter from './components/DefaultFooter.vue';
  import DefaultSide from '/@/layouts/default/components/DefaultSide.vue';
  // import { getMenus } from '/@/router/menus';
  import { usePermissionStore } from '/@/stores/modules/permission';
  import emitter from '/@/utils/emitter';
  import { useMenuSettings } from '/@/hooks/settings/useMenuSettings';
  import { useAppStore } from '/@/stores/modules/app';

  import { computed } from 'vue';
  // getMenus();
  const { getMenuCollapsed } = useMenuSettings();
  const appStore = useAppStore();
  const permissionStore = usePermissionStore();
  // const { menuList } = usePermissionStore()
  const menus = computed(() => permissionStore.getMenuList);
  // const menus = menuList
  let isAutoCloseSidebar = false;
  const { toggleClose, toggleOpen } = useMenuSettings();
  // 监听容器
  emitter.on('resize', ({ detail }) => {
    // if (isMobile) return;
    let { width } = detail;
    // width <= 670 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
    /** width app-wrapper类容器宽度
     * 0 < width <= 760 隐藏侧边栏
     * 760 < width <= 990 折叠侧边栏
     * width > 990 展开侧边栏
     */
    if (width > 0 && width <= 760) {
      // toggle('mobile', false);
      isAutoCloseSidebar = true;
      toggleClose();
    } else if (width > 760 && width <= 990) {
      if (isAutoCloseSidebar) {
        // toggle('desktop', false);
        isAutoCloseSidebar = false;
        toggleOpen();
      }
    } else if (width > 990) {
      if (isAutoCloseSidebar) {
        isAutoCloseSidebar = false;
        toggleOpen();
      }
      // if (!set.sidebar.isClickHamburger) {
      //   toggle('desktop', true);
      //   isAutoCloseSidebar = true;
      // }
    }
  });
</script>

<style scoped lang="css">
  .layout-container .el-main {
    height: calc(100vh - 70px);
    padding: 0;
  }

  .layout-container .el-header {
    position: relative;
    padding: 0;
    color: var(--el-text-color-primary);
    background-color: var(--el-color-primary-light-7);
  }

  .layout-container :deep(.el-scrollbar__view) {
    height: 100%;
  }

  .layout-container .overflow-y-auto {
    /* height: 100%; */
  }
</style>
