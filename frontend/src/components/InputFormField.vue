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
import formFieldMixin from '@/mixins/formFieldMixin';
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  components: { BaseFormField },
  mixins: [formFieldMixin],
  props: ['type'],
};
</script>
