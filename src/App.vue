<template>
  <div id="app">
    <el-config-provider :locale="zhCn">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script>
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  export default{
    name:'APP',
    setup(){
      return{
        zhCn
      }
    }
  }
  </script>

  <style>
    [v-cloak] { display: none; }
    .el-message{ z-index: 9999 !important; }
  </style>
