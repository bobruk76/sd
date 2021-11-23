<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { API_BASE_URL } from '@/config';

export default {
  setup() {
    const $store = useStore();
    const timeProductLoad = ref(null);
    const productsData = ref(null);
    const countProductPages = ref(null);
    const countProducts = computed(() => productsData.value.pagination.total);

    const fetchProducts = ({
      page,
      countPerPage,
      filterPriceFrom,
      filterPriceTo,
      colorId,
      filterCategoryId,
    }) => {
      $store.commit('preloaderChangeStatus', true);
      clearTimeout(timeProductLoad);
      timeProductLoad.value = setTimeout(() => axios.get(`${API_BASE_URL}/products`, {
        params: {
          page,
          limit: countPerPage,
          categoryId: filterCategoryId,
          colorId,
          minPrice: filterPriceFrom,
          maxPrice: filterPriceTo,
        },
      })
        .then(
          (response) => {
            const product = response.data;
            productsData.value = Object.assign(product, {
              img: product.image.file.url,
            });
            countProductPages.value = Math.ceil(countProducts.value / countPerPage);
          },
        )
        .catch(() => {
        })
        .then(
          () => {
            $store.commit('preloaderChangeStatus', false);
          },
        ), 0);
    };
    return {
      productsData,
      countProducts,
      countProductPages,
      fetchProducts,
    };
  },
};
</script>
