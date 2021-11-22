<template>
  <ul class="catalog__list">
    <product-item v-for="product in products" :key="product.id" :product="product"></product-item>
  </ul>
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  props: ['products'],
  components: {
    ProductItem,
  },
};
</script>
