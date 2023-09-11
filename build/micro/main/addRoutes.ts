/**
 * 自定义插件，将微前端主应用部分注入到 main.ts中
 */
import type { Plugin } from 'vite';

export const microRoutesPlugin = () => {
  return <Plugin>{
    name: 'microRoutesPlugin',
    transform(code, id) {
      // 判断当前处理的是否是 _src/main.ts_
      // if (path.join(config.root, 'src/router/index.ts') === id) {
      if (id.includes('src/router/index.ts')) {
        // 添加MicroApp的引用
        // const prepend = `import { microAppStart } from '../build/';\n`;
        const microRoutes = `
allRoutes.forEach((element) => {
  if (element.path == '/micro/app') {
    element.children?.push({
      component: () => import('/src/views/micro/pages/app.vue'),
      path: ':name',
      redirect: '',
    });
  }
  if (element.path == '/micro/vite') {
    element.children?.push({
      component: () => import('/src/views/micro/pages/vite.vue'),
      path: ':name',
      redirect: '',
    });
  }
});
        `;

        code = code.replace(
          'setupLayouts(generatedRoutes);',
          `setupLayouts(generatedRoutes);\n${microRoutes}\n`,
        );
        return code;
      }
      return code;
    },
  };
};
