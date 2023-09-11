<template>
  <div class="content mx-2">
    <el-card class="mb-2" shadow="hover">
      <div class="py-4 font-bold">工作台</div>
      <el-row>
        <el-col :xs="24" :md="16">
          <div class="flex items-center">
            <div class="pr-4 flex items-center">
              <el-avatar
                class="w-16 h-16"
                :src="userStore.getUserInfo.avatar || '/resources/img/avatar.png'"
              />
            </div>
            <div>
              <div class="text-xl"
                >你好，{{ userStore.getUserInfo.realName }} ，祝你开心每一天！</div
              >
              <div class="text-sm text-gray-400 pt-2">{{
                userStore.getUserInfo.deptName
              }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="8" v-if="false">
          <div class="flex items-center flex-row-reverse">
            <div class="px-1 text-center">
              <div class="text-sm text-gray-400 pb-2">访问量</div>
              <div class="text-xl">3,344</div>
            </div>
            <el-divider direction="vertical" class="h-8" />
            <div class="px-1 text-center">
              <div class="text-sm text-gray-400 pb-2">排名</div>
              <div class="text-xl">1/100</div>
            </div>
            <el-divider direction="vertical" class="h-8" />
            <div class="px-1 text-center">
              <div class="text-sm text-gray-400 pb-2">项目数量</div>
              <div class="text-xl">100</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="15">
      <el-col :md="24" :lg="24">
        <el-card shadow="hover" class="mb-2">
          <template #header>
            <div class="flex justify-between items-center">
              <span>进行中的项目</span>
              <el-link type="primary" :underline="false" href="upms/tenant/project"
                >全部项目</el-link
              >
            </div>
          </template>
          <div class="flex flex-wrap" v-if="projectListData.length > 0">
            <List :span="8" :list="projectListData" />
          </div>
          <el-empty :image-size="200" v-else description="暂无数据" />
        </el-card>
      </el-col>
      <el-col :md="24" :lg="8" v-if="false">
        <el-card shadow="hover" class="mb-2">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>快速开始</span>
            </div>
          </template>
          <div class="flex flex-wrap">
            <div v-for="o in 7" :key="o" class="p-1">
              <el-tag>{{ '操作 ' + o }}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div v-if="dialogVisibleAuto">
      <div v-show="dialogVisible">
        <el-dialog
          v-model="dialogVisibles"
          width="40%"
          :close-on-click-modal="false"
          :show-close="false"
          :destroy-on-close="close"
        >
          <template #header>
            <div class="my-header">
              <h1 style="font-size: 24px; font-weight: bold">{{
                assContent.noticeTitle
              }}</h1>
              <p style="text-align: center; margin-bottom: 20px"
                >发布时间: {{ assContent.publishTime }}</p
              >
            </div>
          </template>
          <div
            :style="{ 'min-height': 100 + 'px', 'max-height': 300 + 'px' }"
            style="overflow-y: auto"
          >
            <p v-if="assContent.textType == '文本'">
              {{ assContent.noticeContent }}
            </p>
            <div
              v-else-if="assContent.textType == '编辑器'"
              v-html="assContent.noticeContent"
            >
            </div>
            <span class="dialog-footer">
              <!-- <el-radio v-model="noRadio" label="1" size="large">下次不再弹出</el-radio> -->
              <el-button type="primary" @click="affirmClick"> 确认 </el-button>
            </span>
          </div>
        </el-dialog>
      </div>
      <div v-show="!dialogVisible">
        <el-dialog
          v-model="dialogVisibles"
          width="40%"
          :close-on-click-modal="false"
          :show-close="false"
          :destroy-on-close="close"
        >
          <template #header>
            <div class="my-header">
              <h1 style="font-size: 24px; font-weight: bold">{{
                assContent.noticeTitle
              }}</h1>
              <p style="text-align: center; margin-bottom: 20px"
                >发布时间: {{ assContent.publishTime }}</p
              >
            </div>
          </template>
          <div
            :style="{ 'min-height': 100 + 'px', 'max-height': 300 + 'px' }"
            style="overflow-y: auto"
          >
            <p v-if="assContent.textType == '文本'">
              {{ assContent.noticeContent }}
            </p>
            <div
              v-else-if="assContent.textType == '编辑器'"
              v-html="assContent.noticeContent"
            >
            </div>
            <span class="dialog-footer">
              <!-- <el-radio v-model="noRadio" label="1" size="large">下次不再弹出</el-radio> -->
              <el-button type="primary" @click="affirmClick"> 确认 </el-button>
            </span>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- <div style="width: 100vh;background-color: aqua;"></div> -->
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { useUserStore } from '/@/stores/modules/user';
  import { useTenantStore } from '/@/stores/modules/tenant';
  import List from '/@/views/dashboard/components/List.vue';
  import { announcementQueryParams } from '/@/views/upms/model/dashboardModel';
  // import { ListData } from '/@/views/dashboard/components/types';
  import {
    // GetProjectGroup,
    announcementList,
    announcementCheck,
  } from '../api/project';
  import {
    // ProjectListGetResultModel,
    formSearchType,
  } from '../api/model/projectModel';
  const userStore = useUserStore();
  const useTenant = useTenantStore();
  const dialogVisible = ref(false);
  const dialogVisibles = ref(true);

  const dialogVisibleAuto = ref(false);
  const content = ref<announcementQueryParams[]>([]);
  // const noRadio = ref('');
  const formSearch = ref<formSearchType>({
    tenantId: '',
  });
  const projectListData = ref([]);
  watch(
    () => useTenant.getCurTenant,
    (value) => {
      formSearch.value.tenantId = value.id || '';
      projectList();
    },
    {
      immediate: true,
      deep: true,
    },
  );
  /**
   * 项目列表
   */
  function projectList() {
    //   GetProjectGroup({
    //     pageNum: 1,
    //     pageSize: 1000,
    //     tenantId: formSearch.value.tenantId,
    //   }).then((res: ProjectListGetResultModel) => {
    //     projectListData.value = res.list;
    //   });
  }
  let contentIndex = 0;
  const assContent = ref<announcementQueryParams>({});
  function announcement() {
    announcementList().then((res) => {
      if (res.data.result.length > 0) {
        dialogVisible.value = true;
        dialogVisibleAuto.value = true;
        content.value = res.data.result;
        assContent.value = content.value[0];
      }
    });
  }
  const affirmClick = () => {
    contentIndex++;
    // 当点击确认时,将index+1的对话框显示
    if (dialogVisible.value) {
      dialogVisible.value = false;
    } else {
      dialogVisible.value = true;
    }
    const id = assContent.value.id as string;
    announcementCheck(id).then();
    // 判断索引等于列表的长度
    if (contentIndex == content.value.length) {
      dialogVisibleAuto.value = false;
      contentIndex = 0;
    } else {
      assContent.value = content.value[contentIndex];
    }
  };
  const close = () => {};
  onMounted(() => {
    announcement();
  });
  // const projectListData: ListData[] = [
  //   {
  //     imgUrl: '/resources/img/avatar.png',
  //     title: '公益项目',
  //     subTitle:
  //       '统一的开发规范，统一的脚手架(预置了各种解决方案的前端脚手架)，统一的流水线配置，丰富的组件和示例，完善的开发指南，协助开发者快速完成业务开发。',
  //     tag: '微服务组',
  //     time: '9小时前',
  //     href: 'javascript:;',
  //   },
  //   {
  //     imgUrl: '/resources/img/avatar.png',
  //     title: 'CRM项目',
  //     subTitle:
  //       '提供微前端解决方案，可以作为主应用或子应用，对接存量项目和其他异、同构语言项目。',
  //     tag: '微服务组',
  //     time: '9小时前',
  //   },
  //   {
  //     imgUrl: '/resources/img/avatar.png',
  //     title: '新一代寄递',
  //     subTitle:
  //       '插拔式开发模式，为业务的独立开发调试提供便利，支持一键实现业务模块合并与拆分。',
  //     tag: '微服务组',
  //     time: '9小时前',
  //   },
  //   {
  //     imgUrl: '/resources/img/avatar.png',
  //     title: '微营销',
  //     subTitle: '集成第三方组（25+）。',
  //     tag: '微服务组',
  //     time: '9小时前',
  //   },
  //   {
  //     imgUrl: '/resources/img/avatar.png',
  //     title: 'xxxx项目',
  //     subTitle: '组件示例（30+）。',
  //     tag: '微服务组',
  //     time: '9小时前',
  //   },
  //   {
  //     imgUrl: '/resources/img/avatar.png',
  //     title: 'xxxx项目',
  //     subTitle:
  //       '插拔式开发模式，为业务的独立开发调试提供便利，支持一键实现业务模块合并与拆分。',
  //     tag: '微服务组',
  //     time: '9小时前',
  //   },
  // ];
</script>
<style scoped>
  :deep(.dialog-footer) {
    display: flex;
    justify-content: end;
  }
  :deep(.el-dialog__body) {
    padding: 0 25px 25px;
  }
  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
