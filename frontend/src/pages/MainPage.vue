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
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:product-props="filterProductProps"
        v-model:page="page"
      >
      </product-filter>
      <section class="catalog">
        <product-list :products="products"></product-list>
        <base-paginate :count-pages="countProductPages" v-model="page"></base-paginate>
      </section>
    </div>
  </main>
</template>

<script>
import {
  onBeforeMount, onMounted, ref, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import ProductList from '@/components/ProductList.vue';
import BasePaginate from '@/components/BasePaginate.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import useProductsList from '@/hooks/useProductsList.vue';

export default {
  components: { ProductList, BasePaginate, ProductFilter },
  setup() {
    const $route = useRoute();
    const filterCategoryId = ref(0);
    const page = ref(1);
    const countPerPage = ref(4);
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
        filterProductProps,
      );
    };
    onBeforeMount(() => {
      filterCategoryId.value = ('categoryId' in $route.params) ? $route.params.categoryId : 0;
    });
    onMounted(getProducts);
    watch([
      page, filterCategoryId, filterPriceFrom, filterPriceTo,
    ], (newValue, oldValue) => {
      console.log(oldValue, newValue);
      getProducts();
    });

    return {
      page,
      countPerPage,
      filterPriceFrom,
      filterPriceTo,
      filterCategoryId,
      filterProductProps,
      products,
      totalProducts,
      countProductPages,
      fetchProducts,
    };
  },
};
</script>
