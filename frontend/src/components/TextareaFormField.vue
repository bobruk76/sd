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
import formFieldMixin from '@/mixins/formFieldMixin';
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  components: { BaseFormField },
  mixins: [formFieldMixin],
};
</script>
