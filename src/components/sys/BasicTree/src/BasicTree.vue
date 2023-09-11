<template>
  <div class="p-2">
    <div class="flex items-center justify-between tree-header">
      <div>
        <span class="pl-2 text-xs">{{ treeTitle }}</span>
      </div>
      <div>
        <el-input v-model="searchValue" placeholder="请输入内容">
          <template #suffix>
            <el-icon class="el-input__icon"><Search @click="searchNode" /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <el-divider />
    <el-tree
      v-bind="$attrs"
      :data="data"
      :filter-node-method="filterNode"
      ref="treeRef"
      :default-expanded-keys="expandedKeys"
      node-key="id"
      :expand-on-click-node="false"
      :highlight-current="true"
      @node-click="nodeClick"
    />
  </div>
</template>
<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue';
  import { nextTick, PropType, ref, watch } from 'vue';
  import { TreeItem } from '../types';
  import { ElTree } from 'element-plus';
  const props = defineProps({
    treeTitle: {
      type: String as PropType<string>,
      default: () => '机构列表',
    },
    data: {
      type: Array as PropType<TreeItem[]>,
      default: () => [],
    },
    expandedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    checkedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  let emits = defineEmits(['nodeClick', 'checkedGetData']);
  const searchValue = ref('');
  const treeRef = ref<InstanceType<typeof ElTree>>();

  watch(
    () => props.checkedKeys,
    (value) => {
      treeRef.value?.setCheckedKeys([]);
      nextTick(() => {
        treeRef.value?.setCheckedKeys(value);
      });
    },
    { immediate: true, deep: true },
  );

  function searchNode() {
    treeRef.value!.filter(searchValue.value);
  }

  const filterNode = (value: string, data: any) => {
    if (!value) return true;
    return data.label.includes(value);
  };

  /**
   * 点击事件
   * @param treeNode
   */
  function nodeClick(treeNode: TreeItem) {
    emits('nodeClick', treeNode);
  }

  /**
   * 添加根节点
   */
  function addTopNode(node: TreeItem) {
    if (props.data[0]) {
      treeRef.value?.insertBefore(node, props.data[0]);
    } else {
      //树形没有数据处理
      treeRef.value?.append(node, '');
    }
  }

  /**
   * 添加子节点
   * @param node
   * @param parentId
   */
  function addLevelNode(node: TreeItem, parentId: string) {
    treeRef.value?.append(node, parentId);
  }

  /**
   * 设置高亮
   * @param id
   */
  function setCurrentKey(id: Nullable<string | number>) {
    treeRef.value?.setCurrentKey(id as any);
  }

  /**
   * 删除节点
   * @param node
   */
  function removeNode(node: TreeItem) {
    treeRef.value?.remove(node);
  }

  /**
   *
   */
  function setCheckedKeys(keys: string[] | number[]) {
    treeRef.value?.setCheckedKeys(keys);
  }

  /**
   * 返回当前半选的keys
   */
  function getHalfCheckedKeys() {
    return treeRef.value?.getHalfCheckedKeys();
  }
  defineExpose({
    setCheckedKeys,
    addTopNode,
    addLevelNode,
    setCurrentKey,
    removeNode,
    getHalfCheckedKeys,
  });
</script>

<style scoped>
  :deep(.el-divider--horizontal) {
    margin: 5px 0;
  }
</style>
