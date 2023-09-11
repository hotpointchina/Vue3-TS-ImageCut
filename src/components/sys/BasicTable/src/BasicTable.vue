<template>
  <el-table v-bind="$attrs" :data="data" v-loading="loading">
    <template v-for="item in tableColumns" :key="item">
      <el-table-column
        v-if="
          typeof item.hideColumn === 'function' ? !item.hideColumn() : !item.hideColumn
        "
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        :align="item.align"
      >
        <template v-if="item.slot" #default="scope">
          <slot :name="item.slot" :record="scope.row" :column="item.prop"></slot>
        </template>
        <template v-else-if="item.ellipsis" #default="scope">
          <span class="column-ellipsis" :title="scope.row[item.prop]">{{
            scope.row[item.prop]
          }}</span>
        </template>
      </el-table-column>
    </template>
    <el-table-column
      v-if="actionColumn"
      :label="actionColumn?.label"
      :prop="actionColumn?.prop"
      :width="actionColumn?.width"
      :align="actionColumn?.align"
      :fixed="actionColumn?.fixed"
    >
      <template #default="scope">
        <slot name="action" :record="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
  <div class="py-5 flex justify-end">
    <el-config-provider :locale="locale">
      <el-pagination
        v-model:currentPage="currentPageNum"
        v-model:page-size="pageSizeNum"
        :page-sizes="pageSizes"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ComputedRef, PropType } from 'vue';
  import { TableOptions } from '../types';
  import { userPagination } from './Pagination';

  let props = defineProps({
    columns: {
      type: Array as PropType<TableOptions[]>,
      required: true,
    },
    data: {
      type: Array as PropType<any[]>,
      required: true,
    },
    currentPage: {
      type: Number as PropType<number>,
      default: 1,
    },
    pageSize: {
      type: Number as PropType<number>,
      default: 10,
    },
    pageSizes: {
      type: Array as PropType<number[]>,
      default: () => [10, 20, 30, 40, 50, 100],
    },
    total: {
      type: Number as PropType<number>,
      default: 0,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });

  let emits = defineEmits(['sizeChange', 'pageChange']);

  let tableColumns: ComputedRef<TableOptions[]> = computed(() =>
    props.columns.filter((item) => !item.action),
  );
  let actionColumn: ComputedRef<TableOptions | undefined> = computed(() =>
    props.columns.find((item) => item.action),
  );

  let currentPageNum: ComputedRef<number> = computed(() => props.currentPage);
  let pageSizeNum: ComputedRef<number> = computed(() => props.pageSize);

  const { handleSizeChange, handleCurrentChange, small, background, disabled, locale } =
    userPagination(emits);
  defineExpose({ handleSizeChange, handleCurrentChange });
  // 分页
</script>
<style scope>
  .column-ellipsis {
    width: 100%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
