import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import viteSvgIcons from 'vite-plugin-svg-icons';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// import ElementPlus from 'unplugin-element-plus/vite';
import viteCompression from 'vite-plugin-compression';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';
import { warpperEnv } from './build';
import { createProxy, configHmrPlugin } from './build/vite';
import { microMainPlugin, microRoutesPlugin } from './build/micro/main';

import WindiCSS from 'vite-plugin-windicss';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueJsx from '@vitejs/plugin-vue-jsx';

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();

const dir = 'src/views/**/pages';
const dirReg = new RegExp(dir.replace('**', '(.*)'), 'i');

// web components 的 tag name
const webComponents = ['micro-app'];
export default ({ mode, command }: ConfigEnv) => {
  const { VITE_PORT, VITE_PROXY, VITE_MOCK, VITE_APP_TITLE, VITE_MICRO } = warpperEnv(
    loadEnv(mode, root),
  );

  const customPlugin: any[] = [];
  if (VITE_MICRO === 'main') {
    // 微应用为主应用时的代码注入
    customPlugin.push(microMainPlugin());
    customPlugin.push(microRoutesPlugin());
  }

  return defineConfig({
    define: {
      'process.env': process.env,
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // 告知 vite 这些 tag 是 自定义元素，不以 vue components 来解析
            isCustomElement: (tag) => webComponents.includes(tag),
          },
        },
      }),
      vueJsx(),
      createHtmlPlugin({
        inject: {
          data: {
            title: VITE_APP_TITLE,
          },
        },
      }),
      mode === 'development' && configHmrPlugin(),
      WindiCSS(),
      viteCompression(),
      viteSvgIcons({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: false })],
        dts: 'src/components.d.ts',
      }),
      // ElementPlus(),
      vueSetupExtend(),
      Pages({
        dirs: [
          { dir: dir, baseRoute: '' },
          { dir: 'src/views/sys', baseRoute: '' },
          // { dir: 'src/views/dashboard', baseRoute: '/dashboard' },
        ],
        extensions: ['vue'],
        extendRoute: (route) => {
          // 优先以 dirs中的处理为主
          // /upms/account /upms/audit-log
          // 如：{ dir: 'src/views/dashboard', baseRoute: '/dashboard' } 则 以views/dashboard下的index.vue作为 /dashboard路由
          // 给路由添加前缀， 如src/views/upms/pages/abc/index.vue的文件路由 由 /abc => /upms/abc
          const excludList = ['examples']; // 跳过 src/views/examples/pages/abc/index.vue的路由还是 /abc
          const str = `src/views/.*/pages(${route.path}).*\.vue`;
          const pathReg = new RegExp(str, 'i');
          // 匹配 component文件路由，将路由替换成 目录 文件本身的格式
          // 如：生成的路由 /tenant/role/addrole => 实际文件路由 /tenant/role/AddRole
          const routePath = route.component.match(pathReg);
          if (routePath) {
            if (route.path !== routePath[1]) {
              route.path = routePath[1];
            }
          }
          const result = route.component.match(dirReg);
          if (result) {
            if (!excludList.includes(result[1])) {
              if (route.path === '/') {
                route.path = `/${result[1]}`;
              } else {
                route.path = `/${result[1]}${route.path}`;
              }
            }
          }
          return {
            ...route,
          };
        },
      }),
      Layouts({ defaultLayout: 'default/index' }),
      // mock支持
      viteMockServe({
        mockPath: 'mock',
        localEnabled: mode === 'development' && VITE_MOCK,
        prodEnabled: command !== 'serve' && VITE_MOCK,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: true,
        watchFiles: true,
      }),
    ].concat(customPlugin),
    build: {
      target: 'es2015',
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      // sourcemap: true,
    },
    resolve: {
      alias: {
        '@build': resolve(__dirname, './build'),
        '/@': resolve(__dirname, './src'),
        '/#': resolve(__dirname, './types'),
      },
    },
    base: loadEnv(mode, process.cwd()).VITE_PUBLIC_PATH,
    server: {
      port: VITE_PORT,
      // open: true,
      cors: true,
      proxy: createProxy(VITE_PROXY),
      host: '0.0.0.0'
    },
    optimizeDeps: {
      include: [
        'crypto-js',
        'axios',
        'current-device',
        '@vueuse/motion',
        '@vueuse/core',
        'dayjs',
        'lodash-es',
        'element-plus/es',
        'element-plus/es/components/icon/style/css',
        '@micro-zoe/micro-app',
      ],
    },
  });
};
