<route lang="yaml">
name: NOT_FOUND
</route>
<script setup lang="ts" name="NOT_FOUND">
  import { computed } from 'vue';
  import four from '/@/assets/images/404.png';
  import { warpperEnv } from '@build/index';

  const message = computed(() => {
    return '页面未找到！';
  });

  const { VITE_APP_TITLE } = warpperEnv();
</script>

<template>
  <div class="flex items-center h-full">
    <div class="md:flex">
      <div class="w-1/2"><static-file :src="four" type="img" /></div>
      <div class="flex items-center w-1/2">
        <div class="px-2 bullshit">
          <div class="bullshit__oops">{{ VITE_APP_TITLE }}</div>
          <div class="bullshit__headline">{{ message }}</div>
          <div class="bullshit__info"> 请检查页面是否存在 . </div>
          <a href="" class="bullshit__return-home">Back to home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .bullshit {
    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(60px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    float: left;
    //padding: 30px 30px;
    overflow: hidden;

    &__oops {
      margin-bottom: 20px;
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &__headline {
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: bold;
      line-height: 24px;
      color: #222;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      margin-bottom: 30px;
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      font-size: 14px;
      line-height: 36px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: #1482f0;
      border-radius: 100px;
      opacity: 0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
  }
</style>
