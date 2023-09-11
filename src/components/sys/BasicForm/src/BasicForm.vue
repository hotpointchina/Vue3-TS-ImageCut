<template>
  <div class="form-all">
    <el-form
      v-bind="$attrs"
      ref="ruleFormRef"
      :model="formData"
      :rules="formRules"
      class="basic-form"
      :label-width="isNumber(labelWidth) ? `${labelWidth}px` : labelWidth"
    >
      <template v-for="item in formList" :key="item.field">
        <el-form-item
          v-if="
            typeof item.ifShow === 'function'
              ? item.ifShow(formData) !== false
              : item.ifShow !== false && !item.slot
          "
          v-show="item.show !== false"
          :label="item.label"
          :prop="item.field"
        >
          <el-input
            v-if="
              item.component === 'Input' ||
              item.component === 'InputPassword' ||
              item.component === 'InputTextArea'
            "
            v-model="formValue[item.field]"
            :disabled="item.componentProps?.disabled"
            :name="item.label"
            :required="item.required"
            :showEye="item.component === 'InputPassword'"
            :type="
              item.component === 'InputPassword'
                ? 'password'
                : item.component === 'InputTextArea'
                ? 'textarea'
                : ''
            "
          >
            <template v-if="item.componentProps?.appendText" #append>{{
              item.componentProps?.appendText
            }}</template>
            <template v-if="item.componentProps?.prependText" #prependText>{{
              item.componentProps?.prependText
            }}</template>
          </el-input>
          <el-radio-group
            v-else-if="item.component === 'RadioGroup'"
            v-model="formValue[item.field]"
          >
            <el-radio
              v-for="radio in item.componentProps?.options"
              :key="radio.value"
              :label="radio.value"
              >{{ radio.label }}</el-radio
            >
          </el-radio-group>
          <el-checkbox-group
            v-else-if="item.component === 'CheckboxGroup'"
            v-model="formValue[item.field]"
          >
            <el-checkbox
              v-for="check in item.componentProps?.options"
              :key="check.value"
              :label="check.value"
              >{{ check.label }}</el-checkbox
            >
          </el-checkbox-group>
          <el-select
            v-else-if="item.component === 'Select'"
            v-model="formValue[item.field]"
            :filterable="item.filterable"
            placeholder="请选择"
          >
            <el-option
              v-for="option in item.componentProps?.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-select
            v-else-if="item.component === 'SelectMultiple'"
            v-model="formValue[item.field]"
            placeholder="请选择"
            multiple
          >
            <el-option
              v-for="option in item.componentProps?.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-tree-select
            v-else-if="item.component === 'TreeSelect'"
            v-model="formValue[item.field]"
            :data="item.componentProps?.data"
            :multiple="item.componentProps?.multiple"
            :render-after-expand="false"
            :show-checkbox="item.componentProps?.showCheckbox"
            :node-key="item.componentProps?.nodeKey"
          />
        </el-form-item>
        <el-form-item v-if="item.slot" :label="item.label" :prop="item.field">
          <slot
            :name="item.slot"
            :value="formValue[item.field]"
            :record="formValue"
            :field="item.field"
          ></slot>
        </el-form-item>
      </template>
    </el-form>
    <slot name="footer">
      <div class="form-bottom">
        <el-button
          v-show="showSubmit"
          :disabled="disableSubmit"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >保存</el-button
        >
        <el-button v-show="showReset" @click="resetForm(ruleFormRef)">重置</el-button>
      </div>
    </slot>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, PropType } from 'vue';
  import type { FormInstance } from 'element-plus';
  import { FormOptions } from '/@/components/sys/BasicForm/types';
  import { isNumber } from '/@/utils/is';

  const props = defineProps({
    formList: {
      type: Array as PropType<FormOptions[]>,
      default: () => [],
      required: true,
    },
    isCreate: {
      // 是否为创建新表单
      type: Boolean as PropType<boolean>,
      default: true,
    },
    labelWidth: {
      type: [String, Number] as PropType<string | string>,
      default: '120px',
    },
    formData: {
      type: Object,
      default: () => {},
      required: true,
    },
    showSubmit: {
      // 是否显示保存按钮
      type: Boolean as PropType<boolean>,
      default: true,
    },
    disableSubmit: {
      // 保存按钮是否可用
      type: Boolean as PropType<boolean>,
      default: false,
    },
    showReset: {
      // 是否显示重置按钮
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });
  let formValue = ref({});

  const emit = defineEmits(['success', 'fail']);
  formValue.value = props.isCreate ? {} : props.formData;
  const formRules = {};
  const ruleFormRef = ref<FormInstance>();
  watch(
    () => props.formData,
    (val) => {
      formValue.value = val || {};
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => props.formList,
    (value) => {
      value.map((item) => {
        if (item.ifShow !== false) {
          let addRules: any[] = [];
          if (item.required) {
            addRules.push({
              required: true,
              message: item.label.slice(0, item.label.length - 1) + '不能为空',
              trigger: 'blur',
            });
          }
          if (item.dynamicRules) {
            addRules = [...addRules, ...item.dynamicRules];
          }
          if (item.rules) {
            addRules = [...addRules, ...item.rules];
          }
          formRules[item.field] = addRules;
          props.isCreate && (formValue.value[item.field] = '');
        }
      });
      // formRules = ref(...fValue);
    },
    { immediate: true, deep: true },
  );

  // 重置
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  // 表单提交
  const submitForm = async (
    formEl: FormInstance | undefined,
    cb?: Function | undefined,
  ) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!', valid);
        emit('success', formValue.value);
        cb && cb('success', formValue.value);
      } else {
        console.log('error submit!', fields);
        cb && cb('fail', fields);
        emit('fail', fields);
      }
    });
  };

  /**
   * 验证数据，触发success事件
   */
  function formValid(cb: Function | undefined = undefined) {
    submitForm(ruleFormRef.value, cb);
  }

  defineExpose({ formValue, submitForm, ruleFormRef, formValid });
</script>
<style scoped>
  .form-bottom {
    display: flex;
    justify-content: center;
  }

  .form-all {
    padding: 10px;
  }

  .el-select {
    width: 100%;
  }
</style>
