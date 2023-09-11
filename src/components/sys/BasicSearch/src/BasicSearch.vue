<template>
  <div>
    <div class="search-header">
      <div class="flex w-full">
        <el-row class="w-full" :gutter="10">
          <el-col :span="item.span" v-for="item in searchArray" :key="item.key">
            <div class="flex justify-between items-center">
              <div :style="{ width: `${item.labelWidth || labelWidth}px` }">
                <span>{{ item.label }}</span>
              </div>
              <el-input
                v-if="!item.component || item.component == 'Input'"
                placeholder="请输入内容"
                v-model="searchValue[item.key]"
                class="flex-1"
              />
              <el-date-picker
                v-else-if="item.component && item.component == 'DatePicker'"
                v-model="searchValue[item.key]"
                placeholder="请选择时间"
                class="flex-1"
              />
              <el-date-picker
                v-else-if="item.component && item.component == 'DatePickerTime'"
                v-model="searchValue[item.key]"
                datetime
                placeholder="请选择时间"
                class="flex-1"
              />
              <el-date-picker
                v-else-if="item.component && item.component == 'DateRangePicker'"
                type="daterange"
                v-model="searchValue[item.key]"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="flex-1"
              />
              <!-- :options="item.componentProps?.options" -->
              <el-select
                v-else-if="item.component && item.component == 'Select'"
                v-model="searchValue[item.key]"
                placeholder="请选择"
                class="flex-1"
              >
                <el-option
                  v-for="optionItem in item.componentProps?.options || []"
                  :key="optionItem.value"
                  :label="optionItem.label"
                  :value="optionItem.value"
                />
              </el-select>
            </div>
          </el-col>
          <el-col
            :offset="
              24 - countSpan - actionSpan < 0
                ? 24 - actionSpan
                : 24 - countSpan - actionSpan
            "
            :span="actionSpan"
          >
            <div ref="actionRef" class="btn-group">
              <slot name="button">
                <div v-if="actionWidth >= 135" class="flex">
                  <el-button type="primary" @click="onSearch">查询</el-button>
                  <el-button @click="reset">重置</el-button>
                </div>
                <el-dropdown v-if="actionWidth < 135" trigger="click" class="pl-2 pr-8">
                  <el-button type="primary" link
                    >操作<el-icon class="el-icon--right pt-1"><arrow-down /> </el-icon
                  ></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="onSearch">查询</el-dropdown-item>
                      <el-dropdown-item @click="reset">重置</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </slot>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
  import { PropType, watch, ref } from 'vue';
  import { useResizeObserver } from '@vueuse/core';

  interface SearchType {
    label: string;
    key: string;
    span?: number;
    width?: number | string;
    component?: string;
    labelWidth?: number;
    componentProps?: {
      options?: any[];
    };
  }
  const props = defineProps({
    searchArray: {
      type: Array as PropType<SearchType[]>,
      default: () => {},
    },
    labelWidth: {
      type: Number as PropType<number>,
      default: 80,
    },
    actionSpan: {
      type: Number as PropType<number>,
      default: 4,
    },
  });
  const countSpan = ref<number>(0);
  const searchValue = ref({});
  const emit = defineEmits(['onSearch', 'reset']);
  const actionRef = ref(null);
  const actionWidth = ref(0);
  const actionHeight = ref(0);
  useResizeObserver(actionRef, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    actionWidth.value = width;
    actionHeight.value = height;
  });
  watch(
    () => props.searchArray,
    (value) => {
      value.map((item) => {
        searchValue.value[item.key] = '';
        item.span = item.span || 6;
        countSpan.value += item.span;
        //搜索条件多，多行展示
        if (countSpan.value > 24) {
          countSpan.value = item.span;
        }
      });
      console.log(countSpan.value, 'countSpan');
      // formRules = ref(...fValue);
    },
    { immediate: true, deep: true },
  );
  const onSearch = () => {
    emit('onSearch', searchValue.value);
  };
  const reset = () => {
    searchValue.value = {};
    // Object.keys(searchValue.value).map(() => {
    //
    // });
    emit('reset', searchValue.value);
  };
  defineExpose({ searchValue });
</script>
<style scoped>
  .search-title span {
    margin-right: 10px;
  }

  .search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    margin: 5px 10px;
  }

  .w-full .el-col {
    margin-bottom: 10px;
  }
</style>
