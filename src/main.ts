import { Component, createApp } from 'vue';
import { registerGlobComp, registerGlobPlugin } from './components/index';
import App from './App.vue';
import { installStore } from './stores';
import router, { installRouter } from './router';
import { usI18n } from '/@/utils/i18n';
import 'virtual:svg-icons-register';
import 'virtual:windi.css';

import 'element-plus/dist/index.css';
import '/@/styles/index.css';
import { installRouterGuard } from '/@/router/guard';
import { initSettingsStore } from '/@/settings/initSettings';
import { MotionPlugin } from '@vueuse/motion';
import { installGlobDirectives } from '/@/directives';
import mitt from 'mitt';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { QuillEditor } from '@vueup/vue-quill';
import '/@/components/sys/QuillEditor/style/quill.snow.css';

import VueCropper from 'vue-cropper'; 
import 'vue-cropper/dist/index.css'





async function bootstrap() {
  const app = createApp(App);
  // 注册图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, <Component>component);
  }
  app.config.globalProperties.$mitt = mitt();
  app.use(MotionPlugin);
  // app.use(ElementPlus);
  // 注册响应式配置信息(layout, theme等)
  initSettingsStore();
  // install directives
  installGlobDirectives(app);

  // install store
  installStore(app);

  // install routing
  installRouter(app);

  // 加载全局组件
  registerGlobComp(app);

  // 加载全局插件
  registerGlobPlugin(app);

  // 注册路由守卫
  installRouterGuard(router);
  // 国际化
  await usI18n(app);
  app.component('QuillEditor', QuillEditor);
  // 图片剪切 剪裁、下载
  app.use(VueCropper);

  app.mount('#app');
}
bootstrap();

