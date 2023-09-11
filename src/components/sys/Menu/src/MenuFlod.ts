import { ref, watch } from 'vue';

const useMenuFlod = (props) => {
  // 折叠菜单的path
  const flod = ref<string>('');

  /**
   * menu菜单折叠
   */
  function setFlod(path: string) {
    if (props.collapsed) return;
    if (flod.value === path) {
      flod.value = '';
      return;
    }
    flod.value = path;
  }

  /**
   * 监听菜单的展开与折叠
   */
  watch(
    () => props.flodPath,
    (newFloded, _) => {
      // 监听父级组件的折叠菜单是否发生改变
      flod.value = newFloded;
    },
  );

  watch(
    () => props.collapsed,
    (newFloded, _) => {
      if (newFloded) {
        flod.value = '';
      }
      // flod.value = newFloded ? '' : unref(currentRoute).path;
    },
  );
  return { flod, setFlod };
};

export { useMenuFlod };
