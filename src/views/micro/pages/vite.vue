<template>
  <div>
    <!-- <span @click="setRouter('router', { path: '/dashboard' })"
      >改变子应用路由{{ appInfo.url }}</span
    > -->
    <micro-app
      :name="appInfo.name"
      :url="appInfo.url"
      :data="microAppData"
      inline
      disablesandbox
      keep-alive
      @created="handleCreate"
      @beforemount="handleBeforeMount"
      @mounted="handleMount"
      @unmount="handleUnmount"
      @error="handleError"
      @datachange="handleDataChange"
      @afterhidden="handleaAfterhidden"
      @beforeshow="beforeshow"
      @aftershow="aftershow"
    />
  </div>
</template>

<script setup lang="ts" name="microapp">
  import { nextTick, ref, watch } from 'vue';
  import createEvent from '../libs/messageEvent';
  import { usemicroState } from '../libs/microStore';
  import { useRouter } from 'vue-router';
  import { usePermissionStoreWithOut } from '/@/stores/modules/permission';
  import { Meta } from '/@/stores/types';
  interface appInfoType {
    name: string;
    url: string;
  }
  const route = useRouter();
  // onMounted(() => {
  //   // 打印
  //   console.log('router:', router.currentRoute.value, router.currentRoute.value.query);
  // });
  // const appInfo = ref([
  //   {
  //     name: 'upms',
  //     url: 'http://localhost:80/child/vite/',
  //   },
  //   {
  //     name: 'appname-vite',
  //     url: 'http://localhost:8087/child/vite/',
  //   },
  // ]);
  const appInfo = ref<appInfoType>({ name: '', url: '' });
  // const useIndex = ref(0);

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
  };
  const handleaAfterhidden = () => {
    console.log('keep=alive状态下子应用卸载');
    // window.eventCenterForAppNameVite?.clearDataListener();
  };

  const handleUnmount = () => {
    console.log('子应用 卸载了');
    window.eventCenterForAppNameVite?.clearDataListener();
  };

  const handleError = () => {
    console.log('子应用 加载出错了');
  };

  // 保存子应用通信的数据
  const microState = usemicroState();
  const handleDataChange = (e: CustomEvent) => {
    const data = e.detail.data;
    microState.setmicroState({
      message: data.message,
      type: data.type,
    });
    if (data.type == 'routerCreated') {
      appCreated.value = data.message.routerCreated;
    }
  };
  const setRouter = (type, message) => {
    microAppData.value = {
      message: message,
      type: type, //'router'
    };
    needSend.value = false;
    console.log('microAppData.value', microAppData.value);
  };
  const appCreated = ref(false);
  const needSend = ref(false);
  // 主应用控制子应用路由跳转
  const microPath = ref('');
  const permissionStore = usePermissionStoreWithOut();
  const beforeshow = () => {
    appCreated.value = true;
  };
  watch(
    () => appCreated.value,
    () => {
      if (needSend.value && microPath.value) {
        needSend.value = false;
        // setTimeout(() => {
        microPath.value && setRouter('router', { path: microPath.value });
        // }, 200);
      }
    },
  );
  const aftershow = () => {
    console.log('已经重新渲染，初始化时不执行');
    microPath.value && setRouter('router', { path: microPath.value });
  };
  watch(
    () => route,
    () => {
      nextTick(() => {
        const meta: Meta = permissionStore.getCurrentMenu.meta as Meta;
        // const meta: any = (route.currentRoute.value as any).meta;
        if (!meta.microName || meta.microType != 'vite') return;
        appInfo.value.name = meta?.microName;
        appInfo.value.url = meta?.url as string;
        const path = meta?.microPath;
        if (meta.microName) {
          if (microState.getActiveApp != appInfo.value.name) {
            // 创建通信事件
            createEvent(appInfo.value.name);
            microState.setActiveApp(appInfo.value.name);
          }
        }
        if (path) {
          console.log('appCreated.value', appCreated.value);
          microPath.value = path + '';
          if (appCreated.value) {
            setRouter('router', { path });
          } else {
            needSend.value = true;
          }
        }
      });
    },
    {
      immediate: true,
      deep: true,
    },
  );
</script>
<route lang="yaml">
meta:
  auth: true
</route>
