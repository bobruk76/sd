<script>
import axios from 'axios';
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
    // colorId,
    filterCategoryId,
    productProps,
  ) => {
    $store.commit('preloaderChangeStatus', true);
    clearTimeout(timeProductLoad);
    timeProductLoad.value = setTimeout(() => axios.get(`${API_BASE_URL}/products`, {
      params: {
        page: page.value,
        limit: countPerPage.value,
        categoryId: filterCategoryId.value,
        // colorId: colorId.value,
        ...(+filterPriceFrom.value > 0 ? { minPrice: filterPriceFrom.value } : null),
        ...(+filterPriceTo.value > 0 ? { maxPrice: filterPriceTo.value } : null),
        // ...(productProps.value === null ? null : {
        //   props: Object.keys(productProps.value).map((key) => [
        //     key, productProps.value[key],
        //   ]),
        // }),

        ...(productProps.value === null ? null : { props: JSON.stringify(productProps.value) }),
      },
    })
      .then(
        (response) => {
          productsData.value = response.data.items.map((item) => ({
            ...item,
            img: item.preview.file.url,
          }));
          countProductPages.value = response.data.pagination.pages;
          totalProducts.value = response.data.pagination.total;
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
    totalProducts,
    countProductPages,
    fetchProducts,
  };
}
</script>
