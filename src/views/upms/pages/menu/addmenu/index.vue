<route lang="yaml">
name: ADD
</route>

<template>
  <div class="dept_all">
    <div class="search_top flex flex-row justify-between items-center w-full pb-9px">
      <h1 class="page_title">{{ type === 'add' ? '添加菜单' : '编辑菜单' }}</h1>
    </div>

    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="84px"
      class="gy-form flex flex-col flex-wrap justify-center item-start w-550px"
      size="default"
      status-icon
    >
      <el-form-item prop="parentId" label="父级菜单" class="w-full">
        <el-tree-select
          v-model="ruleForm.parentId"
          placeholder=""
          :data="parentMenu"
          :check-strictly="true"
          @node-click="nodeClick"
          :props="props"
        >
          <!-- <el-option
            v-for="item in parentMenu"
            key="item.value"
            :label="item.label"
            :value="item.value"
          /> -->
        </el-tree-select>
        <!-- <el-input v-model="ruleForm.parent" placeholder="父级菜单名称" /> -->
      </el-form-item>

      <el-form-item prop="name" label="菜单名称" class="w-full">
        <el-input v-model="ruleForm.name" placeholder="请输入菜单名称" />
      </el-form-item>

      <el-form-item prop="typeBtn" label="菜单类型" class="w-full">
        <el-radio-group v-model="ruleForm.typeBtn" class="ml-4">
          <el-radio label="CATALOG">目录</el-radio>
          <el-radio label="MENU">菜单</el-radio>
          <el-radio v-if="ruleForm.type == 'MENU'" label="BUTTON">按钮</el-radio>
          <el-radio label="EXTLINK">外链</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        prop="visible"
        label="状态"
        class="w-full"
        v-if="route.query.nodeType == '' || route.query.nodeType == 'CATALOG'"
      >
        <el-radio-group v-model="ruleForm.visible" class="ml-4">
          <el-radio label="1">显示</el-radio>
          <el-radio label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="route.query.nodeType == 'MENU'"
        prop="visible"
        label="是否隐藏"
        class="w-full"
      >
        <el-radio-group v-model="ruleForm.visible" class="ml-4">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.typeBtn == 'MENU' || ruleForm.typeBtn == 'CATALOG'"
        prop="path"
        label="路由路径"
        class="w-full"
      >
        <el-input v-model="ruleForm.path" />
        <template #prepend>src/views/upms/</template>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.typeBtn == 'BUTTON'"
        prop="urlPerm"
        label="路由路径"
        class="w-full"
      >
        <el-input v-model="ruleForm.urlPerm">
          <template #prepend>
            <el-select
              v-model="ruleForm.method"
              placeholder="请选择"
              style="width: 115px"
            >
              <el-option label="get" value="get" />
              <el-option label="post" value="post" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.typeBtn == 'EXTLINK'"
        prop="path"
        label="外链地址"
        class="w-full"
      >
        <el-input v-model="ruleForm.path" />
      </el-form-item>
      <el-form-item
        v-if="ruleForm.typeBtn == 'MENU'"
        prop="component"
        label="组件路径"
        class="w-full"
      >
        <el-input v-model="ruleForm.component" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item prop="component" label="组件路径" class="w-full">
        <el-input v-model="ruleForm.component">
          <template #prepend>src/views/upms/</template>
          <template #append>.vue</template>
        </el-input>
      </el-form-item> -->
      <el-form-item
        v-if="route.query.nodeType == 'MENU'"
        prop="method"
        label="请求"
        class="w-full"
      >
        <el-select v-model="ruleForm.method" placeholder="请选择">
          <el-option label="get" value="get" />
          <el-option label="post" value="post" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.type == 'BUTTON'"
        prop="btnPerm"
        label="字符串"
        class="w-full"
      >
        <el-input v-model="ruleForm.btnPerm" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="sort" label="排序" class="w-full">
        <el-input v-model="ruleForm.sort" type="number" placeholder="0" />
      </el-form-item>

      <el-row class="flex justify-start w-full ml-84px">
        <el-button @click="showEditPageClose(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitFrom(ruleFormRef)">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { FormRules, FormInstance, ElMessage } from 'element-plus';
  //   import { getTreeMenu, addMenu } from '/@/views/upms/api/system/menu';
  import { useRouter, useRoute } from 'vue-router';
  import {
    addMenu,
    addBtnForm,
    detailMenuForm,
    detailBtnForm,
    editBtnForm,
    getMenuTree,
    editMenuForm,
  } from '/@/views/upms/api/menu-manag';
  const router = useRouter();
  const route = useRoute();
  const emit = defineEmits(['getMenu', '']);

  // 明确页面类型是新增还是编辑
  let type = ref('');
  type.value = route.query.type as string;
  // 给一级菜单添加一个顶级菜单
  // const maxTreeData = ref([])
  // maxTreeData.value = treeData.value.push('顶级菜单')
  // form

  const props = {
    label: 'label',
    value: 'id',
    type: 'type',
    children: 'children',
  };

  type FormListType = {
    id: string;
    path: string; //路由路径
    name: string; //菜单名称
    component: string; //组件路径
    icon?: string;
    meta?: string;
    sort: string; //排序
    redirect: string; //跳转路径
    type: string; //菜单类型
    visible: string; //状态
    parentId: string; //父id
    parent: string; // 父级菜单
    isCache: string; //是否缓存
    method: string; //请求方式
    btnPerm: string; //权限字符串
    urlPerm: string;
    menuId: string;
    typeBtn: string;
  };

  // 新增/编辑 页面
  const ruleFormRef = ref<FormInstance>();

  // 关闭 新增/编辑 before
  const showEditPageClose = (formEl: FormInstance | undefined) => {
    router.push('/upms/menu/add');
    if (!formEl) return;
    formEl.resetFields();
  };
  // 新增/编辑 表单
  const ruleForm: FormListType = reactive({
    id: '',
    path: '/',
    name: '',
    component: '',
    icon: '',
    meta: '',
    sort: '0',
    redirect: '',
    type: '',
    visible: '1',
    parentId: '0',
    parent: '',
    isCache: '否',
    method: '',
    btnPerm: 'sys:user:add',
    urlPerm: '',
    menuId: '',
    typeBtn: 'CATALOG',
  });

  // 新增、添加名址表单的校验规则
  const rules = reactive<FormRules>({
    label: [
      {
        required: true,
        message: '请选择父级菜单',
        trigger: 'change',
      },
    ],
    name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    redirect: [{ required: false, message: '请输入跳转路径', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
    type: [{ required: true, message: '请输入选择类型', trigger: 'change' }],
    visible: [{ required: true, message: '请输入选择状态', trigger: 'change' }],
  });

  const parentMenu: any = ref([]);
  const getParentMenu = async () => {
    getMenuTree().then((res) => {
      parentMenu.value = res;
      parentMenu.value.push({ id: 0, label: '顶级菜单', type: 'CATALOG' });
    });
    if (route.query.type == 'add' && route.query.name == '') {
      ruleForm.parent = '顶级菜单';
    } else if (route.query.nodeData) {
      ruleForm.parent = route.query.name as string;
      ruleForm.parentId = route.query.nodeData as string;
      ruleForm.menuId = route.query.nodeData as string;
    }
    if (route.query.type == 'edit' && route.query.name == '') {
      ruleForm.parent = '顶级菜单';
      ruleForm.id = route.query.id as string;
      detailMenuForm(ruleForm.id).then((res) => {
        if (res.visible == '启用') {
          res.visible = '1';
        } else {
          res.visible = '0';
        }
        if (res.type == 'CATALOG') {
          res.type = '2';
        } else if (res.type == 'MENU') {
          res.type = '1';
        }
        Object.keys(ruleForm).forEach((key) => {
          ruleForm[key] = res[key];
        });

        ruleForm.parent = '顶级菜单';
      });
    } else if (route.query.nodeData) {
      ruleForm.parent = route.query.name as string;
      ruleForm.parentId = route.query.nodeData as string;
      ruleForm.menuId = route.query.nodeData as string;
    }

    if (route.query.type == 'edit' && route.query.nodeType == 'CATALOG') {
      ruleForm.id = route.query.id as string;
      detailMenuForm(ruleForm.id).then((res) => {
        if (res.visible == '停用' && res.type == 'MENU') {
          res.visible = '0';
          res.type = '1';
        } else {
          res.visible = '1';
          res.type = '2';
        }
        Object.keys(ruleForm).forEach((key) => {
          ruleForm[key] = res[key];
        });
        ruleForm.parent = route.query.name as string;
      });
      console.log(123);
    }
    if (route.query.type == 'edit' && route.query.nodeType == 'MENU') {
      ruleForm.id = route.query.id as string;
      detailBtnForm(ruleForm.id).then((res) => {
        if (res.visible == '停用' && res.btnPerm !== '') {
          res.visible = '0';
          res.type = '3';
        } else {
          res.visible = '1';
          res.type = '3';
        }

        Object.keys(ruleForm).forEach((key) => {
          ruleForm[key] = res[key];
        });
        ruleForm.parent = route.query.name as string;
      });
      console.log(123);
    }
  };
  getParentMenu();
  function nodeClick(val) {
    console.log(val);
    ruleForm.type = val.type;
  }

  // 提交 新增/编辑 表单
  const submitFrom = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    // 表单校验
    await formEl.validate((valid, fields) => {
      if (valid) {
        // 验证通过
        const params: any = getParams();

        console.log(ruleForm);
        if (ruleForm.type == 'BUTTON') {
          if (route.query.type == 'add') {
            addBtnForm(params).then(() => {
              ElMessage({
                message: '新增三级菜单成功',
                type: 'success',
              });
              showEditPageClose(formEl);
              emit('getMenu');
            });
          } else {
            editBtnForm(params).then(() => {
              ElMessage({
                message: '修改三级菜单成功',
                type: 'success',
              });
              showEditPageClose(formEl);
              emit('getMenu');
            });
          }
        } else {
          if (route.query.type == 'add') {
            addMenu(params).then((res) => {
              if (res.code == '0000') {
                ElMessage({
                  message: '新增一二级菜单成功',
                  type: 'success',
                });
                showEditPageClose(formEl);
                emit('getMenu');
              }
            });
          } else {
            editMenuForm(params).then(() => {
              ElMessage({
                message: '修改一二级菜单成功',
                type: 'success',
              });
              showEditPageClose(formEl);
              emit('getMenu');
            });
          }
        }
      } else {
        console.log('error submitFrom!', fields);
      }
    });
  };
  function getParams() {
    return {
      ...ruleForm,
      parentId: ruleForm.parentId || '0',
    };
  }
  // 父级菜单
</script>

<style scoped>
  .dept_all {
    padding: 29px 24px;
    /* margin-left: 36px; */
  }

  .page_title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    color: #33344a;
    font-weight: bold;
  }

  .page_title::before {
    content: ' ';
    display: block;
    width: 4px;
    height: 18px;
    margin: 0 9px 0 0;
    padding: 0;
    background: #18ae66;
  }

  .gy-form:deep(.el-select.el-select--default),
  .gy-form:deep(.el-input-number.el-input-number--default) {
    width: 100%;
  }
</style>
