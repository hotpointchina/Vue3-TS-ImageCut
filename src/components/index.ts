import StaticFile from '/@/components/sys/StaticFile.vue';
import SvgIcon from '/@/components/sys/SvgIcon.vue';

const components = [StaticFile, SvgIcon];

const plugins = [];

function registerGlobComp(app: any) {
  components.forEach((component) => {
    app.component(component.name, component);
  });
}

function registerGlobPlugin(app: any) {
  plugins.forEach((plugin) => {
    app.use(plugin);
  });
}

export { registerGlobComp, registerGlobPlugin };
