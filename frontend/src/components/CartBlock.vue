<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="item in productsFormat" :key="item.id">
        <h3>{{ item.title }}</h3>
        <b>{{ item.priceFormat }} </b>
        <span>Артикул: {{ item.id }}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>Итого: <b>{{ totalAmounts }}</b> товара на сумму <b>{{ totalSumFormat }} ₽</b></p>
      <p>{{ cuteDeliveryType }}</p>
      <p>Итого к оплате: <b>{{ itogoSumFormat }} ₽</b></p>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['products', 'totalSum', 'totalAmounts', 'cuteDeliveryType', 'deliveryPrice'],
  setup(props) {
    const totalSumFormat = computed(() => numberFormat(props.totalSum) || '');
    const itogoSumFormat = computed(() => numberFormat(Number(props.totalSum) + Number(props.deliveryPrice)) || '');
    const productsFormat = computed(() => props.products.map((item) => ({
      ...item,
      priceFormat: `${item.quantity} x ${numberFormat(item.price)} ₽`,
    })) || []);
    return {
      totalSumFormat,
      itogoSumFormat,
      productsFormat,
    };
  },
};
</script>
