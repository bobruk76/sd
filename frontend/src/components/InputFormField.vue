<template>
  <base-form-field :title="title" :placeholder="placeholder" :error="error">
    <input class="form__input"
           v-model="dataValue"
           :type="type"
           :name="name"
           :placeholder="placeholder"
    >
  </base-form-field>
</template>

<script>
import { ref, watch } from 'vue';
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  props: ['type', 'name', 'title', 'error', 'placeholder', 'modelValue'],
  components: { BaseFormField },
  setup(props, { emit: $emit }) {
    const dataValue = ref(props.modelValue);
    watch(dataValue, (newValue) => {
      $emit('update:modelValue', newValue);
    });
    return {
      dataValue,
    };
  },
};
</script>
