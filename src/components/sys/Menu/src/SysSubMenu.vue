<!--
 * @Author: wangneng wangneng@chinapost.com.cn
 * @Date: 2022-08-01 14:30:52
 * @LastEditors: wangneng wangneng@chinapost.com.cn
 * @LastEditTime: 2022-08-02 12:31:15
 * @FilePath: \cpvf-pools\src\components\sys\Menu\src\SysSubMenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    @click="menuFlod(item.path)"
    v-if="item.children && item.children?.length > 0"
    class="
      flex
      items-center
      font-normal
      text-blue-50
      hover:bg-primary hover:text-white
      py-2
      truncate
    "
    :style="{ paddingLeft: `${15 + deeps * 15}px` }"
  >
    <!-- 标题 -->
    <div
      v-if="item.categoryIcon && item.categoryIcon !== ''"
      class="flex items-center mr-2"
    >
      <sys-icon :type="item.categoryIcon" />
      <!-- <svg-icon class="w-5 h-5" prefix="icon" :name="item.categoryIcon" /> -->
    </div>
    <span class="flex-1">{{ !getMenuCollapsed ? item.meta?.title : '' }}</span>
    <svg-icon class="w-4 h-4 mr-2" prefix="icon" name="down-arrow" />
  </div>
  <div class="children" v-if="flod === item.path">
    <template v-for="itemX in item.children">
      <sys-sub-menu
        :deeps="deeps + 1"
        v-if="itemX.children && itemX.children?.length > 0"
        :item="itemX"
        :key="itemX.path"
        :collapsed="collapsed"
        :flod-path="flod"
      />
      <sys-menu-item :deeps="deeps + 1" v-else :item="itemX" :key="itemX.path" />
    </template>
  </div>
</template>

<script setup lang="ts" name="CpSubMenu">
  import SysMenuItem from './SysMenuItem.vue';
  import SysIcon from '/@/components/sys/Icon';
  import { PropType } from 'vue';
  import { useMenuFlod } from './MenuFlod';
  import { useMenuSettings } from '/@/hooks/settings/useMenuSettings';
  const emits = defineEmits(['changeFlod']);

  const { getMenuCollapsed } = useMenuSettings();

  const props = defineProps({
    item: {
      // route object
      type: Object,
      required: true,
    },
    deeps: {
      type: Number as PropType<number>,
      default: 0,
    },
    flodPath: {
      type: String,
      default: '',
    },
    collapsed: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });

  const { flod, setFlod } = useMenuFlod(props);

  function menuFlod(path: string) {
    emits('changeFlod', path);
    setFlod(path);
  }
</script>
