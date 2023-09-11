import { useAppStore } from '/@/stores/modules/app';
import { computed, unref } from 'vue';

export function useMenuSettings() {
  const appStore = useAppStore();

  const getMenuCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }

  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !unref(getMenuCollapsed),
    });
  }

  function toggleClose() {
    setMenuSetting({
      collapsed: true,
    });
  }

  function toggleOpen() {
    setMenuSetting({
      collapsed: false,
    });
  }

  return {
    getMenuCollapsed,
    setMenuSetting,
    toggleCollapsed,
    toggleClose,
    toggleOpen,
  };
}
