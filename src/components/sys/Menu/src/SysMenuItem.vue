<!--
 * @Author: wangneng wangneng@chinapost.com.cn
 * @Date: 2022-08-01 14:30:52
 * @LastEditors: wangneng wangneng@chinapost.com.cn
 * @LastEditTime: 2022-08-02 11:30:51
 * @FilePath: \cpvf-pools\src\components\sys\Menu\src\SysMenuItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <router-link :to="item.path">
    <div
      class="flex text-blue-50 hover:bg-primary hover:text-white py-2 truncate"
      :class="{
        'bg-primary text-white': currentRoute.path === item.path,
      }"
      :style="{ paddingLeft: `${15 + deeps * 15}px` }"
    >
      <div
        v-if="item.meta?.icon && item.meta?.icon !== ''"
        class="flex items-center mr-2"
      >
        <sys-icon :type="item.meta?.icon" />
        <!-- <svg-icon class="w-5 h-5" prefix="icon" :name="item.meta?.icon" /> -->
      </div>
      <span>{{ !getMenuCollapsed ? item.meta?.title || item.name : '' }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts" name="SysMenuItem">
  import router from '/@/router';
  import SysIcon from '/@/components/sys/Icon';
  import { PropType, watch } from 'vue';
  import { useMenuSettings } from '/@/hooks/settings/useMenuSettings';
  import { usePermissionStore } from '/@/stores/modules/permission';
  import { Menu } from '/@/stores/types';

  const { getMenuCollapsed } = useMenuSettings();
  const { push, currentRoute } = router;
  const permissionStore = usePermissionStore();

  defineExpose({ push, currentRoute });
  const props = defineProps({
    item: {
      // route object
      type: Object as PropType<Menu>,
      required: true,
    },
    deeps: {
      type: Number as PropType<number>,
      default: 0,
    },
  });
  watch(
    () => currentRoute.value.path,
    (value) => {
      if (value === props.item.path) {
        permissionStore.setCurrentMenu(props.item);
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
</script>
