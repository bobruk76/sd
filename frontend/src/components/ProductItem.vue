<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.img" :alt="product.title">
    </router-link>
    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ productPrice }} ₽
    </span>

    <ul class="colors colors&#45;&#45;black">
      <li class="colors__item" v-for="(item, key) in product.colors" :key="key">
        <label class="colors__label">
          <input class="colors__radio sr-only"
                 type="radio"
                 :value="item.color.id"
                 v-model="currentColorId"
                 :checked="item.color.id === currentColorId"
          >
          <span class="colors__value"
                :style="'background-color: ' + item.color.code + ';'">
          </span>
        </label>
      </li>
    </ul>
    <button class="button" type="submit" @click.prevent="doAddToCart">
      В корзину
    </button>

  </li>
</template>

<script>
import { computed, ref } from 'vue';
import numberFormat from '@/helpers/numberFormat';
import useProduct from '@/hooks/useProduct.vue';

export default {
  props: ['product'],
  setup(props) {
    const productPrice = computed(() => numberFormat(props.product.price));
    const currentColorId = ref(props.product.colors[0].color.id);
    const productAmount = ref(1);
    const productOfferId = computed(() => props.product.offers[0].id);
    const {
      addToCart,
    } = useProduct();
    const doAddToCart = () => {
      addToCart({
        currentProductOfferId: productOfferId.value,
        colorId: currentColorId.value,
        quantity: productAmount.value,
      });
    };

    return {
      productPrice,
      currentColorId,
      doAddToCart,
    };
  },
};
</script>
<style scoped lang="stylus">
.button
  background-color: #9eff00
  border: 1px solid #9eff00
  font-family: "PressStart"
  color: #222
  font-size: 13px

  padding 10px
  margin-top 10px
  border-radius 5%
  &:hover
    background-color: #F0F0F0

.catalog__pic img
  object-fit: contain
</style>
