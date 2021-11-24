<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { API_BASE_URL } from '@/config';

export default function () {
  const $store = useStore();
  const timeProductLoad = ref(null);
  const productsData = ref(null);
  const countProductPages = ref(0);
  const countProducts = computed(() => productsData.value.pagination.total);

  const fetchProducts = (
    page,
    countPerPage,
    filterPriceFrom,
    filterPriceTo,
    colorId,
    filterCategoryId,
  ) => {
    $store.commit('preloaderChangeStatus', true);
    clearTimeout(timeProductLoad);
    timeProductLoad.value = setTimeout(() => axios.get(`${API_BASE_URL}/products`, {
      params: {
        page: page.value,
        limit: countPerPage.value,
        categoryId: filterCategoryId.value,
        colorId: colorId.value,
        ...(+filterPriceFrom.value > 0 ? { minPrice: filterPriceFrom.value } : null),
        ...(+filterPriceTo.value > 0 ? { maxPrice: filterPriceTo.value } : null),
      },
    })
      .then(
        (response) => {
          productsData.value = response.data.items.map((item) => ({
            ...item,
            img: item.preview.file.url,
          }));
          countProductPages.value = response.data.pagination.pages;
          // page.value = response.data.pagination.page;
          // countPerPage.value = response.data.pagination.page;
        },
      )
      .catch((response) => {
        console.log(response);
      })
      .then(() => {
        $store.commit('preloaderChangeStatus', false);
      }), 0);
  };

  return {
    products: productsData,
    countProducts,
    countProductPages,
    fetchProducts,
  };
}
</script>
