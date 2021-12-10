<script>
import axios from 'axios';
import qs from 'qs';
import { useStore } from 'vuex';
import { ref } from 'vue';
import { API_BASE_URL } from '@/config';

export default function () {
  const $store = useStore();
  const timeProductLoad = ref(null);
  const productsData = ref(null);
  const countProductPages = ref(0);
  const totalProducts = ref(0);
  const fetchProducts = (
    page,
    countPerPage,
    filterPriceFrom,
    filterPriceTo,
    filterCategoryId,
    filterColorIds,
    filterProductProps,
  ) => {
    $store.commit('preloaderChangeStatus', true);
    clearTimeout(timeProductLoad);
    timeProductLoad.value = setTimeout(() => axios.get(`${API_BASE_URL}/products`, {
      params: {
        page: page.value,
        limit: countPerPage.value,
        categoryId: filterCategoryId.value,
        ...(+filterPriceFrom.value > 0 ? { minPrice: filterPriceFrom.value } : null),
        ...(+filterPriceTo.value > 0 ? { maxPrice: filterPriceTo.value } : null),
        ...(filterProductProps.value === null ? null : { props: filterProductProps.value }),
      },
      paramsSerializer: (params) => qs.stringify(params),
    })
      .then(
        (response) => {
          const responseDataItems = response.data.items.filter((item) => {
            const itemColorIds = item.colors.filter((color) => filterColorIds.value.includes(color.color.id));
            return itemColorIds.length > 0 || filterColorIds.value.length === 0;
          });
          productsData.value = responseDataItems.map((item) => ({
            ...item,
            img: item.preview.file.url,
          }));
          countProductPages.value = response.data.pagination.pages;
          totalProducts.value = response.data.pagination.total;
        },
      )
      .catch(() => {})
      .then(() => {
        $store.commit('preloaderChangeStatus', false);
      }), 0);
  };

  return {
    products: productsData,
    totalProducts,
    countProductPages,
    fetchProducts,
  };
}
</script>
