<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <cart-block-item v-for="item in products" :item="item" :key="item.id" >
      </cart-block-item>
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
import CartBlockItem from '@/components/CartBlockItem.vue';
import numberFormat from '@/helpers/numberFormat';

export default {
  components: { CartBlockItem },
  props: ['products', 'totalSum', 'totalAmounts', 'cuteDeliveryType', 'deliveryPrice'],
  setup(props) {
    const totalSumFormat = computed(() => numberFormat(props.totalSum) || '');
    const itogoSumFormat = computed(() => numberFormat(Number(props.totalSum) + Number(props.deliveryPrice)) || '');
    return {
      totalSumFormat,
      itogoSumFormat,
    };
  },
};
</script>
