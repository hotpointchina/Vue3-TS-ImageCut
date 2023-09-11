<template>
  <el-row class="w-full">
    <el-col class="pb-2 pr-2" :span="span" v-for="(one, index) in list" :key="index">
      <el-card class="h-full relative" shadow="hover" :body-style="{ padding: '5px' }">
        <div class="flex items-center">
          <el-avatar
            class="w-16 h-16"
            :src="one.imgUrl || '/resources/img/avatar.png'"
          />
          <span class="font-medium pl-2">{{ one?.projectName }}</span>
        </div>
        <div class="p-2 mb-6">
          <div class="line">{{ one?.description }}</div>
          <div class="w-full absolute bottom-2 left-0 px-4 flex justify-between">
            <div
              ><time class="time">{{ one?.createdDate }}</time></div
            >
            <div v-if="false"
              ><el-link type="primary" :underline="false" href="javascript:;"
                >查看</el-link
              ></div
            >
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';
  import { ListData } from '/@/views/dashboard/components/types';

  defineProps({
    list: {
      type: Array as PropType<ListData[]>,
      default: () => {},
    },
    span: {
      type: Number as PropType<number>,
      default: 6,
    },
  });
</script>

<style scoped>
  .time {
    font-size: 12px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .line {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
</style>
