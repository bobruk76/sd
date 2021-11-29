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
        v-model:product-props="productProps"
        v-model:page="page"
        v-model:color-id="colorId"
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
    const productProps = ref(null);
    const colorId = ref(0);
    const {
      products, totalProducts, countProductPages, fetchProducts,
    } = useProductsList();
    const getProducts = async () => {
      fetchProducts(
        page,
        countPerPage,
        filterPriceFrom,
        filterPriceTo,
        // colorId,
        filterCategoryId,
        productProps,
      );
    };
    onBeforeMount(() => {
      filterCategoryId.value = ('categoryId' in $route.params) ? $route.params.categoryId : 0;
    });
    onMounted(getProducts);
    watch([
      page, colorId, filterCategoryId, filterPriceFrom, filterPriceTo, productProps,
    ], getProducts);
    return {
      page,
      countPerPage,
      filterPriceFrom,
      filterPriceTo,
      colorId,
      filterCategoryId,
      productProps,
      products,
      totalProducts,
      countProductPages,
      fetchProducts,
    };
  },

  // data() {
  //   return {
  //     page: 1,
  //     countPerPage: 4,
  //     filterPriceFrom: 0,
  //     filterPriceTo: 0,
  //     colorId: 0,
  //     filterCategoryId: 0,
  //     productsData: null,
  //   };
  // },
  //
  // computed: {
  //   countProducts() {
  //     return this.productsData ? this.productsData.pagination.total : 0;
  //   },
  //
  //   countProductPages() {
  //     return Math.ceil(this.countProducts / this.countPerPage);
  //   },
  //
  //   products() {
  //     return this.productsData ? this.productsData.items.map((item) => ({
  //       ...item,
  //       img: item.image.file.url,
  //     })) : [];
  //   },
  // },

  // methods: {
  //   ...mapMutations(['preloaderChangeStatus']),
  //
  //   getProducts() {
  //     this.preloaderChangeStatus(true);
  //     clearTimeout(this.timeProductLoad);
  //     this.timeProductLoad = setTimeout(() => axios.get(`${API_BASE_URL}/products`, {
  //       params: {
  //         page: this.page,
  //         limit: this.countPerPage,
  //         categoryId: this.filterCategoryId,
  //         colorId: this.colorId,
  //         minPrice: this.filterPriceFrom,
  //         maxPrice: this.filterPriceTo,
  //       },
  //     })
  //       .then(
  //         (response) => {
  //           this.productsData = response.data;
  //         },
  //       )
  //       .catch(() => {
  //       })
  //       .then(
  //         () => {
  //           this.preloaderChangeStatus(false);
  //         },
  //       ), 2000);
  //   },
  // },
  // watch: {
  //   page() {
  //     this.getProducts();
  //   },
  //
  //   filterCategoryId() {
  //     this.getProducts();
  //   },
  //
  //   colorId() {
  //     this.getProducts();
  //   },
  //
  //   filterPriceFrom() {
  //     this.getProducts();
  //   },
  //
  //   filterPriceTo() {
  //     this.getProducts();
  //   },
  //
  // },
  //
  // created() {
  //   this.filterCategoryId = this.$route.params.categoryId || 0;
  //   this.getProducts();
  // },

};
</script>
