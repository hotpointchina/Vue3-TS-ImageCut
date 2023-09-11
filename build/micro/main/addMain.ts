/**
 * 自定义插件，将微前端主应用部分注入到 main.ts中
 */
import type { Plugin } from 'vite';
import microApp from '@micro-zoe/micro-app';
import { allMicroApp, AllMicroApps } from './allMicroApps';

const modulesList: AllMicroApps[] = [];
for (const one of allMicroApp) {
  modulesList[one.name] = [
    {
      loader(code) {
        if (process.env.NODE_ENV === 'development') {
          // 这里 /basename/ 需要和子应用vite.config.js中base的配置保持一致
          code = code.replace(
            new RegExp(`(from|import)(\\s*['"])(${one.prefix})`, 'g'),
            (all) => {
              console.log(one.name, all);
              return all.replace(one.prefix, one.url);
            },
          );
        }
        return code;
      },
    },
  ];
}

export function microStart() {
  microApp.start({
    plugins: {
      modules: modulesList as any,
    },
  });
}

export const microMainPlugin = () => {
  return <Plugin>{
    name: 'microMainPlugin',
    transform(code, id) {
      // 判断当前处理的是否是 _src/main.ts_
      if (id.includes('src/main.ts')) {
        // 添加MicroApp的引用
        const microStart = `
import { microStart } from '../build/micro/main';
microStart();
        `;
        code = code.replace('bootstrap();', `${microStart}\nbootstrap();`);
        return code;
      }
      return code;
    },
  };
};
