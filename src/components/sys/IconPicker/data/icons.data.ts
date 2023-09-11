import * as ElementPlusIconsVue from '@element-plus/icons-vue';
const icons: Array<string> = [];
for (const icon of Object.values(ElementPlusIconsVue)) {
  icons.push(icon.name);
}
export { icons };
export default {
  icons,
};
