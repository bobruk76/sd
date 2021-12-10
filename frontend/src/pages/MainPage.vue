<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        Количество товаров {{ totalProducts }}
      </span>
    </div>

    <div class="content__catalog">
      <product-filter
        v-model:price-from.number="filterPriceFrom"
        v-model:price-to.number="filterPriceTo"
        v-model:category-id.number="filterCategoryId"
        v-model:color-id.number="filterColorId"
        v-model:product-props="filterProductProps"
        v-model:page.number="page"
        v-model:count-per-page="countPerPage"
        :options="options"
        @emGetProducts="getProducts"
      >
      </product-filter>
      <section class="catalog">
        <product-list :products="products"></product-list>
        <base-paginate :count-pages="countProductPages" v-model:page.number="page">
        </base-paginate>
      </section>
    </div>
  </main>
</template>

<script>
import {
  onBeforeMount, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import ProductList from '@/components/ProductList.vue';
import BasePaginate from '@/components/BasePaginate.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import useProductsList from '@/hooks/useProductsList.vue';

export default {
  components: { ProductList, BasePaginate, ProductFilter },
  setup() {
    const $route = useRoute();
    const $store = useStore();
    const options = $store.getters.getOptions;
    const filterCategoryId = ref(0);
    const filterColorId = ref(0);
    const page = ref(1);
    const countPerPage = ref(null);
    const filterPriceFrom = ref(0);
    const filterPriceTo = ref(0);
    const filterProductProps = ref({});

    const {
      products, totalProducts, countProductPages, fetchProducts,
    } = useProductsList();
    const getProducts = async () => {
      fetchProducts(
        page,
        countPerPage,
        filterPriceFrom,
        filterPriceTo,
        filterCategoryId,
        filterColorId,
        filterProductProps,
      );
    };
    onBeforeMount(() => {
      filterCategoryId.value = ('categoryId' in $route.params) ? $route.params.categoryId : 0;
      countPerPage.value = options[0].value;
      getProducts();
    });
    watch([page, countPerPage], getProducts);

    return {
      page,
      countPerPage,
      filterPriceFrom,
      filterPriceTo,
      filterCategoryId,
      filterColorId,
      filterProductProps,
      products,
      totalProducts,
      countProductPages,
      fetchProducts,
      options,
      getProducts,
    };
  },
};
</script>
