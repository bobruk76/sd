<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.img" width="120" height="120"
           :alt="item.title">
    </div>
    <h3 class="product__title">
      {{ item.title }}
    </h3>
    <p class="product__info">
      {{ item.productOffer.product.mainProp.title }}: <span>{{ item.productOffer.propValues[0].value }}</span>
    </p>

    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="'background-color: ' + item.color.color.code"></i>
        {{ item.color.color.title }}
      </span>
    </p>

    <span class="product__code">Артикул: {{ item.id }}</span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар"
              @click.prevent="doDecrementProduct"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count">

      <button type="button" aria-label="Добавить один товар"
              @click.prevent="doIncrementProduct">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ itemTotalPrice }} ₽
    </b>

    <button class="product__del button-del"
            type="button" aria-label="Удалить товар из корзины"
            @click.prevent="doRemoveProduct"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import {
  computed, onMounted, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['item'],

  setup(props) {
    const store = useStore();
    const amount = ref(null);
    const basketItemId = ref(null);
    const doIncrementProduct = () => {
      amount.value += 1;
    };
    const doDecrementProduct = () => {
      amount.value -= 1;
    };
    const doRemoveProduct = () => {
      store.dispatch('removeProduct', basketItemId.value);
    };
    const itemTotalPrice = computed(() => numberFormat(props.item.totalPrice));

    watch(amount, () => {
      if (amount.value > 0) {
        store.dispatch('updateProductToCart', { basketItemId: basketItemId.value, amount: amount.value });
      } else {
        doRemoveProduct();
      }
    });
    onMounted(() => {
      basketItemId.value = props.item.id;
      amount.value = props.item.amount;
    });

    return {
      amount,
      doIncrementProduct,
      doDecrementProduct,
      doRemoveProduct,
      itemTotalPrice,
    };
  },
};
</script>
<style scoped>
.product {
  grid-template-rows: repeat(4, min-content);
}
.product__info {
    grid-row: 1/4;
}
.product__info--color {
    grid-row: 2/4;
}
.product__code {
  grid-row: 4/4;
}
</style>
