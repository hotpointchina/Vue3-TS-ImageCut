<template>
  <div>
    <template v-for="item in menuList">
      <sys-sub-menu
        v-if="item.children && item.children?.length > 0"
        :item="item"
        :key="item.path"
        :collapsed="collapsed"
        :flod-path="flod"
        @change-flod="setFlod"
      />
      <sys-menu-item v-else :item="item" :key="item.path" />
    </template>
  </div>
</template>

<script setup lang="ts" name="SysMenu">
  import { PropType } from 'vue';
  import SysMenuItem from './SysMenuItem.vue';
  import SysSubMenu from './SysSubMenu.vue';
  import { Menu } from '/@/stores/types';
  import router from '/@/router';
  import { useMenuFlod } from './MenuFlod';

  const { push, currentRoute } = router;

  const props = defineProps({
    menuList: {
      type: Array as PropType<Menu[]>,
      default: () => [],
    },
    deeps: {
      type: Number as PropType<number>,
      default: 0,
    },
    isFirstLevel: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    collapsed: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    useI18n: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    i18nType: {
      type: String as PropType<string>,
      default: 'menus.',
    },
  });

  const { flod, setFlod } = useMenuFlod(props);
  // 解决currentRoute => All destructured elements are unused的问题，使用defineExpose导出
  defineExpose({ push, currentRoute, flod, setFlod });
</script>
