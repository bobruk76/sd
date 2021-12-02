<template>
  <li class="cart__order">
    <h3>{{ item.title }}</h3>
    <b>{{ item.quantity }} x {{ itemPrice }} ₽</b>
    <span>Артикул: {{ item.id }}</span>
  </li>
</template>

<script>
import { computed } from 'vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['item'],
  setup(props) {
    const itemPrice = computed(() => numberFormat(props.item.price));
    return {
      itemPrice,
    };
  },
};
</script>
