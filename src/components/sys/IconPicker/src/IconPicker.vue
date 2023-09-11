<template>
  <el-input v-model="selectIcon" placeholder="请选择图标" disabled>
    <template #append>
      <el-button ref="buttonRef" icon="MoreFilled" />
    </template>
  </el-input>
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    title="选择图标"
    virtual-triggering
    width="240px"
  >
    <el-input v-model="searchIcon" placeholder="搜索图标" clearable @input="search" />
    <el-scrollbar height="200px" class="scroll-wrap">
      <ul class="icon-wrap">
        <li v-for="icon in iconList" :key="icon" @click="clickIcon(icon)">
          <el-icon>
            <component :is="icon" />
          </el-icon>
        </li>
      </ul>
    </el-scrollbar>
  </el-popover>
</template>
<script lang="ts" setup>
  import { icons } from '../data/icons.data';
  import { ref, Ref, PropType, watch } from 'vue';
  // console.error(22, icons);
  let iconList: Ref<Array<string>> = ref([]);
  iconList.value = icons;
  const iconsCopy = JSON.parse(JSON.stringify(icons));
  let selectIcon = ref('');
  let searchIcon = ref('');
  const buttonRef = ref();
  const props = defineProps({
    name: {
      type: String as PropType<string>,
      default: '',
    },
  });
  watch(
    () => {
      props.name;
    },
    () => {
      selectIcon.value = props.name || '';
    },
    {
      immediate: true,
      deep: true,
    },
  );
  // selectIcon.value = props.name || '';
  // console.log(11, props.name);
  const emits = defineEmits(['select']);
  function search(val: string) {
    const arr: Array<string> = [];
    if (!val) {
      iconList.value = iconsCopy;
      return;
    }
    icons.forEach((item: string) => {
      if (item.includes(val)) {
        arr.push(item);
      }
    });
    iconList.value = arr;
  }
  function clickIcon(icon) {
    selectIcon.value = icon;
    emits('select', icon);
  }
</script>
<style lang="css">
  .scroll-wrap {
    padding-right: 10px;
  }

  .icon-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .icon-wrap li {
    width: 35px;
    height: 35px;
    border: 1px solid #dcdfe6;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    margin-top: 6px;
  }

  .icon-wrap li:hover {
    border-color: #409eff;
  }
</style>
