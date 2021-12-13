<template>
  <base-form-field :title="title" :placeholder="placeholder" :error="error">
    <textarea class="form__input form__input--area"
              v-model="dataValue"
              :name="name"
              :placeholder="placeholder"
    >
    </textarea>
    <span class="form__value">{{ title }}</span>
  </base-form-field>
</template>

<script>
import { ref, watch } from 'vue';
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  props: ['name', 'title', 'error', 'placeholder', 'modelValue'],
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
