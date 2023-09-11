<template>
  <div class="page-example">
    <button class="cpvf-btn">Button</button>
    <button class="cpvf-btn cpvf-btn-primary">Button</button>
    <button class="cpvf-btn cpvf-btn-secondary">Button</button>
    <button class="cpvf-btn cpvf-btn-accent">Button</button>
    <button class="cpvf-btn cpvf-btn-ghost">Button</button>
    <button class="cpvf-btn cpvf-btn-link">Button</button>
    <!-- The button to open modal -->
    <label for="my-modal" class="cpvf-btn cpvf-modal-button">open modal</label>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="my-modal" class="cpvf-modal-toggle" />
    <div class="cpvf-modal">
      <div class="cpvf-modal-box">
        <h3 class="font-bold text-lg">Congratulations random Interner user!</h3>
        <p class="py-4">
          You've been selected for a chance to get one year of subscription to use
          Wikipedia for free!
        </p>
        <div class="cpvf-modal-action">
          <label for="my-modal" class="cpvf-btn">Yay!</label>
        </div>
      </div>
    </div>
  </div>
  <button class="cpvf-btn cpvf-btn-primary" @click="showMessage">Message</button>
  <button
    class="cpvf-btn cpvf-btn-primary"
    @click="push({ path: '/example3/user', query: { c: '111' } })"
    >带参数跳转</button
  >
  <!--  <cp-modal></cp-modal>-->
  <div>111</div>
  <div>111</div>
  <div>111</div>
  <div>111</div>
  <div>111</div>
</template>

<script lang="ts" setup name="PageExample2">
  import { useMessage } from '/@/hooks/web/useMesage';
  import { defHttp } from '/@/utils/axios';
  import router from '/@/router';

  const { createMessage } = useMessage();
  const { push } = router;

  function showMessage() {
    // Message({
    //   type: 'error',
    //   content: '3456',
    // });
    createMessage.warning('222224444');
    defHttp.get({ url: '/1111' });
  }
</script>

<route lang="yaml">
name: PageExample3
# 类别名，每一个菜单都有目录和菜单属性，如果没有子菜单，那么当前就是菜单；如果有子菜单，那么category会作为折叠菜单
label: 项目分类
#redirect:
#  path: /example2/user # 跳转到example2/user/index.vue => /example2/user
#  name: example2-user
meta:
  title: 测试
  categoryIcon: menu
</route>
