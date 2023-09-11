<template>
  <div class="text-sm cpvf-breadcrumbs">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="(bread, index) in breads"
        :key="index"
        :to="bread.path"
      >
        {{ bread.meta?.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <!--    <ul>-->
    <!--      <li v-for="(bread, index) in breads" :key="index">-->
    <!--        <a v-if="index !== breads.length - 1" @click="push(bread.path)">{{-->
    <!--          bread.title-->
    <!--        }}</a>-->
    <!--        <span v-else></span>-->
    <!--      </li>-->
    <!--    </ul>-->
  </div>
</template>

<script setup lang="ts" name="SysBreadcrumbs">
  import { PropType } from 'vue';
  // import router from '/@/router';
  import { ArrowRight } from '@element-plus/icons-vue';
  import { Menu } from '/@/stores/types';
  // import { transformI18n } from '/@/utils/i18n';
  // import { projectSettings } from '/@/settings/config/projectConfig';
  // import { I18nTypeEnum } from '/@/enums/appEnum';

  // const { push } = router;

  defineProps({
    breads: {
      type: Array as PropType<Menu[]>,
      default: () => [],
    },
    useI18n: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    i18nType: {
      type: String as PropType<string>,
      default: 'menus.',
    },
  });

  // function showTitle(bread: Breads) {
  //   const projectLocale = projectSettings.Locale;
  //   if (projectLocale === I18nTypeEnum.none) {
  //     return bread.title;
  //   }
  //   return transformI18n(
  //     (props.useI18n ? props.i18nType : '') + bread.name,
  //     props.useI18n,
  //   );
  // }
</script>
