<template>
  <div class="page-example">
    example
    <el-button @click="changeColor('red')">红色主题</el-button>
    <el-button @click="changeColor('green')">绿色主题</el-button>
    <el-button @click="changeColor('default')">默认主题</el-button>
  </div>
</template>

<script lang="ts" setup name="PageExample">
  import { usePermissionStore } from '/@/stores/modules/permission';

  const changeColor = (color) => {
    window.document.documentElement.setAttribute('data-theme', color);
  };
  const permissionStore = usePermissionStore();
  const menus = permissionStore.busMenuList;
  console.log(menus, 'menus');
</script>
<style scoped>
  .page-example {
    padding: 20px;
    color: var(--el-color-primary);
  }
</style>
<route lang="yaml">
meta:
  auth: true
label: 样例
</route>
