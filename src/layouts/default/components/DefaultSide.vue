<!--
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 10:19:05
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-08 09:13:18
 * @FilePath: \gongyi_vue_demo\src\layouts\default\components\DefaultSide.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="overflow-y-auto bg-gray-800" style="height: 100vh">
    <div class="flex h-18 p-1 text-white text-lg w-full justify-center items-center">
      <img class="w-8 h-8" src="/logo.png" />
      <span class="pl-1" v-if="!getMenuCollapsed">{{ VITE_APP_TITLE }}</span></div>
    <sys-menu
      class="pt-2"
      :menu-list="menuList"
      :collapsed="getMenuCollapsed"
      :deeps="0"
    />
  </div>
</template>

<script lang="ts" setup name="DefaultSide">
  import { PropType } from 'vue';
  import { Menu } from '/@/stores/types';
  import { SysMenu } from '/@/components/sys/Menu';
  import { useMenuSettings } from '/@/hooks/settings/useMenuSettings';
  import { warpperEnv } from '@build/index';

  const { VITE_APP_TITLE } = warpperEnv();

  defineProps({
    menuList: {
      type: Array as PropType<Menu[]>,
      default: () => [],
    },
  });

  const { getMenuCollapsed } = useMenuSettings();
</script>
