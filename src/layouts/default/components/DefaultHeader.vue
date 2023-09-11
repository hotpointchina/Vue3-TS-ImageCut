<template>
  <header class="
          flex
          items-center
          px-4
          h-full
          bg-white
          border-b border-solid border-light-blue-500
        ">
    <sys-icon :type="getMenuCollapsed ? 'Expand' : 'Fold'" :size="18" @click="toggleCollapsed" />
    <span class="flex-1 pl-3">
      <sys-breadcrumbs :breads="breads" />
    </span>

    <div class="user_info">
      <span>{{ (currentUserInfo as UserInfo)?.nickname }}</span>
      <span>{{ (currentUserInfo as UserInfo)?.orgName }}</span>
    </div>

    <div>
      <!-- <span class="font-bold">租户：</span> -->
      <el-dropdown trigger="click" class="pr-5 !w-max">
        <!-- <span class="el-dropdown-link text-base flex items-center"> -->
        <!-- <span
            :class="
              useTenant.getCurTenant.tenantName ? 'text-gray-800' : 'text-gray-300'
            "
            >{{ useTenant.getCurTenant.tenantName || '请添加租户' }}</span
          > -->
        <!-- <el-icon><QuestionFilled /></el-icon> -->
        <sys-icon class="ml-2" type="QuestionFilled" color="#5e5f77" size="22" />
        <!-- </span> -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in useTenant.getTenantInfos" @click="setCurTenant(item)" :key="item.id">
              {{ item.tenantName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div>
      <!-- <span class="font-bold">项目：</span> -->
      <el-dropdown trigger="hover" class="pr-5 !w-max">
        <!-- <span class="el-dropdown-link text-base flex items-center">
          <span :class="curProject.projectName ? 'text-gray-800' : 'text-gray-300'">{{
            curProject.projectName || '请添加项目'
          }}</span> -->

        <el-badge :is-dot="news" class="item">
          <sys-icon class="ml-2" type="Bell" size="22" />
        </el-badge>
        <!-- </span> -->
        <template #dropdown>
          <el-dropdown-menu style="width: 300px">
            <el-dropdown-item v-for="item in projects" @click="setCurProject(item)" :key="item.id">
              <div><el-badge class="mark" :value="0" :hidden="false" :is-dot="true">
                  <p>{{ item.noticeTitle }}</p>
                </el-badge>
                <p style="width: 250px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      ">{{ item.noticeContent }}</p>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided @click="message">进入消息中心</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="centerDialogVisible" :title="messageCenter.title" width="30%" center>
      <p style="text-align: center; margin-bottom: 20px">
        消息时间: {{ messageCenter.publishTime }}</p>
      <p>  {{ messageCenter.center }}</p>
    </el-dialog>

    <!--    <el-dropdown trigger="click" v-if="theme !== ThemeTypeEnum.none" class="pr-5">-->
    <!--      <span class="el-dropdown-link text-xl flex items-center">-->
    <!--        &lt;!&ndash;        {{ transformI18n(i18nType + 'changeTheme', isuseI18n) }}&ndash;&gt;-->
    <!--        <sys-icon type="Moon" :size="18" />-->
    <!--      </span>-->
    <!--      <template #dropdown>-->
    <!--        <el-dropdown-menu>-->
    <!--          <el-dropdown-item @click="changeColor(ThemeTypeEnum.default)"-->
    <!--            >默认主题</el-dropdown-item-->
    <!--          >-->
    <!--          <el-dropdown-item @click="changeColor(ThemeTypeEnum.red)">-->
    <!--            红色主题-->
    <!--          </el-dropdown-item>-->
    <!--        </el-dropdown-menu>-->
    <!--      </template>-->
    <!--    </el-dropdown>-->
    <!--    <el-dropdown-->
    <!--      trigger="click"-->
    <!--      v-if="projectLocale !== I18nTypeEnum.none"-->
    <!--      class="pr-5"-->
    <!--    >-->
    <!--      <span class="el-dropdown-link text-xl flex items-center">-->
    <!--        &lt;!&ndash;        {{ transformI18n(i18nType + 'changelanguage', isuseI18n) }}&ndash;&gt;-->
    <!--        <sys-icon type="Basketball" :size="18" />-->
    <!--      </span>-->
    <!--      <template #dropdown>-->
    <!--        <el-dropdown-menu>-->
    <!--          <el-dropdown-item @click="changeLang(I18nTypeEnum.zh)"-->
    <!--            >简体中文</el-dropdown-item-->
    <!--          >-->
    <!--          <el-dropdown-item @click="changeLang(I18nTypeEnum.en)">-->
    <!--            English-->
    <!--          </el-dropdown-item>-->
    <!--        </el-dropdown-menu>-->
    <!--      </template>-->
    <!--    </el-dropdown>-->
    <div class="flex items-center">
      <label class="btn btn-ghost btn-circle cpvf-avatar">
        <span class="w-10 rounded-full">
          <el-avatar class="w-16 h-16" :src="
            (userStore.getUserInfo && userStore.getUserInfo.avatar) ||
            '/resources/img/avatar.png'
          " />
        </span>
      </label>
      <el-dropdown trigger="click" class="pl-2 pr-8">
        <span class="text-base flex items-center">
          <!-- {{ userStore.getUserInfo.realName }} -->
          <sys-icon class="ml-2" type="ArrowDown" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="justify-center">{{ (currentUserInfo as UserInfo)?.username }}</el-dropdown-item>
            <el-dropdown-item class="justify-center" @click="updatePersonView()">个人信息</el-dropdown-item>
            <el-dropdown-item class="justify-center" @click="updatePassWord()">密码修改</el-dropdown-item>
            <el-dropdown-item @click="logout()">{{ transformI18n(i18nType + 'hsLoginOut', isuseI18n) }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
  <div>
    <el-dialog v-model="passWordOpen" title="密码修改" width="25%" top="15vh" :draggable="true">
      <updatePasswd :MSG="MSGNAME" @cancel="passWordClose"></updatePasswd>
    </el-dialog>
    <el-dialog v-model="personViewOpen" title="人员信息修改" width="50%" :draggable="true">
      <updatePerson :MSG="MSGID" @cancel="personClose"></updatePerson>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="DefaultHeader">
import { computed, ref, watchEffect, onMounted, watch } from 'vue';
import { useMenuSettings } from '/@/hooks/settings/useMenuSettings';
// import { localeSettings } from '/@/hooks/settings/localeSettings';
// import { themeSettings } from '/@/hooks/settings/themeSettings';
import SysBreadcrumbs from '/@/components/sys/Breadcrumbs';
import { useRouter } from 'vue-router';
import { usePermissionStore } from '/@/stores/modules/permission';
import { getAllParentMenus } from '/@/router/tools/menuTools';
import { cloneDeep } from 'lodash-es';
import { useUserStore } from '/@/stores/modules/user';
import { transformI18n } from '/@/utils/i18n';
import { I18nTypeEnum, ThemeTypeEnum } from '/@/enums/appEnum';
// import { projectSettings } from '/@/settings/config/projectConfig';
import SysIcon from '/@/components/sys/Icon';
import { useTenantStore } from '/@/stores/modules/tenant';
import {
  // ProjectInfo,  NoticeListParams,
  TenantInfo,
} from '/@/api/model/Tenant';
import { Menu } from '/@/stores/types';
// import { unmountAllApps } from '@micro-zoe/micro-app';
import { UserInfo } from '/#/store';
import { USER_INFO_KEY } from '/@/enums/cacheEnum';
import { messageReadID, detailNotice } from '/@/views/upms/api/messageCenter';
import updatePasswd from '/@/views/upms/pages/password/index.vue'
import updatePerson from '/@/views/upms/pages/password/updatePerson/index.vue'

const { toggleCollapsed, getMenuCollapsed } = useMenuSettings();
// const { changeLang } = localeSettings();
// const { changeColor } = themeSettings();
const i18nType = 'buttons.';
const isuseI18n = true;
// const projectLocale = projectSettings.locale;
// const theme = projectSettings.theme;
// 处理getMenuCollapsed的错误信息 => All destructured elements are unused.
defineExpose({ getMenuCollapsed, I18nTypeEnum, ThemeTypeEnum });
const { currentRoute } = useRouter();
const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const menus = permissionStore.menuList;
const breads = ref<Menu[]>([]);
const centerDialogVisible = ref(false);
watchEffect(async () => {
  breads.value = getAllParentMenus(cloneDeep(menus), currentRoute.value.path);
});
// 租户相关的处理
const useTenant = useTenantStore();
const projects = computed(() => useTenant.getProjectInfos);
// const curProject = computed(() => useTenant.getCurProject);
async function requestTenantProject() {
  await useTenant.requestData(userStore.getUserInfo);
}
// 租户字典
// const useDict = useDictStore();

requestTenantProject();
async function setCurTenant(tenant: TenantInfo) {
  useTenant.setCurTenant(tenant);
  // useDict.reqDict(tenant.id);
  // 获取新的项目列表
  await useTenant.requestProjectInfos();
  let userInfo = cloneDeep(userStore.getUserInfo);

  userInfo.projectId = useTenant.getCurProject.id;
  userInfo.tenantId = tenant.id;
  // 刷新用户信息
  userStore.setUserInfo(userInfo);
  // 刷新租户数据
  await userStore.refreshUserData();
}
async function smallClick() {
  await useTenant.setProjectList();
}
const messageCenter = ref({
  title: '',
  center: '',
  publishTime: '',
});
const news = ref(false);
watch(
  () => projects.value.length,
  (newMessage) => {
    if (newMessage > 0) {
      news.value = true;
    } else {
      return (news.value = false);
    }
  },
  { immediate: true, deep: true },
);
async function setCurProject(obj) {
  // let userInfo = cloneDeep(userStore.getUserInfo);
  // userInfo.projectId = project.id;
  // userStore.setUserInfo(userInfo);
  // useTenant.setCurProject(project);
  // 刷新租户数据
  // await userStore.refreshUserData();

  centerDialogVisible.value = true;
  messageCenter.value.center = obj.noticeContent;
  messageCenter.value.title = obj.noticeTitle;
  messageCenter.value.publishTime = obj.publishTime;
  let template: string[] = [];
  template.push(obj.id);
  messageReadID(template).then((res) => {
    console.log('messageReadID', res);
  });
  detailNotice(obj.id).then((res) => {
    console.log('detailNotice', res);
  });
  smallClick();
}
const message = () => {
  console.log('这是消息中心');
  router.push({ path: '/upms/messagecenter' });
};


const logout = () => {
  userStore.logout();
  // unmountAllApps({ clearAliveState: true }).then(() => console.log('卸载子应用成功'));
  // unmountAllApps({ destroy: true, clearAliveState: true }).then(() =>
  //   console.log('卸载子应用成功'),
  // );
  // console.log('pool-app', document.getElementById('pool-app'));
  // document.getElementById('pool-app')?.remove();
};
const currentUserInfo = ref<UserInfo>();
onMounted(() => {
  smallClick();
  type userInfoSession = UserInfo | string;
  let userInfo: userInfoSession =
    sessionStorage.getItem(USER_INFO_KEY) ||
    JSON.stringify({
      avatar: '',
      nickname: '',
      orgCode: '',
      orgName: '',
      token: '',
      userId: '',
      username: '',
    });
  try {
    userInfo = JSON.parse(userInfo);
  } catch (error) { }
  currentUserInfo.value = userInfo as UserInfo;
});
/**密码修改 */
const passWordOpen = ref(false)
const MSGNAME = ref('')
const updatePassWord = () => {
  passWordOpen.value = true
  MSGNAME.value = currentUserInfo.value?.username as string
}
function passWordClose(val) {
  passWordOpen.value = val;
  MSGNAME.value = ''
}
/**人员信息修改 */
const MSGID = ref('')
const personViewOpen = ref(false)
const updatePersonView = () => {
  personViewOpen.value = true
  MSGID.value = currentUserInfo.value?.userId as string
}
function personClose(val) {
  MSGID.value = ''
  personViewOpen.value = val;
}
</script>
<style lang="scss" scoped>
.user_info {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-end;
  margin-right: 0.625rem;
  padding-right: 0.625rem;
  border-right: 1px solid #9d9d9f;
  color: #5e5f77;
  line-height: 16px;

  & span {
    text-align: right;
  }
}

.item {
  margin-top: 5px;
  margin-right: 40px;
}

:deep(.el-dropdown-menu__item:nth-child(-n + 3)) {
  border-bottom: 1px solid #ecedf0;
}

:deep(.el-dialog__body) {
  padding: 0 25px 25px;
}
.edit_page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 100%;
    height: calc(100vh - 60px);
    background: white none;
    overflow-y: auto;
  }
</style>
