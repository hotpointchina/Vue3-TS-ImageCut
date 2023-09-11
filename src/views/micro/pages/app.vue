<template>
  <div>
    <micro-app
      :name="appInfo.name"
      :url="appInfo.url"
      :data="microAppData"
      baseroute="/main-vue3/app-vue2"
      @created="handleCreate"
      @beforemount="handleBeforeMount"
      @mounted="handleMount"
      @unmount="handleUnmount"
      @error="handleError"
      @datachange="handleDataChange"
    />
  </div>
</template>

<script setup lang="ts" name="microcommon">
  import { ref, watch } from 'vue';
  // import createEvent from '../libs/messageEvent';
  import { usemicroState } from '../libs/microStore';
  import { useRouter, onBeforeRouteLeave } from 'vue-router';
  import { usePermissionStoreWithOut } from '/@/stores/modules/permission';
  import { Meta } from '/@/stores/types';
  interface appInfoType {
    name: string;
    url: string;
  }
  const route = useRouter();
  const appInfo = ref<appInfoType>({ name: '', url: '' });
  const microAppData = ref({
    message: {
      path: '',
    },
    type: 'router',
  });
  const handleCreate = () => {
    console.log('子应用 创建了');
  };

  const handleBeforeMount = () => {
    console.log('子应用 即将被渲染');
  };

  const handleMount = () => {
    console.log('子应用 已经渲染完成');
    // appCreated.value = true;
    // if (needSend.value && microPath.value) {
    //   needSend.value = false;
    //   console.log('create-send-path');
    //   setTimeout(() => {
    //     microPath.value && setRouter('router', { path: microPath.value });
    //   }, 200);
    // }
  };

  const handleUnmount = () => {
    console.log('子应用 卸载了');
  };

  const handleError = () => {
    console.log('子应用 加载出错了');
  };

  // 保存子应用通信的数据
  const microState = usemicroState();
  const handleDataChange = (e: CustomEvent) => {
    console.log('来自子应用的数据:', e.detail.data);
    const data = e.detail.data;
    microState.setmicroState({
      message: data.message,
      type: data.type,
    });
    if (data.type == 'routerCreated') {
      appCreated.value = data.message.routerCreated;
    }
  };
  // // 发送消息
  // const sendMessage = (data) => {
  //   microAppData.value = data;
  // };
  const setRouter = (type, message) => {
    microAppData.value = {
      message: message,
      type: type, //'router'
      // message: { path: '/upms/project/member' },
      // type: 'router',
    };
    needSend.value = false;
    console.log('microAppData.value', microAppData.value);
  };
  const appCreated = ref(false);
  const needSend = ref(false);
  // 主应用控制子应用路由跳转
  const microPath = ref('');
  const permissionStore = usePermissionStoreWithOut();
  const appCreatedWatch = watch(
    () => appCreated.value,
    () => {
      if (needSend.value && microPath.value) {
        needSend.value = false;
        console.log('create-send-path');
        // setTimeout(() => {
        microPath.value && setRouter('router', { path: microPath.value });
        // }, 200);
      }
    },
  );
  const stopRouteWatch = watch(
    () => route,
    () => {
      console.log('permissionStore.getCurrentMenu()', permissionStore.currentMenu.meta);
      const meta: Meta = permissionStore.getCurrentMenu.meta as Meta;
      if (!meta.microName) return;
      appInfo.value.name = meta.microName;
      appInfo.value.url = meta.url as string;
      const path = meta?.microPath;
      console.log('path', path, microState.getActiveApp);
      if (meta.microName) {
        if (microState.getActiveApp !== appInfo.value.name) {
          // 创建通信事件
          // createEvent(appInfo.value.name);
          microState.setActiveApp(appInfo.value.name);
        }
      }
      if (path) {
        console.log('appCreated.value', appCreated.value);
        if (appCreated.value) {
          console.log('watch-send-path');
          // name && path && setRouter('router', { path });
          // setTimeout(() => {
          setRouter('router', { path });
          // }, 200);
        } else {
          needSend.value = true;
          microPath.value = path + '';
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
  onBeforeRouteLeave(() => {
    appCreatedWatch();
    stopRouteWatch();
  });
</script>
<route lang="yaml">
meta:
  auth: true
</route>
