import { ref } from 'vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export const userPagination = (emits) => {
  const locale = zhCn;
  const small = ref(false);
  const background = ref(true);
  const disabled = ref(false);

  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
    emits('sizeChange', val);
  };
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
    emits('pageChange', val);
  };

  return { handleSizeChange, handleCurrentChange, small, background, disabled, locale };
};
